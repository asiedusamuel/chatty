import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    //page.bindingContext = new RegisterModel(page);
} 