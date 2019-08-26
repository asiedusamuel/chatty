import { FinalEventData, Img } from "nativescript-image";
import * as application from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { Page } from "tns-core-modules/ui/page";
import { appData } from "~/app";
import { Navigations } from "~/utilities/navigations";
import { Utils } from "~/utilities/Utils";

export class LoginPasswordModel extends Observable{
    protected page: Page; 
    public navigation: Navigations;
    static $parent;
    private loginPanel: StackLayout;
    private loaderPanel: StackLayout;
    private profileImge: Img;
    private _loading: boolean = false;
    public applicationModel:appData = application["data"];
    constructor(page) {
        super();
        this.page = page;
        this.navigation = new Navigations(page);
        this.loginPanel = page.getViewById('login-panel');
        this.loaderPanel = page.getViewById('loader-panel');               
        this.profileImge = page.getViewById('profile-image');               
        this.applicationModel.statusBarColor= "#FFFFFF";
    }

    
    initialsImg(initials: string) : ImageSource {
        var image = Utils.initialsImg({size: 200, initials:initials});
        this.notifyPropertyChange('initialsImg',image);
        return image;
    }
    

    private showLoader(){
        this.loginPanel.visibility = "collapse";
        this.loaderPanel.visibility = "visible";
        this._loading = true;
    }

    private hideLoader(){
        this.loginPanel.visibility = "visible";
        this.loaderPanel.visibility = "collapse";
        this._loading = false;
    }

    public checkLogin() {
        this.showLoader();
        setTimeout(() => {
            this.navigation.navigateToHome();
            setTimeout(() => {
                this.hideLoader();
            }, 1000);
        }, 1000);
    }
    public onFinalImageSet(args: FinalEventData) {
        var img = <Img>args.object;
        console.log(img);
        
    }
}
// Add the navigations to the model class

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    if(!page.bindingContext){
        page.bindingContext = new LoginPasswordModel(page);
    }    
}

export function backEvent(args) {
    args.cancel = true;
}