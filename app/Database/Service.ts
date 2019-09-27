import { createConnection, ConnectionOptions } from "typeorm/browser";
import  Conversations from "./models/Conversations";
import Users from "./models/Users"; 
import Contacts from "./models/Contacts";

export async function initDB(){
    try {
        const option: ConnectionOptions = {
            database: 'chattyDB.db',
            type: 'nativescript',
            driver: require("nativescript-sqlite"),
            entities: [
                Conversations, Users, Contacts
            ],
            logging: true
        }
        const connection = await createConnection(option)
        // setting true will drop tables and recreate
        await connection.synchronize(false);


    } catch (err) {
        console.error(err)
    }
}