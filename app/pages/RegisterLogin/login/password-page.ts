import { FinalEventData, Img } from "nativescript-image";
import * as application from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { Page } from "tns-core-modules/ui/page";
import { appData } from "~/app";
import { Navigations } from "~/utilities/navigations";
import { Utils } from "~/utilities/Utils";
import { API } from "~/Services/api-request";
import { alertType } from "~/components/alert-box";
import Users from "~/Database/models/Users";
import { getConnection } from "typeorm/browser";
import Conversations from "~/Database/models/Conversations";

export class LoginPasswordModel extends Observable {
    protected page: Page;
    public navigation: Navigations;
    static $parent;
    private alertBox: StackLayout;
    private loaderPanel: StackLayout;
    private _accountPassword: string;
    public applicationModel: appData = application["data"];
    constructor(page) {
        super();
        this.page = page;
        this.navigation = new Navigations(page);
        this.loaderPanel = page.getViewById('loader-panel');
        this.applicationModel.statusBarColor = "#FFFFFF";
        this.alertBox = page.getViewById('alert-box');
        this.displayPicture = API.serverAddress +'/assets/profile/'+(<any>this.applicationModel).temp.uid+'.png';
        
    }
    get accountPassword(): string { return this._accountPassword; };
    set accountPassword(value: string) {
        if (this._accountPassword !== value) {
            this._accountPassword = value;
            this.notifyPropertyChange("accountPassword", value);
        }
    }
    public get displayPicture() : any {
        return this.get("_displayPicture");
    }

    public set displayPicture(v : any) {
        this.set("_displayPicture", v);
    }

    initialsImg(): ImageSource {
        const initials = Utils.createInitials((<any>this.applicationModel).temp.displayName);
        var image = Utils.initialsImg({ size: 200, initials: initials });
        this.notifyPropertyChange('initialsImg', image);
        return image;
    }


    private showLoader() {
        this.loaderPanel.bindingContext.Show();
    }

    private hideLoader() {
        this.loaderPanel.bindingContext.Hide();
    }

    public checkLogin() {
        var accountPassword = this.page.getViewById('password-input').get('text');
        if (accountPassword) {
            this.showLoader();
            API.checkAccountPassword((<any>this.applicationModel).temp.uid, accountPassword).then((data: any) => {
                return JSON.parse(data)
            }).then(async (data: any) => {
                if (data.success) {
                    await this.applicationModel.clearDatabase(); 
                    this.applicationModel.user = data.user;                   
                    let user = new Users();
                    user.uid = this.applicationModel.user.uid;
                    user.email = this.applicationModel.user.email;
                    user.userNumber = this.applicationModel.user.userNumber;
                    user.displayName = this.applicationModel.user.displayName;
                    user.profilePicture = this.applicationModel.user.profilePicture;
                    user.loggedIn = true;
                    user.save().then(() => {
                        this.navigation.navigateToHome();
                    });
                } else {
                    this.hideLoader();
                    this.alertBox.bindingContext.alert(alertType.error, data.message);
                }
            }).catch(err => {
                this.hideLoader();
                this.alertBox.bindingContext.alert(alertType.error, err);
            });
        } else {
            this.alertBox.bindingContext.alert(alertType.error, "Enter a password");
        }
    }

    public onFinalImageSet(args: FinalEventData) {
        var img = <Img>args.object;
    }
}
// Add the navigations to the model class

export function loaded(args: EventData) {
    const page = <Page>args.object;
    if (!page.bindingContext) {
        page.bindingContext = new LoginPasswordModel(page);
    }
}

export function backEvent(args) {
    args.cancel = true;
}