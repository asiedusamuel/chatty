import * as application from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { Button } from "tns-core-modules/ui/button/button";
import { Page, ViewBase, View } from "tns-core-modules/ui/page";
import { SelectedIndexChangedEventData, TabView } from "tns-core-modules/ui/tab-view";
import { appData } from "~/app";
import { Navigations } from "~/utilities/navigations";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { nQuery } from "~/utilities/nQuery";
import { agoTimer } from "~/utilities/Utils";

declare var android;
var $:nQuery;
declare const CGSizeMake: any;
declare var android;
export var context:homeModel;
export class homeModel extends Observable {
    protected page: Page;
    public navigation: Navigations;
    public applicationModel: appData = application["data"];
    public _selectedPage: number;
    private tabContainer: TabView;
    private actionBar: GridLayout;
    private _tabTitles: Array<string> = ["My Chats", "Schedules Messages", "My Contacts", "Settings"]
    constructor() {
        super();
        // Set active
        this.selectedPage = 0;
    }

    setRootView(page: Page) {
        this.page = page;
        //$ = new nQuery(this.page);
        //$.select("#tab").hide()
        // Add the navigations to the model class
        
        setTimeout(() => {
            this.navigation = new Navigations(page);
            this.applicationModel.customStatusBarColor("#6db94f");
            this.actionBar = page.getViewById('custom-action-bar');
            this.applicationModel.triggerHander('home-tab-changed', this);
            this.actionBar.bindingContext.BackAction = context.navigation.navigateBack;
        }, 100);
        this.tabContainer = this.page.getViewById("tabViewContainer");  
        setTimeout(() => {
            if (application.android) {
                this.tabContainer.android.removeViewAt(1);
            } else {
                this.tabContainer.ios.tabBar.hidden = true;
            }
            this.isReady = true;
        }, 200);
    }
    public get isReady(): boolean { return this['_isReady']; }
    public get selectedPage(): number { return this._selectedPage; }

    public set isReady(v: boolean) { if (v != this['_isReady']) { this['_isReady'] = v; this.notifyPropertyChange("_isReady", v); } }
    public set selectedPage(v: number) { if (v != this._selectedPage) { this._selectedPage = v; this.notifyPropertyChange("selectedPage", v); } }

    public tabChange(args: EventData) {
        const tabItem = <Button>args.object;
        let index: number = tabItem.get("index");
        this.tabContainer.selectedIndex = index;
    }

    public onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            const newIndex = args.newIndex;            
            this.selectedPage = newIndex;
            this.applicationModel.triggerHander('home-tab-changed', this);
        }
    }
}
context = new homeModel();
export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    context.setRootView(page)
    page.bindingContext = context;
} 