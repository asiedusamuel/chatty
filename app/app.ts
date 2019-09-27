/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as application from "tns-core-modules/application";
import * as color from 'tns-core-modules/color';
import { Observable, EventData } from "tns-core-modules/data/observable";
import * as platform from 'tns-core-modules/platform';
import { Utils } from "./utilities/Utils";
import { ConversationItem } from "~/pages/home/chat-item";
import { initialize, shutDown } from "nativescript-image";
var frame = require("tns-core-modules/ui/frame");
import { initDB } from "./Database/Service";
import { Label } from "tns-core-modules/ui/label/label";
import { ShowModalOptions } from "tns-core-modules/ui/page/page";
import { getConnection } from "typeorm/browser";
import Users from "./Database/models/Users";
import Conversations from "./Database/models/Conversations";
import { API } from "./Services/api-request";
export type userData = { id?: number, userNumber?: string, uid?: string, displayName: string, email: string, profilePicture: string }
declare var android;
declare const exit: (code: number) => void;
export class appData extends Observable {
    public appName: string = "Chatty"
    private _statusBarColor: string = "#6db94f";
    public recentChats: ConversationItem[] = [];
    private _handles: object = {};
    private _user;
    public countryCode: string = '+233';
    public scheduledChats: Array<any> = [];
    constructor() {
        super();
    }

    public get user(): userData {
        return this._user;
    }

    public set user(v: userData) {
        if (v != this._user) {
            v.profilePicture = this.makeDPURI(v.uid);
            this._user = v;
            this.notifyPropertyChange("user", v);
        }
    }

    makeDPURI(uid):string{
        return API.serverAddress + '/assets/profile/' + uid + '.png';
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
            this._statusBarColor = value;
            this.notifyPropertyChange("statusBarColor", value);
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

    exitApp() {
        if (platform.isIOS) {
            exit(0);
        }
        if (application.android) {
            android.os.Process.killProcess(android.os.Process.myPid());
        }
    }

    addHandler(name: string, id: any, callback: Function) {
        if (!this._handles[name]) this._handles[name] = [];
        if (!this._handles[name][id]) this._handles[name][id] = function () { };

        if (this._handles[name][id]) {
            this._handles[name][id] = callback;
        }
    }

    async clearDatabase() {
        await getConnection().createQueryBuilder().delete().from(Users).execute();
        await getConnection().createQueryBuilder().delete().from(Conversations).execute();
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
    changeCountryCode(args: EventData) {
        const mainView: Label = <Label>args.object;
        const option: ShowModalOptions = {
            context: { selectedValue: mainView.get('text') },
            closeCallback: (selectedCC) => {
                if (typeof selectedCC !== 'undefined' && selectedCC != "") {
                    if (selectedCC.length == 1) {
                        selectedCC = '00' + selectedCC
                    }
                    if (selectedCC.length == 2) {
                        selectedCC = '0' + selectedCC
                    }
                    mainView.set('text', '+' + selectedCC);
                }
            },
            fullscreen: false
        };

        mainView.showModal("./pages/RegisterLogin/login/country-codes-modal", option);
    }
}

if (application.android) {
    application.on("launch", () => {
        initialize();
    });

    application.on(application.exitEvent, (args) => {
        shutDown();
    });
}
var retryCounts: 3;
var retryCount: 0;
//retryAppLauch = setInterval(() => {
//}, 5000);
function LaunchApplication() {
    initDB().then(db => {
        (<any>application).data = new appData;
    }).catch(err => {
        console.log("will retry in 5sec");
        console.log(err);
        if (retryCount < retryCounts) {
            setTimeout(() => {
                LaunchApplication();
            }, 5000);
        }
    });
}

LaunchApplication();
application.run({ moduleName: "app-root" });
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/

