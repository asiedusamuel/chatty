import { EventData, Observable } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import * as application from "tns-core-modules/application";
import { appData } from "~/app";
import { Navigations } from "~/utilities/navigations";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
class RegisterModel extends Observable{
    public navigation;
    protected page: Page;
    private registerPanel: GridLayout;
    private loaderPanel: StackLayout;
    public applicationModel:appData = application["data"];
    private _isLoading:boolean = false;
    constructor(page:Page) {
        super();
        this.page = page;
        this.navigation = new Navigations(page);
        this.isLoading = false;
        this.registerPanel = page.getViewById('register-panel');
        this.loaderPanel = page.getViewById('loader-panel'); 
        //Initialize default values.
        setTimeout(() => {
            this.applicationModel.customStatusBarColor("#ffffff");
        }, 500);        
    }
    
    public get isLoading() : boolean {
        return this._isLoading;
    }
    private showLoader(){
        this.registerPanel.visibility = "collapse";
        this.loaderPanel.visibility = "visible";
    }

    private hideLoader(){
        this.registerPanel.visibility = "visible";
        this.loaderPanel.visibility = "collapse";
    }
    public set isLoading(v : boolean) {
        //if(v != this._isLoading){
            this._isLoading = v;
            this.notifyPropertyChange("isLoading", v)
        //}
    }

    signUp(){
        //this.navigation.navigateToLoader();
        this.showLoader()
        setTimeout(() => {
            this.navigation.navigateToRegisterSuccess();
            setTimeout(() => {
                this.hideLoader();
            }, 1000);
        }, 2000);
    }
    
    
    
}
export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new RegisterModel(page);
} 