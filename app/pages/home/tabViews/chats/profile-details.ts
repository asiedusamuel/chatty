import * as application from "tns-core-modules/application";
import { GestureStateTypes, PanGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { EventData, Observable, Page, ShowModalOptions, View } from "tns-core-modules/ui/page";
export var profileDataContext: profileDataModel;
const
    MIN_Y: number = -150,
    MAX_Y: number = 0,
    THRESHOLD: number = 0.5;
export class profileDataModel extends Observable {
    public page: Page;
    public _name: string;
    public _image: string;
    private actionBar: GridLayout;
    private contentView: StackLayout;
    private profileImage: View;
    private isPanning: boolean = false;
    constructor() {
        super();
    }
    setContext(context: any) {
        this.name = context.name;
        this.image = context.image;
    }
    setRootView(page: Page) {
        this.page = page;
        this.actionBar = page.getViewById('profile-action-bar');
        this.profileImage = page.getViewById('profile-image');
        this.contentView = page.getViewById('content');
        this.contentView.translateY = MIN_Y;
        this.actionBar.bindingContext.title = this.name;
        this.actionBar.bindingContext.isTransparent = true;

        this.actionBar.bindingContext.BackAction = () => {
            profileDataContext.page.frame.goBack();
        }

    }
    public get name(): string { return this._name; }
    public get image(): string { return this._image }

    public set name(v: string) { if (v != this._name) { this._name = v; this.notifyPropertyChange('name', v); } }
    public set image(v: string) { if (v != this._image) { this._image = v; this.notifyPropertyChange('image', v); } }

    tapToViewProfile(args: EventData) {
        const mainView: View = <View>args.object;
            const option: ShowModalOptions = {
                context: {image: '~/assets/images/profile-img.png'},
                closeCallback: () => {
                    
                },
                fullscreen: false
            };
            mainView.showModal("./pages/home/tabViews/chats/profile-image-view", option);
    }
    timer: any;
    panToViewProfile(args: PanGestureEventData) {
        let newY: number = this.contentView.translateY + args.deltaY;
        if (newY >= MIN_Y && newY <= MAX_Y) {
            this.isPanning = true;
            clearTimeout(this.timer);
            if (args.state === GestureStateTypes.changed) {
                //this.contentView.translateY = newY;
                this.timer = setTimeout(() => {
                    this.contentView.animate({
                        translate: { x: 0, y: newY },
                        duration: 100
                    }).then(() => {
                        clearTimeout(this.timer);
                    });
                }, 10); 
            }
        }
        
        if (args.state === GestureStateTypes.ended && !(newY === MIN_Y || newY === MAX_Y)) {
            // init our destination Y coordinate to 0, in case neither THRESHOLD has been hit

            let destY: number = 0;

            // if user hit or crossed the THESHOLD either way, let's finish in that direction
            if (newY <= MIN_Y * THRESHOLD) {
                destY = MIN_Y;
            } else if (newY >= MAX_Y * THRESHOLD) {
                destY = MAX_Y;
            }

            this.contentView.animate({
                translate: { x: 0, y: destY },
                duration: 1000
            }).then(() => {
                this.isPanning = false;
            })
        }
    }
}
profileDataContext = new profileDataModel;
export function loaded(args: EventData) {
    const context = application['data'].selectedChat;
    const page: Page = <Page>args.object;
    profileDataContext.setContext(context)
    profileDataContext.setRootView(page)
    if (page.bindingContext != profileDataContext) page.bindingContext = profileDataContext;
} 