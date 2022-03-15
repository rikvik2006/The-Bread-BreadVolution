global.Discord = require('discord.js');
global.client = new Discord.Client({
    intents: 32767,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
global.WOKCommands = require("WOKCommands");
const path = require("path");
global.mongoose = require("mongoose");


require("dotenv").config();


client.login(process.env.TOKEN);


const fs = require("fs");
const { CLIENT_RENEG_LIMIT } = require("tls");



// Functions Handler

const functionFile = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
for (const file of functionFile) {
    require(`./functions/${file}`);
}



// Commands Eandler

client.on("ready", async () => {
    await mongoose.connect(process.env.MONGO_URI, {})

    new WOKCommands(client, {
        commandsDir: path.join(__dirname, "commands_"),
        testServers: ["942724845760806953"]
    })
    .setDefaultPrefix("!!")

})



// DataBase connection

global.mysql = require("mysql");

global.con = mysql.createPool({
    host: "breaddatabase.ddns.net",
    port: 3306,
    user: "PC_Portatile",
    password: process.env.password_BreadDataBase,
    database: "Bread_DataBase"

});

//test
//test2
