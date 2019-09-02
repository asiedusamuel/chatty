import * as application from 'tns-core-modules/application';
import { EventData, Observable } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { appData } from '~/app';
import { Navigations } from "~/utilities/navigations"; 
import Users from '~/Database/models/Users';
export var StartUpContext:StartUpModel;
declare var android;
export class StartUpModel extends Observable {
    protected page: Page;
    public navigation: Navigations;
    public appModel: appData = application["data"];
    constructor(page: Page) {
        super(); 
        this.page = page;
        // Initiation stage
        this.appModel.customStatusBarColor("#ffffff");
        //Add the navigations to the model class
        this.navigation = new Navigations(page);
        setTimeout(() => {
            this.checkAuthentication();
        }, 100);
        
    }

    public checkAuthentication() {
        Users.find({ where: { loggedIn: true}}).then((user) => {
            if(user.length){
                this.navigation.navigateToHome();
            }else{
                this.navigation.navigateToRegisterLogin();
            }         
        }).catch(console.error)
    }
}
export function loaded(args: EventData) {
    const page = <Page>args.object;
    const context = new StartUpModel(page);
    if (page.bindingContext != context) page.bindingContext = context;
} 