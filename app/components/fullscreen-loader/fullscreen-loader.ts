import { Observable, EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
export class FullscreenLoader extends Observable{
    private Container: StackLayout;
    constructor(page: Page){
        super()
        this.Container = page.getViewById('login-panel');
    }

    public Show(){
        this.Container.visibility = "visible";
    }
    public Hide(){
        this.Container.visibility = "collapse";
    }
}


export function onLoad(args: EventData){
    const page = <Page>args.object;
    if(!page.bindingContext) {
        page.bindingContext = null && new FullscreenLoader(page);
    }    
}