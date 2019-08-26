import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { EventData, Observable, View } from "tns-core-modules/ui/page";
import { Button } from "tns-core-modules/ui/button/button";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
export enum headerBarItemType{Button, Label};
export type headerBarButtonOption = {text:string, className?:string, action?:any}
export type headerBarLabelOption = {text:string, className?:string, action?:any}
export class headerBarItem{
    public type:headerBarItemType;
    public options:headerBarButtonOption | headerBarLabelOption;
}
export class headerBarModel extends Observable {
    private container: GridLayout;
    private _title: string;
    constructor(container: GridLayout) {
        super();
        this.container = container;
        this.title = container.get('title') || this.title;
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

    public set ActionButtons(items: Array<headerBarItem>) {
        const rightButtons:StackLayout = this.container.getViewById('right-btns');
        rightButtons.removeChildren();
        if(items.length > 0){
            var col = 2
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if(item.type == headerBarItemType.Button){
                    this.createButton(item, col);
                }
                col++;
            }
        }
    }

    private createButton(option:headerBarItem, col:number){
        const _btn = new Button;
        _btn.className = option.options.className+" header-btn right-btns new-btn";
        
        _btn.text = String.fromCharCode(parseInt(option.options.text, 16));
        
        if(option.options.action){
            _btn.on("tap", option.options.action );
        }        
        const rightButtons:StackLayout = this.container.getViewById('right-btns');
        rightButtons.addChild(_btn);
    }

}
export function onLoad(args: EventData) {
    const container = <GridLayout>args.object;
    container.bindingContext = new headerBarModel(container);
} 