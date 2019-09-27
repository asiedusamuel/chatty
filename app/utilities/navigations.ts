import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { Utils } from "./Utils";
export class Navigations{
    page: Page;
    constructor($currentPage: Page) {
        this.page = $currentPage
    }
    public example(args: EventData){
        //const button: Button = <Button>args.object;
        //const page: Page = button.page;
        //page.frame.navigate({moduleName:"pages/loader/page",clearHistory:true});
    };

    public navigateBack(args?: any){
        this.page.frame.goBack();
    }
    public navigateToLogin(args?: any){
        this.page.frame.navigate({moduleName:"pages/RegisterLogin/login/page"});
    }
    public navigateToLoginPassword(args?: any){
        this.page.frame.navigate({moduleName:"pages/RegisterLogin/login/password-page", transition:{name: 'slide'}});
    }
    public navigateToRememberPass(args?: any){
        this.page.frame.navigate({moduleName:"pages/RegisterLogin/login/reset-password-page"});
    }
    public navigateToRegister(args?: any){ 
        this.page.frame.navigate({moduleName:"pages/RegisterLogin/register/page"});
    } 
    public navigateToRegisterSuccess(args?: any){ 
        this.page.frame.navigate({moduleName:"pages/RegisterLogin/register/signup-success"});
    } 
    public navigateToVerifyCode(args?: any){
        this.page.frame.navigate({moduleName:"pages/RegisterLogin/register/verify-code"});
    }
    public navigateToRegDisplayName(args?: any){
        this.page.frame.navigate({moduleName:"pages/RegisterLogin/register/display-name",clearHistory:true});
    }
    public navigateToRegisterLogin(args?: any){ 
        //console.log(this.page.frame.navigate);
        this.page.frame.navigate({moduleName:"pages/RegisterLogin/page",clearHistory:true});
    }
    public navigateToHome(args?: any){ 
        this.page.frame.navigate({moduleName:"pages/home/home",clearHistory:true});
    } 
}
