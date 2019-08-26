import * as application from "tns-core-modules/application";
import { Observable, ShowModalOptions, View } from "tns-core-modules/ui/page/page";
import { appData } from "~/app";
import { Utils } from "~/utilities/Utils";
export class chatItem extends Observable {
    public appModule: appData = application['data'];
    public tapColor: string;
    private _image: string;
    private _status: string;
    private _name: string;
    constructor() {
        super();
    }

    public get name(): string { return this._name }
    public get status(): string { return this._status }
    public get image(): string { return this._image; }

    public set name(v: string) { if (v != this._name) { this._name = v; this.notifyPropertyChange('name', v); } }
    public set status(v: string) { if (v != this._status) { this._status = v; this.notifyPropertyChange('status', v); } }
    public set image(v: string) { if (v != this._image) { this._image = v; this.notifyPropertyChange('image', v); } }

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

    get lastMessage(): string {
        var _lastMessage = "This is a random message " + Math.random();
        this.notifyPropertyChange('lastMessage', _lastMessage);
        return _lastMessage;
    }

    viewConversation(args) {
        const mainView: View = <View>args.object;
        application['data'].selectedChat = { name: this._name, image: this._image, status: this._status }
        const option: ShowModalOptions = {
            context: null,
            closeCallback: (username, password) => {
                // Receive data from the modal view. e.g. username & password
                //alert(`Username: ${username} : Password: ${password}`);
                application['data'].selectedChat = null
            },
            fullscreen: true
        };

        mainView.showModal("./pages/home/tabViews/chats/conversation-root", option);
    }

    previewImage() {
        console.log("Profile image Clicked")
    }
}