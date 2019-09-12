import { EventData, Observable } from "tns-core-modules/data/observable";
import * as application from "tns-core-modules/application";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { Page, ShowModalOptions } from "tns-core-modules/ui/page";
import { Navigations } from "~/utilities/navigations";
import { appData } from "~/app";
import { API } from "~/Services/api-request";
import { View } from "typeorm/browser/schema-builder/view/View";
import { Label } from "tns-core-modules/ui/label/label";
export enum alertType { error = 'error', success = 'success' }
export class LoginModel extends Observable {
    protected page: Page;
    public navigation: Navigations;
    private alertBox: StackLayout;
    private loaderPanel: StackLayout;
    private _userNumber: string;
    private _countryCode: string;
    private _alertMessage: string;
    private _alertType: alertType;
    private _alertVisible: boolean = false;
    private _loading: boolean = false;
    public applicationModel: appData = application["data"];
    constructor(page: Page) {
        super();
        this.page = page;
        // Add the navigations to the model class
        this.navigation = new Navigations(page);
        this.alertBox = page.getViewById('alert-box');
        this.loaderPanel = page.getViewById('loader-panel');
        this.applicationModel.statusBarColor = "#FFFFFF";
        this.countryCode = '+233';
    }

    get userNumber(): string { return this._userNumber; };
    set userNumber(value: string) {
        if (this._userNumber !== value) {
            this._userNumber = value;
            this.notifyPropertyChange("userNumber", value);
        }
    }

    get countryCode(): string { return this._countryCode; };
    set countryCode(value: string) { if (this._countryCode !== value) { this._countryCode = value; this.notifyPropertyChange("countryCode", value); } }

    get alertMessage(): string { return this._alertMessage; };
    set alertMessage(value: string) { if (this._alertMessage !== value) { this._alertMessage = value; this.notifyPropertyChange("alertMessage", value); } }
    

    private showLoader() {
        this.loaderPanel.bindingContext.Show();
    }

    private hideLoader() {
        this.loaderPanel.bindingContext.Hide();
    }

    public onReturnKeyPress() {
        this.checkUserNumber();
    }

    public checkUserNumber() {
        if (this.userNumber && this.userNumber.length >= 9) {
            this.showLoader();
            API.checkAccount(this.get('countryCode')+this.userNumber).then((data: any) => {
                return JSON.parse(data)
            }).then((data: any) => {
                if (data.success) {
                    this.applicationModel.user = data.user;
                    this.navigation.navigateToLoginPassword();
                    setTimeout(() => {
                        this.hideLoader();
                    }, 1000);
                } else {
                    this.hideLoader();
                    this.alertBox.bindingContext.alert(alertType.error, data.message);
                }
            }).catch(err => {
                this.hideLoader();
                this.alertBox.bindingContext.alert(alertType.error, err);
            });
        } else {
            this.alertBox.bindingContext.alert(alertType.error, "Enter a valid number");
        }
    }
}

export function loaded(args: EventData) {
    const page = <Page>args.object;
    if (!page.bindingContext) page.bindingContext = new LoginModel(page);
}

