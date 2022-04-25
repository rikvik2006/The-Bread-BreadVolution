const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();
const { createSpinner } = require ('nanospinner'); 

module.exports = {
    name: "ready",
    description: "Ready event",
    async execute(client, commands) {

        //******************/
        //    Activity
        //******************/

        console.log(`🍞｜Bread is ONLINE whit ${client.guilds.cache.size} guilds and ${client.users.cache.size} users!`);
        client.user.setActivity(`${client.guilds.cache.size} servers | ${process.env.PREFIX}help`, { type: "WATCHING" });

        //******************/
        //  Solash Commands
        //******************/

        const CLIENT_ID = client.user.id;

      
        const spinner = createSpinner()
        const rest = new REST({
            version: "9"
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                if (process.env.ENV === "production") {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    });
                    spinner.success({ text: "Succefully registered commands globaly!"});
                } else {
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                        body: commands
                        
                    });
                    spinner.success({ text: "Succefully registered commands locally!"});
                }
            } catch (err) {
                if (err) console.error(err);
            }
        })();
    }
}