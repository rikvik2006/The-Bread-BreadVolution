global.Discord = require('discord.js');
global.client = new Discord.Client({
    intents: new Discord.Intents(process.env.INTENTS), //All: 131071
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const path = require("path")
const { createSpinner } = require ('nanospinner'); 

const Database = require("./config/Database.js");

const db = new Database();

db.connect();


require("dotenv").config();


client.login(process.env.TOKEN);


const fs = require("fs");
const { CLIENT_RENEG_LIMIT } = require("tls");
const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [];

client.commands = new Discord.Collection();


//************************/
// Slash Commands Handler
//************************/


const slashCommandsFolder = fs.readdirSync("./commands/slashCommands/"); //commands\slashCommands
for (const folder of slashCommandsFolder) { 
    const commandsFiles = fs.readdirSync(`./commands/slashCommands/${folder}`);
    for (const file of commandsFiles) {
        if (file.endsWith(".js")) {
            const command = require(`./commands/slashCommands/${folder}/${file}`);
            // For slash commands
            commands.push(command.data.toJSON()); //command.data.toJSON()
            client.commands.set(command.data.name, command); //command.name, command
        }
        else {
            const commandsFiles2 = fs.readdirSync(`./commands/slashCommands/${folder}/${file}`);
            for (const file2 of commandsFiles2) {
                const command = require(`./commands/slashCommands/${folder}/${file}/${file2}`);
                // For slash commands
                commands.push(command.data.toJSON());
                client.commands.set(command.data.name, command);
            }
        }
    }
}

//************************/
// Text Commands Handler
//************************/

const textCommandsFolder = fs.readdirSync("./commands/textCommands/"); //commands\textCommands
for (const folder of textCommandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/textCommands/${folder}`);
    for (const file of commandsFiles) {
        if (file.endsWith(".js")) {
            const command = require(`./commands/textCommands/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
        else {
            for (const file2 of commandsFiles2) {
                const command = require(`./commands/textCommands/${folder}/${file}/${file2}`);
                client.commands.set(command.name, command);
            }
        }
    }
}



//************************/
//     Event Handler
//************************/

const eventsFolders = fs.readdirSync('./events'); //events\events1
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`)

    for (const file of eventsFiles) {
        if (file.endsWith(".js")) {
            const event = require(`./events/${folder}/${file}`);
            // if (event.once) {
            //     client.once(event.name, (...args) => event.execute(...args, commands));
            // } else {
            //     client.on(event.name, (...args) => event.execute(...args, commands));
            // }
            client.on(event.name, (...args) => event.execute(...args, commands));
        }
        else {
            const eventsFiles2 = fs.readdirSync(`./events/${folder}/${file}`)
            for (const file2 of eventsFiles2) {
                const event = require(`./events/${folder}/${file}/${file2}`);
                // if (event.once) {
                //     client.once(event.name, (...args) => event.execute(...args, commands)); 
                // } else {
                //     client.on(event.name, (...args) => event.execute(...args, commands));
                // }
                client.on(event.name, (...args) => event.execute(...args, commands));
            }
        }
    }
}


//************************/
//   Funciton Handler
//************************/

const functionFile = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
for (const file of functionFile) {
    require(`./functions/${file}`);
}


//************************/
//  Database Connection
//************************/

// global.mysql = require("mysql");


// global.con = mysql.createConnection({
//     host: "breaddatabase.ddns.net",
//     port: 3306,
//     user: "PC_Portatile",
//     password: process.env.password_BreadDataBase,
//     database: "Bread_DataBase"

// })

// con.connect();