import { createConnection, ConnectionOptions } from "typeorm/browser";
import  Conversations from "./models/Conversations";
import Users from "./models/Users"; 

export async function initDB(){
    try {
        const option: ConnectionOptions = {
            database: 'chattyDB.db',
            type: 'nativescript',
            driver: require("nativescript-sqlite"),
            entities: [
                Conversations, Users
            ],
            logging: true
        }
        const connection = await createConnection(option)

        console.log("Connection Created.")

        // setting true will drop tables and recreate
        await connection.synchronize(true)

        console.log("Synchronized")


    } catch (err) {
        console.error(err)
    }
}