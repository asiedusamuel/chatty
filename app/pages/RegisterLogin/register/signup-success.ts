import { Observable, Page, EventData } from "tns-core-modules/ui/page/page";
import { Navigations } from "~/utilities/navigations";

class SuccessModel extends Observable{
    private navigation:Navigations;
    constructor(page:Page){
        super();
        this.navigation = new Navigations(page);
    }

    gotoChats(){
        this.navigation.navigateToHome();
    }
}
export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new SuccessModel(page);
} 