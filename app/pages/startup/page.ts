import * as application from 'tns-core-modules/application';
import { EventData, Observable } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { appData } from '~/app';
import { Navigations } from "~/utilities/navigations";
declare var android;
export class StartUpModel extends Observable {
    protected page: Page;
    public navigation: Navigations;
    public applicationModel:appData = application["data"];
    constructor(page: Page) {
        super();
        this.page = page;
        // Initiation stage
        this.checkAuthentication();
        //Add the navigations to the model class
        this.navigation = new Navigations(page);
        this.applicationModel.statusBarColor= "#ffffff";
    }

    public checkAuthentication() {
        setTimeout(() => {
            //this.navigation.navigateToRegisterLogin();
            this.navigation.navigateToHome();
        }, 1000);
    }
}
export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    if (!page.bindingContext) page.bindingContext = new StartUpModel(page);
} 