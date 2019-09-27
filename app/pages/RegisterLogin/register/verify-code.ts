import { Observable, EventData } from "tns-core-modules/data/observable";
import * as application from "tns-core-modules/application";
import { Page, View } from "tns-core-modules/ui/page/page";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { appData } from "~/app";
import { alertType } from "~/components/alert-box";
import { TextField } from "tns-core-modules/ui/text-field/text-field";
import { API } from "~/Services/api-request";
import { Navigations } from "~/utilities/navigations";

class verifyCodeModel extends Observable {
    private navigation: Navigations
    private alertBox: StackLayout;
    private loaderPanel: StackLayout;
    public applicationModel: appData = application["data"];
    private page: Page;
    constructor(page: Page) {
        super();
        this.page = page;
        this.loaderPanel = page.getViewById('loader-panel');
        this.alertBox = page.getViewById('alert-box');
        const email = (<any>this.applicationModel).temp.email;
        this.alertBox.bindingContext.alert(alertType.info, "Enter the verification code sent to your email address " + email, true);
        this.navigation  = new Navigations(page);
        (<TextField>this.page.getViewById("pin1")).focus()
    }

    public get pin1(): string { return this.get("_pin1"); }
    public set pin1(v: string) { this.set("_pin1", v); if (v != "") { (<TextField>this.page.getViewById("pin2")).focus() } this.verifyCode(); }
    public get pin2(): string { return this.get("_pin2"); }
    public set pin2(v: string) { this.set("_pin2", v); if (v != "") { (<TextField>this.page.getViewById("pin3")).focus() } this.verifyCode(); }
    public get pin3(): string { return this.get("_pin3"); }
    public set pin3(v: string) { this.set("_pin3", v); if (v != "") { (<TextField>this.page.getViewById("pin4")).focus() } this.verifyCode(); }
    public get pin4(): string { return this.get("_pin4"); }
    public set pin4(v: string) { this.set("_pin4", v); this.verifyCode(); }
    private showLoader() {
        this.loaderPanel.bindingContext.Show();
    }

    private hideLoader() {
        this.loaderPanel.bindingContext.Hide();
    }

    getPin(): string {
        return `${this.pin1}${this.pin2}${this.pin3}${this.pin4}`;
    }

    verifyCode() {
        if (this.getPin().length == 4) {
            this.showLoader();
            const email = (<any>this.applicationModel).temp.email;
            API.verifyPin(email, this.getPin()).then((data: any) => {
                return JSON.parse(data);
            }).then((res: any) => {
                if (res.success) {
                    res.user.displayName = 'User-'+Math.floor(1000 + Math.random() * 1009);
                    this.applicationModel.user = res.user;
                    console.log(res.user);
                    this.navigation.navigateToRegDisplayName();
                    setTimeout(() => {
                        this.hideLoader();
                    }, 1000);
                } else {
                    this.page.getViewById("pin1").set("text",'');
                    (<any>this.page.getViewById("pin1")).focus();
                    this.page.getViewById("pin2").set("text",'');
                    this.page.getViewById("pin3").set("text",'');
                    this.page.getViewById("pin4").set("text",'');
                    this.hideLoader();
                    this.alertBox.bindingContext.alert(alertType.error, res.message, true);
                }
            }).catch((error: any) => {
                this.hideLoader();
                this.alertBox.bindingContext.alert(alertType.error, error, true);
            })
        }
    }
}

export function loaded(args: EventData) {
    const page = <Page>args.object;
    const context = new verifyCodeModel(page);
    if (page.bindingContext != context) page.bindingContext = context;
}