import * as application from "tns-core-modules/application";
import { Observable } from "tns-core-modules/data/observable";
import { appData } from "~/app";
import { Utils } from "~/utilities/Utils";
export enum ConversationType { Text, Image };
export class Conversation extends Observable {
    public appModule: appData = application['data'];
    public tapColor: string;
    private _sameAsPrevious: boolean;
    private _image: string;
    private _name: string;
    private _type: ConversationType;
    private _read: boolean;
    private _from: string;
    private _message: string;

    constructor() {
        super();
    }

    public get sameAsPrevious(): boolean { return this._sameAsPrevious }
    public get read(): boolean { return this._read }
    public get name(): string { return this._name }
    public get type(): ConversationType { return this._type }
    public get image(): string { return this._image; }
    public get from(): string { return this._from; }
    public get message(): string { return this._message; }

    public set sameAsPrevious(v: boolean) { if (v != this._sameAsPrevious) { this._sameAsPrevious = v; this.notifyPropertyChange('sameAsPrevious', v); } }
    public set name(v: string) { if (v != this._name) { this._name = v; this.notifyPropertyChange('name', v); } }
    public set read(v: boolean) { if (v != this._read) { this._read = v; this.notifyPropertyChange('read', v); } }
    public set type(v: ConversationType) { if (v != this._type) { this._type = v; this.notifyPropertyChange('type', v); } }
    public set image(v: string) { if (v != this._image) { this._image = v; this.notifyPropertyChange('image', v); } }
    public set from(v: string) { if (v != this._from) { this._from = v; this.notifyPropertyChange('from', v); } }
    public set message(v: string) { if (v != this._message) { this._message = v; this.notifyPropertyChange('message', v); } }

    get filter(): string {
        if (this.from == this.appModule.user.number) {
            return "me"
        }
        else {
            return "them"
        }
    }

    get align(): string {
        if (this.from == this.appModule.user.number) {
            return "right"
        }
        else {
            return "left"
        }
    }

    get showImage(): string {
        if (this.from == this.appModule.user.number) {
            return "collapsed"
        }
        else {
            if (this.sameAsPrevious) return "collapsed";
            return "visible"
        }
    }
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

    public get conversationClass() : string {
        var $class = "msg";
        if (this.sameAsPrevious) $class += " same-as-prev";
        return $class
    }
}