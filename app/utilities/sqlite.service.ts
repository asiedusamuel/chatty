//import * as Sqlite from "nativescript-sqlite";
var Sqlite = require("nativescript-sqlite");
export class DatabaseService {
    private dbName: string = "chattyDB"
    public _connection;
    constructor() {
        //this._connection = this.getdbConnection();
        // Check and create the required tables for the application
        this.createTables();
    }
    
    public get connection() : Promise<any> {
        return this.getdbConnection();
    }
    
    private createTables() {
        this.connection.then(db => {
            const conversationSQL = `CREATE TABLE IF NOT EXISTS conversations (
                                        id          INTEGER  PRIMARY KEY AUTOINCREMENT,
                                        msgType     INT,
                                        message     TEXT,
                                        dateSent    DATETIME,
                                        read        INT,
                                        sender      VARCHAR,
                                        image       TEXT,
                                        msgGroup    VARCHAR
                                    )`;
            const userSQL = `CREATE TABLE IF NOT EXISTS user (
                                id       INTEGER       PRIMARY KEY AUTOINCREMENT,
                                userID   VARCHAR (250),
                                number   VARCHAR (20),
                                lastSeen DATETIME,
                                loggedIn INT
                            )`;
            db.execSQL(conversationSQL).then(() => { }, error => {
                console.log("CREATE CONVERSATION TABLE ERROR", error);
            });
            db.execSQL(userSQL).then(() => { }, error => {
                console.log("CREATE TABLE USER ERROR", error);
            });
        });
    }
    public getdbConnection() {
        return new Sqlite(this.dbName);
    }
    public closedbConnection() {
        new Sqlite(this.dbName).then((db) => {
            db.close();
        });
    }
}