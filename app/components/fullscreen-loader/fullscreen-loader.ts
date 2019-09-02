import { Observable, EventData } from "tns-core-modules/data/observable";
import { Page, View } from "tns-core-modules/ui/page/page";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
export class FullscreenLoader extends Observable {
    private Container: StackLayout;
    private _height:number;
    constructor(page: StackLayout) {
        super()
        this.Container = page;
    }


    public get height(): number {
        return this._height;
    }


    public Show() {
        //setInterval(() => {
            this.Container.visibility = "visible";
            const parent = <View>this.Container.parent
            this._height = parent.getActualSize().height; 
            this.notifyPropertyChange("height", this._height);
        //}, 100);
    }
    public Hide() {
        this.Container.visibility = "collapse";
    }
}


export function onLoad(args: EventData) {
    const page = <StackLayout>args.object;
    const parent = <View>page.parent
    const context = new FullscreenLoader(page);
    if (!page.bindingContext) page.bindingContext = context;

}