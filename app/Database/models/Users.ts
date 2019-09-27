import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm/browser";
@Entity()
export default class Users extends BaseEntity{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    uid:string;

    @Column()
    email:string;

    @Column()
    userNumber:string;


    @Column()
    displayName:string;

    @Column()
    loggedIn:boolean;

    @Column()
    profilePicture:string;

    constructor(){ 
        super();
    }
    
}