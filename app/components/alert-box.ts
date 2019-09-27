import { EventData, Observable, View } from "tns-core-modules/ui/page/page";
import { Label } from "tns-core-modules/ui/label/label";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";

export enum alertType { error = 'error', success = 'success', info='info' }
export class alertBox extends Observable {
    private label: Label;
    private container: StackLayout;
    private _alertMessage: string;
    private _alertType: alertType;
    private _alertVisible: boolean = false;
    private height: number;
    constructor() {
        super();
    }
    setRootView(v: StackLayout) {
        this.label = v.getViewById("label");
        this.container = v;
        this.container.opacity = 0;
    }
    get alertType(): alertType { return this._alertType; };
    set alertType(value: alertType) { if (this._alertType !== value) { this._alertType = value; this.notifyPropertyChange("alertType", value); } }

    get alertVisible(): boolean { return this._alertVisible; };
    set alertVisible(value: boolean) { if (this._alertVisible !== value) { this._alertVisible = value; this.notifyPropertyChange("alertVisible", value); } }

    get alertMessage(): string { return this._alertMessage; };
    set alertMessage(value: string) {
        if (this._alertMessage !== value) {
            this._alertMessage = value;
            this.notifyPropertyChange("alertMessage", value);
            setTimeout(() => {
                this.height = this.label.getMeasuredHeight();
            }, 500);

        }
    }

    public alert(type: alertType, message: string, stay?: boolean) {
        this.alertMessage = message;
        this.alertType = type;
        this.alertVisible = true;
        this.container.animate({
            opacity: 1,
            duration: 500
        }).then(() => {
            if (!stay) {
                setTimeout(() => {
                    this.container.animate({
                        opacity: 0,
                        height: 0,
                        duration: 1000
                    }).then(() => {
                        this.alertVisible = false;
                        this.container.height = 'auto';
                        this.alertMessage = '';
                    })
                }, 10000);
            }

        })

    }
}

export function onLoad(args: EventData) {
    const container = <StackLayout>args.object;
    var context = new alertBox;
    context.setRootView(container);
    container.bindingContext = context
} 