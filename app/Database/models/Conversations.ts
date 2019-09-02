import {BaseEntity, Entity, PrimaryGeneratedColumn, Column} from "typeorm/browser";
export enum ConversationType { Text = 'text-type', Image = 'image-type' };
export enum MessageType {Message, scheduledMessage}
@Entity()
export default class Conversations extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    msgType:ConversationType;

    @Column()
    message:string;

    @Column()
    dateSent: Date;

    @Column()
    read:boolean;

    @Column()
    sender: string;

    @Column()
    image:string;

    @Column()
    msgGroup: MessageType;

    constructor() {
        super();
    }
}
