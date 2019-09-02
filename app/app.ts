/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as application from "tns-core-modules/application";
import * as color from 'tns-core-modules/color';
import { Observable } from "tns-core-modules/data/observable";
import * as platform from 'tns-core-modules/platform';
import { Utils } from "./utilities/Utils";
import { chatItem } from "~/pages/home/chat-item";
import { initialize } from "nativescript-image";
var frame = require("tns-core-modules/ui/frame");
import {initDB} from "./Database/Service";

declare var android;
export class appData extends Observable {
    public appName: string = "Chatty"
    private _statusBarColor: string = "#6db94f";
    public recentChats: chatItem[] = [];
    private _handles: object = {};
    private _user;
    public scheduledChats: Array<any> = [];
    constructor() {
        super();
    }

    public get user(): { id?: number, userNumber?: string, userId?: string, displayName } {
        return this._user;
    } 

    public set user(v: { id?: number, userNumber?: string, userId?: string , displayName}) {
        if (v != this._user) {
            this._user = v;
            this.notifyPropertyChange("user", v);
        }
    }

    get appColors(): { primaryColor, primaryColorLight, primaryColorDark } {
        var _colors = {
            primaryColor: '#6db94f',
            primaryColorLight: '#86ce6a',
            primaryColorDark: '#549739',
        }
        return _colors;
    }
    get statusBarColor(): string {
        return this._statusBarColor;
    }

    set statusBarColor(value: string) {
        if (this._statusBarColor !== value) {
            /* this._statusBarColor = value;
            if (application.android && platform.device.sdkVersion >= "21") {
                const window = application.android.foregroundActivity.getWindow();
                let decorView = window.getDecorView();
                decorView.setSystemUiVisibility(Utils.lightOrDark(value) == 'dark' ? android.view.View.SYSTEM_UI_FLAG_DARK_STATUS_BAR : android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR)
                window.setStatusBarColor(new color.Color(value).android);
                window.statusBarStyle = 1;
            }
            if (platform.isIOS) {
                var navigationBar = frame.topmost().ios.controller.navigationBar;
                navigationBar.barStyle = new color.Color(value).ios;
            }
            this.notifyPropertyChange("statusBarColor", value);  */
        }
    }
    private _StatusBarTimer: any;
    customStatusBarColor(value: string) {
        clearTimeout(this._StatusBarTimer);
        this._StatusBarTimer = setTimeout(() => {
            if (application.android && platform.device.sdkVersion >= "21") {
                const window = application.android.foregroundActivity.getWindow();
                let decorView = window.getDecorView();
                decorView.setSystemUiVisibility(Utils.lightOrDark(value) == 'dark' ? android.view.View.SYSTEM_UI_FLAG_DARK_STATUS_BAR : android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR)
                window.setStatusBarColor(new color.Color(value).android);
                window.statusBarStyle = 1;
            }
            if (platform.isIOS) {
                var navigationBar = frame.topmost().ios.controller.navigationBar;
                navigationBar.barStyle = new color.Color(value).ios;
            }
        }, 500);
    }

    addHandler(name: string, id: any, callback: Function) {
        if (!this._handles[name]) this._handles[name] = [];
        if (!this._handles[name][id]) this._handles[name][id] = function () { };

        if (this._handles[name][id]) {
            this._handles[name][id] = callback;
        }
    }
    triggerHander(name: string, data?: any) {
        if (this._handles[name]) {
            for (const key in this._handles[name]) {
                if (this._handles[name].hasOwnProperty(key)) {
                    const callback = this._handles[name][key];
                    callback(data);
                }
            }
        }
    }
}

if (application.android) {
    application.on("launch", () => {
        initialize();
    });
}
initDB().then(db=>{
    (<any>application).data = new appData;
}).catch(err=>{
    console.log(err)
})

application.run({ moduleName: "app-root" });
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/

