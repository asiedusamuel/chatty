import { fromObject } from "tns-core-modules/data/observable";
import { Page, Color } from "tns-core-modules/ui/page";
import * as application from "tns-core-modules/application";
//let closeCallback;

export function onShownModally(args) {
    (<Page>args.object)
    const context = args.context;
    //closeCallback = args.closeCallback;
    const page: Page = <Page>args.object;
    const newContext:any=  fromObject(context);
    if(!newContext.image){
        newContext.image = "~/assets/images/no-photo.png"
    }
    page.bindingContext = newContext;
}
