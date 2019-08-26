import { Observable, Page, EventData } from "tns-core-modules/ui/page";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import * as application from "tns-core-modules/application";
import { appData } from "~/app";
import { headerBarItem, headerBarItemType } from "~/components/header-bar/header-bar";
import { Conversation, ConversationType } from "../../conversation";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
export var ChatDetailsContext: chatDetailsModel;
export class chatDetailsModel extends Observable {
    public applicationModel: appData = application["data"];
    _name: string;
    _status: string;
    _image: string;
    _initials: string;
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
        const actionBar: GridLayout = page.getViewById('custom-action-bar');
        actionBar.bindingContext.title = this.name;
        this.conversations = new ObservableArray<Conversation>();
        var actionBarItems: Array<headerBarItem> = new Array<headerBarItem>();
        var info: headerBarItem = new headerBarItem;
        info.type = headerBarItemType.Button;
        info.options = { text: "eb0e", className: "fi bordered"};
        info.options.action = function () {
            alert(1234)
        }
        actionBarItems.push(info);
        // Set new header buttons
        actionBar.bindingContext.ActionButtons = actionBarItems;

        // Put some dummy data
        var dummyData = [
            { name: this.name, status: 'online', from:'233554081871', image: this.image },
            { name: this.name, status: 'online', from:'233554081871', image: this.image },
            { name: "Raj Quaku", status: 'offline', from:'233554081875', image: '' },
            { name: "Chris Evans 1", status: 'busy', from:'233554081871', image: '' },
        ];
        var prevFrom:string;
        for (let i = 0; i < dummyData.length; i++) {
            const element = dummyData[i];
            var conversation = new Conversation;
            if(prevFrom == element.from){
                conversation.sameAsPrevious = true;
            }else{
                conversation.sameAsPrevious = false;
            }
            console.log(conversation.sameAsPrevious)            
            conversation.name = element.name;
            conversation.type = ConversationType.Text;
            conversation.message = Math.random().toString(); 
            conversation.image = element.image;
            conversation.from = element.from;
            prevFrom = element.from;
            this.conversations.push(conversation);
        }
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
        return this.get("_conversations");
    }

    set conversations(value: ObservableArray<Conversation>) {
        this.set("_conversations", value);
    }
    
    
}
ChatDetailsContext = new chatDetailsModel;
export function loaded(args: EventData) {
    const context = application['data'].selectedChat;
    const page: Page = <Page>args.object;
    ChatDetailsContext.setContext(context)
    ChatDetailsContext.setRootView(page)
    page.bindingContext = ChatDetailsContext;
} 