import { EventData } from "tns-core-modules/data/observable";
import { AbsoluteLayout } from "tns-core-modules/ui/layouts/absolute-layout";
import { profileImage } from "./profile-image-model";

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
    container.bindingContext = null;
    container.bindingContext = new profileImage(container);
    
}