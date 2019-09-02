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

export class LoginPasswordModel extends Observable{
    protected page: Page; 
    public navigation: Navigations;
    static $parent;
    private alertBox: StackLayout;
    private loginPanel: StackLayout;
    private loaderPanel: StackLayout;
    private profileImge: Img;
    private _loading: boolean = false;
    private _password: string;
    public applicationModel:appData = application["data"];
    constructor(page) {
        super();
        this.page = page;
        this.navigation = new Navigations(page);
        this.loginPanel = page.getViewById('login-panel');
        this.loaderPanel = page.getViewById('loader-panel');               
        this.profileImge = page.getViewById('profile-image');               
        this.applicationModel.statusBarColor= "#FFFFFF";
        this.alertBox = page.getViewById('alert-box');
    }
    get password(): string { return this._password; };
    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange("password", value);
        }
    }
    
    initialsImg() : ImageSource {
        const initials = Utils.createInitials(this.applicationModel.user.displayName);
        var image = Utils.initialsImg({size: 200, initials:initials});
        this.notifyPropertyChange('initialsImg',image);
        return image;
    }

    private showLoader() {
        this.loaderPanel.bindingContext.Show();
    }

    private hideLoader() {
        this.loaderPanel.bindingContext.Hide();
    }

    public checkLogin() {
        if (this.password) {
            this.showLoader();

            API.checkAccountPassword(this.applicationModel.user.userNumber, this.password).then((data: any) => {
                return JSON.parse(data)
            }).then((data: any) => {
                if (data.success) {
                    setTimeout(() => {
                        this.hideLoader();
                    }, 1000);
                    this.applicationModel.user = data.user;
                    this.navigation.navigateToLoginPassword();
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
    if(!page.bindingContext){
        page.bindingContext = new LoginPasswordModel(page);
    }    
}

export function backEvent(args) {
    args.cancel = true;
}