import * as application from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { Page } from "tns-core-modules/ui/page";
import { appData } from "~/app";
import { Navigations } from "~/utilities/navigations";
import { Img } from "nativescript-image";

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
        }, 2000);
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