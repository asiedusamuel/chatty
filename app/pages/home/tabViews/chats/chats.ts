import * as application from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { ItemEventData, ListView } from "tns-core-modules/ui/list-view";
import { ContainerView } from "tns-core-modules/ui/page";
import { appData } from "~/app";
import { Navigations } from "~/utilities/navigations";
import { Utils } from "~/utilities/Utils";
declare var android;
export class ChatsModel extends Observable {
    protected page: ContainerView;
    public navigation: Navigations;
    public applicationModel: appData = application["data"];
    public utility = Utils;
    constructor(page: ContainerView) {
        super();
        this.page = page;
        // Add the navigations to the model class
        const listView: ListView = page.getViewById("recent-chats");
        this.applicationModel.recentChats['initialsImg'] = '~/assets/images/logo.png';
        console.log("list loaded"); 
    }
    
    public tap(args: ItemEventData){
        console.log("Is item tap"); 
    }
}

export function onListViewLoaded(args: EventData) {
    const page = <ContainerView>args.object;
    if(!page.bindingContext) page.bindingContext = new ChatsModel(page);
} 