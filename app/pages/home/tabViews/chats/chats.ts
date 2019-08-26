import * as application from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { ContainerView, ContentView } from "tns-core-modules/ui/page";
import { appData } from "~/app";
import { Navigations } from "~/utilities/navigations";
import { Utils } from "~/utilities/Utils";
import { chatItem } from "../../chat-item";
import { headerBarItem, headerBarItemType } from "~/components/header-bar/header-bar";
declare var android;
export var ChatsContext: ChatsModel;
export class ChatsModel extends Observable {
    protected page: ContainerView;
    public pageTitle: string = "My Chats"
    public navigation: Navigations;
    public appModel: appData = application["data"];
    public utility = Utils;
    constructor() {
        super();
        this.recentChats = new ObservableArray<chatItem>();
        var dummyData = [
            { name: "Chris Hemsworth", status: 'online', image: '~/assets/images/avatar.png' },
            { name: "Henry Lawson", status: 'online', image: '~/assets/images/avatar1.png' },
            { name: "Raj Quaku", status: 'offline', image: '' },
            { name: "Chris Evans 1", status: 'busy', image: '' },
        ];

        for (let i = 0; i < dummyData.length; i++) {
            const element = dummyData[i];
            var chat = new chatItem;
            chat.name = element.name;
            chat.status = element.status;
            chat.image = element.image;
            this.recentChats.push(chat);
        }
        this.appModel.addHandler('home-tab-changed', 'chats', this.homeTabChanged);
    }

    setRootView(page: ContainerView) {
        this.page = page;
    }

    homeTabChanged(parentView) {        
        if (parentView.selectedPage == 0) {
            var $this = ChatsContext;
            parentView.actionBar.bindingContext.title = $this.pageTitle;
            var actionBarItems:Array<headerBarItem> = new Array<headerBarItem>();
            var newConversation:headerBarItem = new headerBarItem;
            newConversation.type = headerBarItemType.Button;
            newConversation.options = {text: "e9be", className:"fi"};
            newConversation.options.action = function(){
                alert(1234)
            }
            actionBarItems.push(newConversation);
            // Set new header buttons
            parentView.actionBar.bindingContext.ActionButtons = actionBarItems;
        }
    }

    get recentChats(): ObservableArray<chatItem> {
        return this.get("_recentChats");
    }

    set recentChats(value: ObservableArray<chatItem>) {
        this.set("_recentChats", value);
    }

}

ChatsContext = new ChatsModel();
export function onListViewLoaded(args: EventData) {
    const page = <ContainerView>args.object;
    ChatsContext.setRootView(page);
    page.bindingContext = ChatsContext;
} 