global.Discord = require('discord.js');
global.client = new Discord.Client({
    intents: 32767,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
global.WOKCommands = require("WOKCommands");
const path = require("path");
global.mongoose = require("mongoose");
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9");




require("dotenv").config();


client.login(process.env.TOKEN);


const fs = require("fs");
const { CLIENT_RENEG_LIMIT } = require("tls");
const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [];

client.commands = new Discord.Collection();


// Command Handler

const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`);
    for (const file of commandsFiles) {
        if (file.endsWith(".js")) {
            const command = require(`./commands/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
        else {
            const commandsFiles2 = fs.readdirSync(`./commands/${folder}/${file}`);
            for (const file2 of commandsFiles2) {
                const command = require(`./commands/${folder}/${file}/${file2}`);
                client.commands.set(command.name, command);
            }
        }
    }
}
console.log(`Loaded ${client.commands.size} commands`);

//Event Handler

const eventsFolders = fs.readdirSync('./events');
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`)

    for (const file of eventsFiles) {
        if (file.endsWith(".js")) {
            const event = require(`./events/${folder}/${file}`);
            client.on(event.name, (...args) => event.execute(...args));
        }
        else {
            const eventsFiles2 = fs.readdirSync(`./events/${folder}/${file}`)
            for (const file2 of eventsFiles2) {
                const event = require(`./events/${folder}/${file}/${file2}`);
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}


// Functions Handler

const functionFile = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
for (const file of functionFile) {
    require(`./functions/${file}`);
}
console.log(`Loaded ${functionFile.length} functions`);



// Command execute

client.on('messageCreate', message => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName) && !client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))) {
        return message.reply({ content: "Command not found", ephemeral: true });
    }
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // if (command.onlyStaff) {
    //     if (!message.member.roles.cache.find(r => r.id === "923527745085005824") && !message.member.roles.cache.find(r => r.id === "923534959468249160")) {
    //         return message.channel.send(`You don't have the permission to use this command!`);
    //     }
    // }

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});





// Commands Eandler

client.on("ready", async () => {
    // Slash Commands Register

    const CLIENT_ID = client.user.id;

    const rest = new REST({
        version: "9"
    }).setToken(process.env.TOKEN);

    (async () => {
        try {
            if (process.env.ENV === "production") {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                });
                console.log("Succefully registered commands globaly!");
            } else {
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                    body: commands
                });
                console.log("Succefully registered commands locally!");
            }
        } catch (err) {
            if (err) console.error(err);
        }
    })();

    await mongoose.connect(
        process.env.MONGO_URI,
        {
            keepAlive: true,
        }
    )

    // new WOKCommands(client, {
    //     commandsDir: path.join(__dirname, "commands_"),
    //     messagesDir: path.join(__dirname, "messages.json"),
    //     testServers: ["942724845760806953"],
    //     mongoUri: process.env.MONGO_URI,
    //     dbOptions: {
    //         keepAlive: true,
    //     }
    // })
    // .setDefaultPrefix("!!")

})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return

    try {
        await command.execute(interaction);
    } catch(err) {
        if (err) console.error(err); 

        await interaction.reply({
            content: "An error occured while executing this command!",
            ephemeral: true
        })
    }
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

