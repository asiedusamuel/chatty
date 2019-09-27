import { EventData, Observable } from "tns-core-modules/data/observable";
import * as application from 'tns-core-modules/application'
import * as platform from 'tns-core-modules/platform'
import * as color from 'tns-core-modules/color'
import { Page } from "tns-core-modules/ui/page";
import { Navigations } from "~/utilities/navigations";
import { Utils } from "~/utilities/Utils";
import { appData } from "~/app";
import { API } from "~/Services/api-request";
import { contactItem } from "./contact-item";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { PullToRefresh } from "@nstudio/nativescript-pulltorefresh";
import Users from "~/Database/models/Users";
import { getConnection, FindOneOptions } from "typeorm/browser";
import Contacts from "~/Database/models/Contacts";
declare var android;
export var ContactsContext: ContactsModel;
export class ContactsModel extends Observable {
    public pageTitle: string = "My Contacts"
    protected page: Page;
    public navigation: Navigations;
    public appModel: appData = (<any>application).data;
    public pullToRef: PullToRefresh;
    constructor() {
        super();
        this.appModel.addHandler('home-tab-changed', 'contacts', this.tabChanged);
        this.Contacts = new ObservableArray<contactItem>();
        this.loadLocalContacts();
    }
    setRootView(page: Page) {
        this.page = page;
        // Add the navigations to the model class
        this.navigation = new Navigations(page);
        this.pullToRef = page.getViewById("pull-to-refresh");
    }
    loadLocalContacts(){
        Contacts.find().then((contacts) => {
            var items = new ObservableArray([]);
            if (contacts.length) {
                var items = new ObservableArray([]);
                for (let i = 0; i < contacts.length; i++) {
                    const data = contacts[i];
                    const contact = new contactItem;
                    contact.savedName = data.name;
                    contact.email = data.email;
                    contact.number = data.userNumber;
                    contact.cuid = data.cuid;
                    contact.displayName = data.displayName;
                    contact.dateAdded = data.date_added.toLocaleDateString();
                    this.addContact(contact);
                    items.push(contact);
                }
                this.set("Contacts", items);
            }
        }).catch(err => {
           
        });
    }
    refreshContacts() {
        // Get reference to the PullToRefresh component;
        API.getContacts(this.appModel.user.uid).then((data: any) => {
            return JSON.parse(data)
        }).then(res => {
            if (res.success) {
                this.pullToRef.set("refreshing", false);
                if (res.contacts.length > 0) {
                    const contacts: Array<any> = res.contacts;
                    var items = new ObservableArray([]);
                    for (let i = 0; i < contacts.length; i++) {
                        const data = contacts[i];
                        const contact = new contactItem;
                        contact.savedName = data.name;
                        contact.email = data.email;
                        contact.number = data.userNumber;
                        contact.cuid = data.cuid;
                        contact.displayName = data.displayName;
                        contact.dateAdded = data.date_added;
                        this.addContact(contact);
                        items.push(contact);
                    }
                    this.set("Contacts", items);
                }
            }
            //setTimeout(() => {
            //}, 5000);
        }).catch(error => {
            this.pullToRef.set("refreshing", false);
        });
    }
    addContact(contactData: contactItem) {
        Contacts.findOne({ where: { cuid: contactData.cuid } }).then(row => {
            if (row) {
                // Update
                row.setData(contactData);
                console.log("update")
            } else {
                //Insert
                const contact = new Contacts;
                contact.setData(contactData);
                console.log("insert");
            }
        })

    }
    get Contacts(): ObservableArray<contactItem> {
        return this.get("_Contacts");
    }

    set Contacts(value: ObservableArray<contactItem>) {
        this.set("_Contacts", value);
    }
    tabChanged(parentView) {
        if (parentView.selectedPage == 2) {
            var $this = ContactsContext;
            parentView.actionBar.bindingContext.title = $this.pageTitle;
        }
    }

}
ContactsContext = new ContactsModel();
export function loaded(args: EventData) {
    const page = <Page>args.object;
    ContactsContext.setRootView(page);
    page.bindingContext = ContactsContext;
}
export function refreshList(args) {

    // Get reference to the PullToRefresh component;
    var pullRefresh = args.object;

}