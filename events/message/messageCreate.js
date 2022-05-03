require("dotenv").config();

module.exports = {
    name: "messageCreate",
    description: "Message Create",
    execute(message, commands) {
        if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

        const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!message.client.commands.has(commandName) && !message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))) {
            return message.reply({ content: "Command not found", ephemeral: true });
        }
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

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
    }
}