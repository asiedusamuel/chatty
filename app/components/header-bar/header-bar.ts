import { ContainerView, EventData, Observable } from "tns-core-modules/ui/page";
import { Label } from "tns-core-modules/ui/label/label";


export class headerBar extends Observable{
    private container: ContainerView
    private titleItem: Label;
    private _title: string;
    constructor(container: ContainerView) {
        super();
        this.container = container;
        this.titleItem = this.container.getViewById('titleItem');
        this.title = container.get('title') || this.title;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        if (this._title !== value) {
            this._title = value;
            this.titleItem.text = value;
            this.notifyPropertyChange("title", value);
        }
    }
}

export function onLoad(args: EventData) {
    const container = <ContainerView>args.object;
    container.bindingContext = new headerBar(container);
} 