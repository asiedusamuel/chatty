import { Img } from "nativescript-image";
import { ImageCropper } from "nativescript-imagecropper";
import * as imagepicker from "nativescript-imagepicker";
import * as application from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { fromFile, fromFileOrResource, ImageSource } from "tns-core-modules/image-source/image-source";
import * as platform from 'tns-core-modules/platform';
import { Image } from "tns-core-modules/ui/image/image";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { Page } from "tns-core-modules/ui/page/page";
import { appData } from "~/app";
import { alertType } from "~/components/alert-box";
import Users from "~/Database/models/Users";
import { API } from "~/Services/api-request";
import { Navigations } from "~/utilities/navigations";
import { Utils } from "~/utilities/Utils";

var nsUtils = require("tns-core-modules/utils/utils");

class dpdnModel extends Observable {
    private navigation: Navigations;
    private alertBox: StackLayout;
    private loaderPanel: StackLayout;
    public applicationModel: appData = application["data"];
    private page: Page;
    public _dpImage: ImageSource;
    private dp: Img;
    private imagePicker: imagepicker.ImagePicker;
    constructor(page: Page) {
        super();
        this.page = page;
        this.loaderPanel = page.getViewById('loader-panel');
        this.alertBox = page.getViewById('alert-box');
        this.dp = page.getViewById('dp');
        this.navigation  = new Navigations(page);
        this.imagePicker = imagepicker.create({
            mode: "single" // use "multiple" for multiple selection
        });
        this.displayName = this.applicationModel.user.displayName;
        Users.find({ where: { loggedIn: true, uid: this.applicationModel.user.uid } }).then((user) => {
            if (user.length == 0) {
                this.createUser();
            }
        }).catch(err => {
            alert("Oops!! An error occured. Cannot proceed");
        });
    }

    async createUser() {
        await this.applicationModel.clearDatabase();
        let user = new Users();
        user.uid = this.applicationModel.user.uid;
        user.email = this.applicationModel.user.email;
        user.userNumber = this.applicationModel.user.userNumber;
        user.displayName = this.applicationModel.user.displayName; 
        user.profilePicture = this.applicationModel.user.profilePicture;
        user.loggedIn = true;
        user.save();
    }

    public get dpImage(): ImageSource {
        return this._dpImage;
    }

    public set dpImage(v: ImageSource) {
        if (v != this._dpImage) {
            this._dpImage = v;
            this.notifyPropertyChange("dpImage", v);
        }
    }

    get initials() {
        return Utils.initialsImg({ size: 180, initials: "DA" });
    }

    selectImage(args) {
        let $this = this;
        const dp: Image = args.object;
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
                this.dp.set("src", args.image);
                this.dp.set("base64-src", args.image.toBase64String("png"));
            }
        }).catch(function (e) {
            // Image Selection error
            if(e != "Error: Image picker activity result code 0"){
                this.alertBox.bindingContext.alert(alertType.error, "An error occured. Try again");
            }            
        });
    }

    public get displayName(): string { return this.get("_displayName"); }
    public set displayName(v: string) { this.set("_displayName", v); this.applicationModel.user.displayName = v; }

    private showLoader() {
        this.loaderPanel.bindingContext.Show();
    }

    private hideLoader() {
        this.loaderPanel.bindingContext.Hide();
    }


    saveDisplayName() {
        if(this.displayName){ 
            this.showLoader();
            const imgSource = (<any>this.dp.src); 
            let dp: string;
            if (nsUtils.isFileOrResourcePath(imgSource)) {
                dp = fromFileOrResource(imgSource).toBase64String("png");
            } else {
                dp = this.dp.get("base64-src");
            }
            API.saveDPandDN(this.applicationModel.user.uid, dp, this.displayName).then((data: any) => {
                return JSON.parse(data);
            }).then((res: any) => {
                if (res.success) {
                    this.applicationModel.user = res.user;
                    this.navigation.navigateToHome();
                    setTimeout(() => {
                        this.hideLoader();
                    }, 1000);
                } else {
                    this.hideLoader();
                    this.alertBox.bindingContext.alert(alertType.error, res.message, true);
                }
            }).catch((error: any) => {
                this.hideLoader();
                this.alertBox.bindingContext.alert(alertType.error, error, true);
            });
        }else{
            this.alertBox.bindingContext.alert(alertType.error, "Enter a dispaly name.", true);            
        }
        
    }
}

export function loaded(args: EventData) {
    const page = <Page>args.object;
    const context = new dpdnModel(page);
    if (page.bindingContext != context) page.bindingContext = context;
}