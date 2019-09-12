import * as application from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { ContainerView, ContentView } from "tns-core-modules/ui/page";
import { appData } from "~/app";
import { Navigations } from "~/utilities/navigations";
import { Utils } from "~/utilities/Utils";
import { ConversationItem } from "../../chat-item";
import { headerBarItem, headerBarItemType } from "~/components/header-bar/header-bar";
import Conversations from "~/Database/models/Conversations";
import { getRepository } from "typeorm/browser";
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
        this.recentChats = new ObservableArray<ConversationItem>();
        this.fetchConversations();
        /* var dummyData = [
             { name: "Chris Hemsworth", status: 'online', image: '~/assets/images/avatar.png' },
            { name: "Henry Lawson", status: 'online', image: '~/assets/images/avatar1.png' },
            { name: "Raj Quaku", status: 'offline', image: '' },
            { name: "Chris Evans 1", status: 'busy', image: '' } 
        ];

        for (let i = 0; i < dummyData.length; i++) {
            const element = dummyData[i];
            var chat = new chatItem;
            chat.name = element.name;
            chat.status = element.status;
            chat.image = element.image;
            this.recentChats.push(chat);
        } */
        this.appModel.addHandler('home-tab-changed', 'chats', this.homeTabChanged);
    }

    setRootView(page: ContainerView) {
        this.page = page;
    }

    async fetchConversations() {
        getRepository(Conversations)
            .createQueryBuilder("conversations")
            .addOrderBy("conversations.dateSent","DESC")
            .getMany().then(data => {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    var chat = new ConversationItem;
                    chat.name = element.subject;
                    //chat.status = element.status;
                    chat.image = element.image;
                    this.recentChats.push(chat);
                }
            });

    }

    homeTabChanged(parentView) {
        if (parentView.selectedPage == 0) {
            var $this = ChatsContext;
            parentView.actionBar.bindingContext.title = $this.pageTitle;
            var actionBarItems: Array<headerBarItem> = new Array<headerBarItem>();
            var newConversation: headerBarItem = new headerBarItem;
            newConversation.type = headerBarItemType.Button;
            newConversation.options = { text: "e9be", className: "fi" };
            newConversation.options.action = function () {
                alert(1234)
            }
            actionBarItems.push(newConversation);
            // Set new header buttons
            parentView.actionBar.bindingContext.ActionButtons = actionBarItems;
        }
    }

    get recentChats(): ObservableArray<ConversationItem> {
        return this.get("_recentChats");
    }

    set recentChats(value: ObservableArray<ConversationItem>) {
        this.set("_recentChats", value);
    }

}

ChatsContext = new ChatsModel();
export function loaded(args: EventData) {
    const page = <ContainerView>args.object;
    ChatsContext.setRootView(page);
    page.bindingContext = ChatsContext;
}
export function onListViewLoaded(args: EventData) {
} 