import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm/browser";
import { contactItem } from "~/pages/home/tabViews/contacts/contact-item";
import { threadId } from "worker_threads";
@Entity()
export default class Contacts extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    cuid: string;

    @Column({ nullable: true })
    displayName: string;

    @Column({ nullable: true })
    name: string;

    @Column({
        nullable: true
    })
    email: string;

    @Column({
        nullable: true
    })
    userNumber: string;

    @Column()
    date_added: Date;

    constructor() {
        super();
    }

    setData(data: contactItem) {
        this.cuid = data.cuid;
        this.displayName = data.displayName;
        this.email = data.email;
        this.userNumber = data.number
        this.name = data.name;
        this.date_added = new Date(data.dateAdded);
        return this.save();
    }

}