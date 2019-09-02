import { fromObject, EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { countryCodes, getIndexWithCode } from "~/utilities/country-codes";
import { ListPicker } from "tns-core-modules/ui/list-picker";

let closeCallback;
let listPicker:ListPicker;
let selectedIndex;
export function onShownModally(args) {
    const context = args.context;
    selectedIndex = context.selectedValue;
    closeCallback = args.closeCallback;
    const page: Page = <Page>args.object;
    page.bindingContext = fromObject({items: countryCodes, index: getIndexWithCode(selectedIndex)});
}

export function onSelectCountryCode(args) {
    closeCallback((<any>listPicker).selectedValue);
}
export function onListPickerLoaded(args: EventData) {
    listPicker = <ListPicker>args.object;
}