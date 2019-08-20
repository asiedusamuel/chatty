import { EventData, Observable } from "tns-core-modules/data/observable";
import { Image } from "tns-core-modules/ui/image";
import { Label } from "tns-core-modules/ui/label";
import { AbsoluteLayout } from "tns-core-modules/ui/layouts/absolute-layout";
export class profileImage extends Observable {
    private container: AbsoluteLayout
    private initialsContainer: Label;
    private imageContainer: Image;
    private _initials: string = 'AM';
    private _src: string;
    private _size: number = 100;
    private _borderSize: number = 5;
    constructor(container: AbsoluteLayout) {
        super();
        this.container = container
        this.initialsContainer = this.container.getViewById('initials');
        this.imageContainer = this.container.getViewById('imageContainer');
        const initialsFromParent: string = container.get('initials');
        if (initialsFromParent.length >= 2) {
            this.initials = initialsFromParent.charAt(0) + initialsFromParent.charAt(1) || this.initials;
        }
        if (initialsFromParent.length == 1) {
            this.initials = initialsFromParent.charAt(0) || this.initials;
        }
        if (initialsFromParent.length == 0) {
            this.src = '~/assets/images/logo.png';
        }

        this.src = container.get('src') || this.src;
        this.size = <number>container.get('size') || this.size || this._size;
        this.borderSize = <number>container.get('borderSize') || this.borderSize || this._borderSize;
    }


    public get size(): number { return this._size; }

    public set size(value: number) {
        if (this._size !== value) {
            this._size = value;
            this.container.width = value;
            this.container.height = value;
            this.initialsContainer.fontSize = value / 1.25;
            this.notifyPropertyChange("size", value);
        }
    }
    public get borderSize(): number { return this._borderSize || 5; }

    public set borderSize(value: number) {
        if (this._borderSize !== value) {
            this._borderSize = value;
            this.initialsContainer.borderWidth = value;
            this.notifyPropertyChange("borderSize", value);
        }
    }

    get initials(): string {
        return this._initials;
    }

    set initials(value: string) {
        if (this._initials !== value) {
            this._initials = value;
            this.notifyPropertyChange("initials", value);
        }
    }

    get src(): string {
        return this._src;
    }

    set src(value: string) {
        if (this._src !== value) {
            //value = value.substring(0, 2);
            this._src = value;
            this.notifyPropertyChange("src", value);
        }
    }
}

Object.defineProperty(profileImage.prototype, "src", {
    get: function () {
        return this._src;
    },
    set: function (value) {
        this._src = value;
        this.notifyPropertyChange("size", value);
    }
});

export function onLoad(args: EventData) {
    const container = <AbsoluteLayout>args.object;
    console.log(container.bindingContext)
    container.bindingContext = new profileImage(container);
}