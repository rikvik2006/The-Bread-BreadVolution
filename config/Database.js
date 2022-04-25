const { SelectMenuOption } = require("@discordjs/builders");
const mongoose = require("mongoose");
require("dotenv").config();
const { createSpinner } = require ('nanospinner'); 


class Database {
    constructor() {
        this.connection = null;
    }

    connect () {

        const spinner = createSpinner("Connecting to database...").start();

        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            spinner.success({ text: "Connected to database!" });
            this.connection = mongoose.connection;
        }).catch(err => {
            spinner.error({ text: "Failed to connect to database!" });
            console.error(err);
        });
    }
}

module.exports = Database;