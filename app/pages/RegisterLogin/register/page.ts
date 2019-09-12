import { EventData, Observable } from "tns-core-modules/data/observable";
import { Page, ShowModalOptions } from "tns-core-modules/ui/page";
import * as application from "tns-core-modules/application";
import { appData } from "~/app";
import { Navigations } from "~/utilities/navigations";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { TextField } from "tns-core-modules/ui/text-field/text-field";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { Label } from "tns-core-modules/ui/label/label";
import { alertType } from "~/components/alert-box";
import { API } from "~/Services/api-request";
class RegisterModel extends Observable{
    public navigation;
    protected page: Page;
    private alertBox: StackLayout;
    private loaderPanel: StackLayout;
    public applicationModel:appData = application["data"];
    private _isLoading:boolean = false;
    private txtPass:TextField;
    constructor(page:Page) {
        super();
        this.page = page;
        this.navigation = new Navigations(page);
        this.isLoading = false;
        this.loaderPanel = page.getViewById('loader-panel'); 
        this.txtPass = this.page.getViewById("accountPassword");
        this.alertBox = page.getViewById('alert-box');
        //Initialize default values.
        setTimeout(() => {
            this.applicationModel.customStatusBarColor("#ffffff");
        }, 500);        
    }
    
    public get isLoading() : boolean {
        return this._isLoading;
    }
    private showLoader() {
        this.loaderPanel.bindingContext.Show();
    }

    private hideLoader() {
        this.loaderPanel.bindingContext.Hide();
    }

    public set isLoading(v : boolean) {
        //if(v != this._isLoading){
            this._isLoading = v;
            this.notifyPropertyChange("isLoading", v)
        //}
    }

    public signUp(){
        var userNumber = this.page.getViewById('userNumber').get('text');
        var accountPassword = this.page.getViewById('accountPassword').get('text');
        var email = this.page.getViewById('accountEmail').get('text');
        if(!userNumber){
            this.alertBox.bindingContext.alert(alertType.error, "Enter your number");
            return false;
        }
        if (userNumber && userNumber.length < 9) {
            this.alertBox.bindingContext.alert(alertType.error, "Enter a valid phone number");
            return false;
        }
        if(!email){
            this.alertBox.bindingContext.alert(alertType.error, "Enter an email.");
            return false;
        }
        if(!this.validateEmail(email)){
            this.alertBox.bindingContext.alert(alertType.error, "Enter a valid email.");
            return false;
        }
        if(!accountPassword){
            this.alertBox.bindingContext.alert(alertType.error, "Enter a password");
            return false;
        }      
        this.showLoader();
        API.signUp(this.getFormattednumber(userNumber), String(email).trim(), String(accountPassword).trim()).then((data:any)=>{
            return JSON.parse(data);
        }).then(data =>{
            if (data.success) {
                setTimeout(() => {
                    this.hideLoader();
                }, 1000);
            }else{
                this.hideLoader();
                this.alertBox.bindingContext.alert(alertType.error, data.message);                
            }
        }).catch(err => {
            this.hideLoader();
            this.alertBox.bindingContext.alert(alertType.error, err);
            console.log(err)
        });
    }
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    private getFormattednumber(userNumber:string):string{
        return String(this.applicationModel.countryCode+userNumber).trim();
    }
    
    togglePassLabel(args:any){
        const label:Label = args.object;
        if(this.txtPass.get("secure")){
            this.txtPass.set("secure", false);
            label.set('text', String.fromCharCode(parseInt('e906', 16)));
        }else{
            this.txtPass.set("secure", true);
            label.set('text', String.fromCharCode(parseInt('e9a3', 16)));
        }
    }
    
    
}
export function loaded(args: EventData) {
    const page = <Page>args.object;
    const context = new RegisterModel(page);
    if(page.bindingContext != context) page.bindingContext = context;
}