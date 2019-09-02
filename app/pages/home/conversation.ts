import * as application from "tns-core-modules/application";
import { Observable } from "tns-core-modules/data/observable";
import { appData } from "~/app";
import { Utils } from "~/utilities/Utils";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
export enum ConversationType { Text = 'text-type', Image = 'image-type' };
import { format} from 'timeago.js';
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
    public _date: string;
    public _dateString: string;

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
    public get date(): string { return this._date; }

    public set sameAsPrevious(v: boolean) { if (v != this._sameAsPrevious) { this._sameAsPrevious = v; this.notifyPropertyChange('sameAsPrevious', v); } }
    public set name(v: string) { if (v != this._name) { this._name = v; this.notifyPropertyChange('name', v); } }
    public set read(v: boolean) { if (v != this._read) { this._read = v; this.notifyPropertyChange('read', v); } }
    public set type(v: ConversationType) { if (v != this._type) { this._type = v; this.notifyPropertyChange('type', v); } }
    public set image(v: string) { if (v != this._image) { this._image = v; this.notifyPropertyChange('image', v); } }
    public set from(v: string) { if (v != this._from) { this._from = v; this.notifyPropertyChange('from', v); } }
    public set message(v: string) { if (v != this._message) { this._message = v; this.notifyPropertyChange('message', v); } }
    public set date(v: string) {
        if (v != this._date) {
            this._date = v; 
            this.notifyPropertyChange('date', v);
        }
    }

    public startAgo(datetime:string){
        this.date = format(datetime);
        this._dateString = datetime;
        setInterval(() => {
            this.date = format(this._dateString);
        }, 60000);        
    }
    get filter(): string {
        if (this.from == this.appModule.user.userNumber) {
            return "me"
        }
        else {
            return "them"
        }
    }

    get align(): string {
        if (this.from == this.appModule.user.userNumber) {
            return "right"
        }
        else {
            return "left"
        }
    }

    get showImage(): string {
        if (this.from == this.appModule.user.userNumber) {
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

    public animateView(args: any) {
        const view = <GridLayout>args.object
        view.animate({
            translate: { x: 100, y: 100 },
            duration: 3000
        });

    }

    public get conversationClass(): string {
        var $class = "msg";
        if (this.sameAsPrevious) {
            $class += " same-as-prev"
        };
            if (this.from == this.appModule.user.userNumber) {
                $class += " slideInFromRight"
            }else{
                $class += " slideInFromLeft"
            }
        return $class
    }
}