import { EventData, Observable } from "tns-core-modules/data/observable";
import * as application from 'tns-core-modules/application'
import * as platform from 'tns-core-modules/platform'
import * as color from 'tns-core-modules/color'
import { Page, ContainerView } from "tns-core-modules/ui/page";
import { Navigations } from "~/utilities/navigations";
import { Utils } from "~/utilities/Utils";
import { appData } from "~/app";
declare var android;
export var scheduledContext: scheduledChatsModel;
export class scheduledChatsModel extends Observable {
    private page: Page;
    public navigation: Navigations;
    public applicationModel: appData = application["data"];
    public pageTitle: string = "Scheduled Messages";
    constructor() {
        super();
        // Add the navigations to the model class
        this.applicationModel.addHandler('home-tab-changed', 'scheduled', this.homeTabChanged);
    }
    homeTabChanged(parentView) {
        if (parentView.selectedPage == 1) {
            var $this = scheduledContext;
            parentView.actionBar.bindingContext.title = $this.pageTitle;
        }
    }
    setRootView(page: Page) {
        this.page = page;
        this.navigation = new Navigations(page);
    }
}
scheduledContext = new scheduledChatsModel();
export function loaded(args: EventData) {
    const page = <Page>args.object;
    scheduledContext.setRootView(page);
    page.bindingContext = scheduledContext;
} 