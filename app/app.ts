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
import { initialize } from "nativescript-image";
declare var android;
export class appData extends Observable {
    public appName: string = "Chatty"
    private _statusBarColor: string = "#6db94f";
    public recentChats: Array<any> = [
        { name: "Chris Hemsworth", lastMessage: 'Good morning Chris', status: 'online', image: '~/assets/images/avatar.png', initial: '' },
        { name: "Henry Lawson", lastMessage: 'How was your business today?', status: 'online', image: '~/assets/images/avatar1.png', initial: 'HL' },
        { name: "Raj Quaku", lastMessage: 'Did you attend the meeting?', status: 'offline', image: '', initial: 'RQ' },
        { name: "Chris Evans", lastMessage: 'See if you can get it done', status: 'busy', image: '', initial: 'CE' },
    ];
    public scheduledChats: Array<any> = [
        { name: "Chris Hemsworth", lastMessage: 'Good morning Chris', status: 'online', image: '~/assets/images/avatar.png', initial: '' },
        { name: "Henry Lawson", lastMessage: 'How was your business today?', status: 'online', image: '~/assets/images/avatar1.png', initial: 'HL' },
        { name: "Raj Quaku", lastMessage: 'Did you attend the meeting?', status: 'offline', image: '', initial: 'RQ' },
        { name: "Chris Evans", lastMessage: 'See if you can get it done', status: 'busy', image: '', initial: 'CE' },
    ];
    constructor() {
        super();
    }

    get statusBarColor(): string {
        return this._statusBarColor;
    }

    set statusBarColor(value: string) {
        if (this._statusBarColor !== value) {
            this._statusBarColor = value;
            if (application.android && platform.device.sdkVersion >= "21") {
                const window = application.android.foregroundActivity.getWindow();
                let decorView = window.getDecorView();
                decorView.setSystemUiVisibility(Utils.lightOrDark(value) == 'dark' ? android.view.View.SYSTEM_UI_FLAG_DARK_STATUS_BAR : android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR)
                window.setStatusBarColor(new color.Color(value).android);
                window.statusBarStyle = 1;
            }
            this.notifyPropertyChange("statusBarColor", value);
        }
    }
}

if (application.android) {
    application.on("launch", () => {
        initialize();
    });
}

application['data'] = new appData;
application.run({ moduleName: "app-root" });
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/

