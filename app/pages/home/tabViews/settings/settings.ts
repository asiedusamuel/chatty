import { EventData, Observable } from "tns-core-modules/data/observable";
import * as application from 'tns-core-modules/application'
import * as platform from 'tns-core-modules/platform'
import * as color from 'tns-core-modules/color'
import { Page } from "tns-core-modules/ui/page";
import { Navigations } from "~/utilities/navigations";
import { Utils } from "~/utilities/Utils";
import { ImageCropper } from "nativescript-imagecropper";
import * as imagepicker from "nativescript-imagepicker";

import { appData } from "~/app";
import { fromFile } from "tns-core-modules/image-source/image-source";
import { Img } from "nativescript-image";
import { API } from "~/Services/api-request";
import { Label } from "tns-core-modules/ui/label/label";
declare var android;
export var SettingsContext: SettingsModel;
export class SettingsModel extends Observable {
    protected page: Page;
    public pageTitle: string = "Settings"
    public appModel:appData = (<any>application).data;
    public navigation: Navigations;
    private imagePicker: imagepicker.ImagePicker;
    private dp: Img;
    public API = API;
    constructor() {
        super();
        this.appModel.addHandler('home-tab-changed', 'settings', this.tabChanged); 
        this.imagePicker = imagepicker.create({
            mode: "single" // use "multiple" for multiple selection
        });
        this.displayPicture = this.appModel.user.profilePicture;
    }

    setRootView(page:Page){this.page = page;
        // Add the navigations to the model class
        this.navigation = new Navigations(page);
        this.dp = page.getViewById('dp');
    }
    
    public get displayPicture() : any {
        return this.get("_displayPicture");
    }

    public set displayPicture(v : any) {
        this.set("_displayPicture", v);
    }
    
    tabChanged(parentView) {
        if (parentView.selectedPage == 3) {
            var $this = SettingsContext;
            parentView.actionBar.bindingContext.title = $this.pageTitle;
        }
    }
    selectImage(args) {
        let $this = this;
        this.imagePicker.authorize().then(function () {
            return $this.imagePicker.present();
        }).then(function (selection: any) {
            var imagePath;
            if (platform.isAndroid) {
                imagePath = selection[0]._android;
            } else {
                imagePath = selection[0]._ios;
            }
            const imageSource = fromFile(imagePath);
            var imageCropper = new ImageCropper();
            return imageCropper.show(imageSource, { width: 600, height: 600 });
        }).then(args => { 
            if (args.image !== null) {
                (<Label>this.page.getViewById("loader")).visibility = 'visible';
                this.displayPicture = args.image.toBase64String("png");
                API.saveDP(this.appModel.user.uid, args.image.toBase64String("png")).then(data=>{
                    this.displayPicture = this.appModel.user.profilePicture+'?timestamp='+Date.now();
                    //alert(this.dp.src);
                    this.dp.updateImageUri();
                    (<Label>this.page.getViewById("loader")).visibility = 'collapse';
                }).catch(error=>{
                    (<Label>this.page.getViewById("loader")).visibility = 'collapse';
                    alert("Unable to change profile picture. Try again later.");
                })
            }
        }).catch(function (e) {
            // Image Selection error
            if(e != "Error: Image picker activity result code 0"){
                alert("An error occured. Try again");
            }            
        });
    }
}
SettingsContext = new SettingsModel();
export function loaded(args: EventData) {
    const page = <Page>args.object;
    SettingsContext.setRootView(page);
    page.bindingContext = SettingsContext;
}