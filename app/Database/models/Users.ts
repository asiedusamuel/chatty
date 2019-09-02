import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm/browser";
@Entity()
export default class Users extends BaseEntity{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    userID:string;

    @Column()
    number:string;

    @Column()
    displayName:string;

    @Column()
    lastSeen: Date;

    @Column()
    loggedIn:boolean;

    constructor(){
        super();
    }
}