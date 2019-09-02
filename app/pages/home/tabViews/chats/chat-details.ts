import { Observable, Page, EventData } from "tns-core-modules/ui/page";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import * as application from "tns-core-modules/application";
import { appData } from "~/app";
import { headerBarItem, headerBarItemType } from "~/components/header-bar/header-bar";
import { Conversation, ConversationType } from "../../conversation";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import * as keyboard from "nativescript-keyboardshowing"
import { fromObject, fromObjectRecursive } from "tns-core-modules/data/observable/observable";

export var ChatDetailsContext: chatDetailsModel;
export class chatDetailsModel extends Observable {
    public page: Page;
    public applicationModel: appData = application["data"];
    public _name: string;
    public _status: string;
    public _image: string;
    public _initials: string;
    public _conversations: ObservableArray<Conversation>;
    constructor() {
        super();
    }

    setContext(context: any) {
        this.name = context.name;
        this.image = context.image;
        this.status = context.status;
        this.initials = context.initials;
    }

    setRootView(page: Page) {
        this.page = page;
        const actionBar: GridLayout = page.getViewById('custom-action-bar');
        actionBar.bindingContext.title = this.name;
        var actionBarItems: Array<headerBarItem> = new Array<headerBarItem>();
        var info: headerBarItem = new headerBarItem;
        info.type = headerBarItemType.Button;
        info.options = { text: "eb0e", className: "fi bordered" };
        info.options.action = () => {
            ChatDetailsContext.page.frame.navigate({ moduleName: "pages/home/tabViews/chats/profile-details", transition: { name: 'fade' } });
        }
        actionBarItems.push(info);
        // Set new header buttons 
        actionBar.bindingContext.ActionButtons = actionBarItems;
        actionBar.bindingContext.BackAction = () => {
            if (application['data'].conversationModal) {
                application['data'].conversationModal.closeModal();
            }
        };

        setTimeout(() => {
            // Put some dummy data
            var dummyData = [
                { name: this.name, status: 'online', date:'2019-08-30 14:06:22', type: ConversationType.Text, from: '233554081871', image: this._image },
                { name: this.name, status: 'online', date:'2019-08-30 8:03:22', type: ConversationType.Text, from: '233554081871', image: this._image },
                { name: "Raj Quaku", status: 'offline', date:'2019-08-30 13:03:22', type: ConversationType.Text, from: '233554081875', image: '' },
                { name: this.name, status: 'busy', date:'2019-08-30 13:03:22', type: ConversationType.Image, from: '233554081871', image: this._image },
            ];
            var prevFrom: string;
            var ordered:Array<Conversation> = new Array<Conversation>();
            for (let i = 0; i < dummyData.length; i++) {
                const element = dummyData[i];
                var conversation = new Conversation;
                if (prevFrom == element.from) {
                    conversation.sameAsPrevious = true;
                } else {
                    conversation.sameAsPrevious = false;
                }
                conversation.name = element.name;
                if (element.type == ConversationType.Image) {
                    conversation.message = '~/assets/images/Assets.png'
                } else {
                    conversation.message = "sample long long long long long long long long long message " + Math.random().toString();
                }
                conversation.startAgo(element.date);
                conversation.type = element.type;
                conversation.image = element.image;
                conversation.from = element.from;
                prevFrom = element.from;
                ordered.push(conversation);
            }
            const testing = ordered.sort((a, b) => {
                const dateA = this.getTime(new Date(a.date));
                const dateB = this.getTime(new Date(b.date));
                if(dateA > dateB) return 0;
                if(dateA < dateB) return 1;
                return 0 ;
            });
            this.conversations = new ObservableArray<Conversation>();
            testing.forEach((con, i)=>{
                this.conversations.setItem(i, con)
            });
            
            //console.log(testing)
        }, 100);

    }

    public get name(): string { return this._name; }
    public get status(): string { return this._status; }
    public get image(): string { return this._image }
    public get initials(): string { return this._initials; }

    public set name(v: string) { if (v != this._name) { this._name = v; this.notifyPropertyChange('name', v); } }
    public set status(v: string) { if (v != this._status) { this._status = v; this.notifyPropertyChange('status', v); } }
    public set image(v: string) { if (v != this._image) { this._image = v; this.notifyPropertyChange('image', v); } }
    public set initials(v: string) { if (v != this._initials) { this._initials = v; this.notifyPropertyChange('initials', v); } }

    get conversations(): ObservableArray<Conversation> {
        return this.get('_conversations');
    }

    set conversations(value: ObservableArray<Conversation>) {
        this.set('_conversations', value);
    }
    public templateSelector(item: Conversation, index: number, items: any) {
        return item.type;
    }
    private getTime(date?: Date) {
        return date != null ? date.getTime() : 0;
    }
    
    private refreshChatUpdates(conversations:ObservableArray<Conversation>):any {
        return conversations.sort((a, b) => {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return this.getTime(new Date(a.date)) - this.getTime(new Date(b.date)) ;
        });
        
    }


}
ChatDetailsContext = new chatDetailsModel;
export function loaded(args: EventData) {
    const context = application['data'].selectedChat;
    const page: Page = <Page>args.object;
    ChatDetailsContext.setContext(context)
    ChatDetailsContext.setRootView(page)
    page.bindingContext = ChatDetailsContext;
    keyboard.setOptions({
        isModal:true,
        currentPage: page
    })
    keyboard.monitor();
}

export function onKeyboard(args) {
    console.log("Keyboard is now", args.isShowing ? 'showing' : 'hidden. '+args.object);
};