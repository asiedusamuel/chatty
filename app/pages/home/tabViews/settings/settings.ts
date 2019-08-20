import { EventData, Observable } from "tns-core-modules/data/observable";
import * as application from 'tns-core-modules/application'
import * as platform from 'tns-core-modules/platform'
import * as color from 'tns-core-modules/color'
import { Page } from "tns-core-modules/ui/page";
import { Navigations } from "~/utilities/navigations";
import { Utils } from "~/utilities/Utils";
declare var android;
export class ChatModel extends Observable {
    protected page: Page;
    public navigation: Navigations;
    constructor(page: Page) {
        super();
        this.page = page;
        // Add the navigations to the model class
        this.navigation = new Navigations(page);
    }
}

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    if (!page.bindingContext) page.bindingContext = new ChatModel(page);
} 