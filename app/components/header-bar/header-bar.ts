import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { EventData, Observable, View, Color, ViewBase } from "tns-core-modules/ui/page";
import * as color from 'tns-core-modules/color';
import * as application from "tns-core-modules/application";
import { Button } from "tns-core-modules/ui/button/button";
import * as platform from 'tns-core-modules/platform';
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { Label } from "tns-core-modules/ui/label/label";
import { nQuery } from "~/utilities/nQuery";
import { appData } from "~/app";
import { Navigations } from "~/utilities/navigations";
import { topmost } from "tns-core-modules/ui/frame/frame";
export enum headerBarItemType { Button, Label };
export type headerBarButtonOption = { text: string, className?: string, action?: any }
export type headerBarLabelOption = { text: string, className?: string, action?: any }
export class headerBarItem {
    public type: headerBarItemType;
    public options: headerBarButtonOption | headerBarLabelOption;
}
var $;
export class headerBarModel extends Observable {
    private container: GridLayout;
    private rightButtonsContainer: StackLayout;
    private titleItem: Label;
    private backButton: Button;
    private _title: string;
    private _statusBarColor: string;
    private _backgroundColor: string | Color;
    private _isTransparent: boolean;
    private __backAction: Function;
    private _disableBack: boolean = false;
    constructor() {
        super();
        this.BackAction = ()=>{topmost().goBack()};
    }

    setRootView(container: GridLayout){
        this.container = container;
        //$ = new nQuery(container);
        this.rightButtonsContainer = this.container.getViewById('right-btns');
        this.backButton = this.container.getViewById('back-btn');
        this.titleItem = this.container.getViewById('titleItem');
        this.title = container.get('title') || this.title;
        this.backgroundColor = '#ffffff';
        this.statusBarColor = (<appData>application['data']).appColors.primaryColor;
    }

    get title(): string {
        return this._title;
    }
    set title(value: string) {
        if (this._title !== value) {
            this._title = value;
            this.notifyPropertyChange("title", value);
        }
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

    get isTransparent(): boolean {
        return this._isTransparent;
    }

    set isTransparent(value: boolean) {
        if (this._isTransparent !== value) {
            this._isTransparent = value;
            if (value) {
                var animColor: any = new color.Color(0.9, 255, 255, 255);
                this.container.animate({ opacity: 0, duration: 300}).then(() => {
                    this.rightButtonsContainer.eachChildView((view: View) => {
                        var animColor: any = new color.Color(0.1, 255, 255, 255);
                        view.animate({ backgroundColor: animColor, duration: 200 });
                        view.className = view.className.replace("dark", "light");
                        return true;
                    });
                    this.container.animate({ backgroundColor: animColor, duration: 200 }).then(() => {
                        this.container.animate({
                            opacity: 1,
                            duration: 100
                        });
                        this.backButton.className = this.backButton.className.replace("dark", "light");
                        this.titleItem.className = this.titleItem.className.replace("dark", "light");
                    });
                    this.backButton.animate({ backgroundColor: animColor, duration: 200 });
                });
            } else {
                this.container.backgroundColor = this.backgroundColor || '#ffffff'
            }
            this.notifyPropertyChange("isTransparent", value);
        }
    }
    get backgroundColor(): string | Color {
        return this._backgroundColor;
    }

    set backgroundColor(value: string | Color) {
        if (this._backgroundColor !== value) {
            this._backgroundColor = value;
            this.container.backgroundColor = value;
            this.notifyPropertyChange("backgroundColor", value);
        }
    }

    get disableBackButton(): boolean {
        return this._disableBack;
    }

    set disableBackButton(value: boolean) {
        if (this._disableBack !== value) {
            this._disableBack = value;
            this.notifyPropertyChange("disableBackButton", value);
        }
    }

    get BackAction(): Function {
        return this.__backAction;
    }

    set BackAction(value: Function) {
        if (this.__backAction !== value) {
            this.__backAction = value;
            this.notifyPropertyChange("BackAction", value);
        }
    }

    _BackAction() {
        if (this.__backAction) {
            this.__backAction();
        }
    }

    public set ActionButtons(items: Array<headerBarItem>) {
        this.rightButtonsContainer.removeChildren();
        if (items.length > 0) {
            var col = 2
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type == headerBarItemType.Button) {
                    this.createButton(item, col);
                }
                col++;
            }
        }
    }

    private createButton(option: headerBarItem, col: number) {
        const _btn = new Button;
        _btn.className = option.options.className + " header-btn right-btns new-btn dark";

        _btn.text = String.fromCharCode(parseInt(option.options.text, 16));

        if (option.options.action) {
            _btn.on("tap", option.options.action);
        }
        const rightButtons: StackLayout = this.container.getViewById('right-btns');
        rightButtons.addChild(_btn);
    }

}
export function onLoad(args: EventData) {
    const container = <GridLayout>args.object;
    var context = new headerBarModel();
    context.setRootView(container);
    container.bindingContext = context
} 