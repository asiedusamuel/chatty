import * as application from "tns-core-modules/application";
import * as BitmapFactory from "nativescript-bitmap-factory";
import * as color from 'tns-core-modules/color';
import { fromBase64, fromNativeSource } from "tns-core-modules/image-source/image-source";
import { Label } from "tns-core-modules/ui/label/label";
import { appData } from "~/app";
import { Button } from "tns-core-modules/ui/button/button";
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