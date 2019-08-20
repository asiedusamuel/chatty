import { EventData, Observable } from "tns-core-modules/data/observable";
import * as application from "tns-core-modules/application";
import { Page } from "tns-core-modules/ui/page";
import { Navigations } from "~/utilities/navigations";
import { Utils } from "~/utilities/Utils";
import { appData } from "~/app";
class RegisterLoginModel extends Observable{
    public navigation;
    public Utils = Utils;
    protected page: Page;
    public applicationModel:appData = application["data"];
    constructor(page:Page) {
        super();
        this.page = page;
        this.navigation = new Navigations(page);
        //Initialize default values.
        this.applicationModel.statusBarColor= "#ffffff";
    }
}
export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    if(!page.bindingContext) page.bindingContext = new RegisterLoginModel(page);
} 