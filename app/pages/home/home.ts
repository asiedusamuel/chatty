import * as application from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { Button } from "tns-core-modules/ui/button/button";
import { Page } from "tns-core-modules/ui/page";
import { SelectedIndexChangedEventData, TabView } from "tns-core-modules/ui/tab-view";
import { appData } from "~/app";
import { Navigations } from "~/utilities/navigations";

declare var android;

declare const CGSizeMake: any;
declare var android;
export class homeModel extends Observable {
    protected page: Page;
    public navigation: Navigations;
    public applicationModel: appData = application["data"];
    public _selectedPage: number;
    private tabContainer:TabView;
    constructor(page: Page) {
        super();
        this.page = page;
        // Add the navigations to the model class
        this.navigation = new Navigations(page);
        setTimeout(() => {
            this.applicationModel.statusBarColor = "#6db94f";
        }, 100);
        this.tabContainer = this.page.getViewById("tabViewContainer");
        setTimeout(() => {
            if (application.android) {
                this.tabContainer.android.removeViewAt(1);
            } else {
                this.tabContainer.ios.tabBar.hidden = true;
            }
        }, 100);
        // Set active
        this.selectedPage = 0;
    }


    public get selectedPage(): number { return this._selectedPage; }

    public set selectedPage(v: number) { this._selectedPage = v; this.notifyPropertyChange("selectedPage", v); }

    public tabChange(args: EventData) {
        const tabItem = <Button>args.object;
        let index: number = tabItem.get("index");
        this.selectedPage = index;
        this.tabContainer.selectedIndex = index;
    }
    public onSelectedIndexChanged(args:SelectedIndexChangedEventData){
        if (args.oldIndex !== -1) {
            const newIndex = args.newIndex;
            this.selectedPage = newIndex;
        }
    }
}
export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    if (!page.bindingContext) page.bindingContext = new homeModel(page);
} 