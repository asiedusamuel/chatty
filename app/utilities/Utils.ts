import * as application from "tns-core-modules/application";
import * as BitmapFactory from "nativescript-bitmap-factory";
import * as color from 'tns-core-modules/color';
import { fromBase64, fromNativeSource } from "tns-core-modules/image-source/image-source";
import { Label } from "tns-core-modules/ui/label/label";
import { appData } from "~/app";
import { Button } from "tns-core-modules/ui/button/button";
import { Observable } from "tns-core-modules/ui/page/page";
declare var android;
export class Utils {
    constructor() { }

    static evaluateBackEvent($classObject: any, $fn: string) {
        if (application.android) {
            application.android.on(application.AndroidApplication.activityBackPressedEvent, $classObject[$fn]);
        }
    }
    static lightOrDark(color) {

        // Variables for red, green, blue values
        var r, g, b, hsp;

        // Check the format of the color, HEX or RGB?
        if (color.match(/^rgb/)) {

            // If HEX --> store the red, green, blue values in separate variables
            color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

            r = color[1];
            g = color[2];
            b = color[3];
        } else {

            // If RGB --> Convert it to HEX: http://gist.github.com/983661
            color = +("0x" + color.slice(1).replace(
                color.length < 5 && /./g, '$&$&'));

            r = color >> 16;
            g = color >> 8 & 255;
            b = color & 255;
        }

        // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
        hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
        );

        // Using the HSP value, determine whether the color is light or dark
        //if (hsp>127.5) {
        if (hsp > 156.5) {
            return 'light';
        }
        return 'dark';

    }

    public static createInitials($name: string): string {
        var init: string = '#';
        if ($name) {
            const names = $name.split(' ');
            if (names.length >= 2) {
                init = names[0].charAt(0) + names[1].charAt(0);
            } else if (names.length == 1) {
                init = names[0].charAt(0);
            } else {
                init = '#';
            }
        }
        return init;
    }

    public static initialsImg(options: { x?: number, y?: number, initials: string, size: number }) {
        var bmp = BitmapFactory.create(options.size);

        var initials = options.initials;
        var applicationData: appData = application["data"];

        var xyValues: string = `0,0`;
        bmp.writeText(initials, xyValues, {
            color: applicationData.appColors.primaryColorDark,
            size: options.size,
            name: "Arial"
        }, true);

        var base64 = bmp.toBase64(BitmapFactory.OutputFormat.PNG, 75);
        bmp.dispose();
        var b64Img = fromBase64(fromBase64(base64).toBase64String('png'));
        return b64Img;
    }
}

export class agoTimer extends Observable {
    private dateTime: string;
    public _ago: string;
    private MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    constructor(dateTime: string) {
        super();
        this.dateTime = dateTime;
    }


    public get ago(): string {
        return this._ago;
    }

    getFormattedDate(date, prefomattedDate: any = false, hideYear = false) {
        const day = date.getDate();
        const month = this.MONTH_NAMES[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        let minutes = date.getMinutes();

        if (minutes < 10) {
            // Adding leading zero to minutes
            minutes = `0${minutes}`;
        }

        if (prefomattedDate) {
            // Today at 10:20
            // Yesterday at 10:20
            return `${prefomattedDate} at ${hours}:${minutes}`;
        }

        if (hideYear) {
            // 10. January at 10:20
            return `${day}. ${month} at ${hours}:${minutes}`;
        }

        // 10. January 2017. at 10:20
        return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
    }

    public set ago(v: string) {
        if (v != this._ago) {
            this._ago = v;
            this.notifyPropertyChange("ago", v);
        }
    }

    public track() {
        const date: any = new Date(this.dateTime);
        const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
        const today: any = new Date();
        const yesterday = new Date(today - DAY_IN_MS);
        const seconds = Math.round((today - date) / 1000);
        const minutes = Math.round(seconds / 60);
        const isToday = today.toDateString() === date.toDateString();
        const isYesterday = yesterday.toDateString() === date.toDateString();
        const isThisYear = today.getFullYear() === date.getFullYear();


        if (seconds < 5) {
            this.ago = 'now';
        } else if (seconds < 60) {
            this.ago = `${seconds} seconds ago`;
        } else if (seconds < 90) {
            this.ago = 'about a minute ago';
        } else if (minutes < 60) {
            this.ago = `${minutes} minutes ago`;
        } else if (isToday) {
            this.ago = this.getFormattedDate(date, 'Today'); // Today at 10:20
        } else if (isYesterday) {
            this.ago = this.getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
        } else if (isThisYear) {
            this.ago = this.getFormattedDate(date, false, true); // 10. January at 10:20
        }

        this.ago = this.getFormattedDate(date); // 10. January 2017. at 10:20
        console.log(this.ago);
    }
}