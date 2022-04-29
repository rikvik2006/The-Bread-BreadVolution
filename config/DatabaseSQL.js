const { ContextMenuCommandBuilder } = require("@discordjs/builders");

global.mysql = require("mysql");

global.con = mysql.createConnection({
    host: "breaddatabase.ddns.net",
    port: 3306,
    user: "PC_Portatile",
    password: process.env.password_BreadDataBase,
    database: "Bread_DataBase"

})

class SQLDatabase {
    constructor() {
        this.connect = null;
    }

    connect() {
        const spinner = createSpinner("Connecting to database...").start();

        global.con = mysql.createConnection({
            host: "breaddatabase.ddns.net",
            port: 3306,
            user: "PC_Portatile",
            password: process.env.password_BreadDataBase,
            database: "Bread_DataBase"
        
        }).then (() => {
            spinner.success({ text: "Connected to the SQLdatabase!" });
            this.connect = con.connect();
        }).catch(err => {
            spinner.error({ text: "Failed to connect to the SQLdatabase!" });
            console.log(err);
        })
    }
}

module.exports = SQLDatabase;