import { Observable } from "tns-core-modules/data/observable";
import { Utils } from "~/utilities/Utils";
import { appData } from "~/app";
import * as application from 'tns-core-modules/application'
import { View, ShowModalOptions } from "tns-core-modules/ui/page/page";

export class contactItem extends Observable {
    public appModel: appData = (<any>application).data;
    constructor() {
        super();
    }


    public get name(): string {
        return this.get("savedName") || this.get("displayName") || "No Name";
    }

    public get DisplayPicture(): string {
        return this.appModel.makeDPURI(this.cuid);
    }

    public get savedName(): string { return this.get("_savedName"); }
    public set savedName(v: string) { this.set("_savedName", v); }

    public get cuid(): string { return this.get("_cuid"); }
    public set cuid(v: string) { this.set("_cuid", v); }

    public get number(): string { return this.get("_number"); }
    public set number(v: string) { this.set("_number", v); }

    public get email(): string { return this.get("_email"); }
    public set email(v: string) { this.set("_email", v); }

    public get displayName(): string { return this.get("_displayName"); }
    public set displayName(v: string) { this.set("_displayName", v); }

    public get dateAdded(): string { return this.get("_dateAdded"); }
    public set dateAdded(v: string) { this.set("_dateAdded", v); }

    get initials(): any {
        if (this.name) {
            const names = this.name.split(' ');
            var init: string = '#';
            if (names.length >= 2) {
                init = names[0].charAt(0) + names[1].charAt(0);
            } else if (names.length == 1) {
                init = names[0].charAt(0);
            } else {
                init = '#';
            }
        }
        var image = Utils.initialsImg({ size: 200, initials: init });
        this.notifyPropertyChange('initials', image);
        return image;
    }

    public toggleSelection() {
        setTimeout(() => {
            alert(123456)
        }, 500);
    }

    openConversation(args) {
        setTimeout(() => {
            const mainView: View = <View>args.object;
            application['data'].selectedChat = { name: this.displayName, image: this.DisplayPicture, status: 'offline' }
            const option: ShowModalOptions = {
                context: null,
                closeCallback: () => {
                    application['data'].selectedChat = null
                },
                fullscreen: true
            };
            application['data'].conversationModal = mainView.showModal("./pages/home/tabViews/chats/conversation-root", option);
        }, 300);

    }
}