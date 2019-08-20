import { EventData, Observable } from "tns-core-modules/data/observable";
import * as application from "tns-core-modules/application";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { Page } from "tns-core-modules/ui/page";
import { Navigations } from "~/utilities/navigations";
import { appData } from "~/app";
export class LoginModel extends Observable {
    protected page: Page;
    public navigation: Navigations;
    private loginPanel: StackLayout;
    private loaderPanel: StackLayout;
    private _userPassword: String;
    private _loading: boolean = false;
    public applicationModel:appData = application["data"];
    public test = "1234"
    constructor(page: Page) {
        super();
        this.page = page;
        // Add the navigations to the model class
        this.navigation = new Navigations(page);
        this.loginPanel = page.getViewById('login-panel');
        this.loaderPanel = page.getViewById('loader-panel');        
        this.applicationModel.statusBarColor= "#FFFFFF";
        //Utils.evaluateBackEvent(this, "goBack"); 
    }

    get userPassword():String{ return this._userPassword; };
    set userPassword(value: String){
        if (this._userPassword !== value) {
            this._userPassword = value;
            this.notifyPropertyChange("userPassword", value);
        }
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

    public onReturnKeyPress(){
        this.checkUserNumber();
    }

    public checkUserNumber() {
        //this.navigation.navigateToLoader();
        this.showLoader()
        setTimeout(() => {
            this.navigation.navigateToLoginPassword();
            setTimeout(() => {
                this.hideLoader();
            }, 1000);
        }, 2000);
    }
}

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    if(!page.bindingContext) page.bindingContext = new LoginModel(page);
    
} 
export function unloadPage(args: EventData){
    
}