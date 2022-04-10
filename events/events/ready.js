const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

module.exports = {
    name: "ready",
    description: "Ready event",
    once: true,
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

        
        //******************/
        //    MongoDB
        //******************/

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
    }
}