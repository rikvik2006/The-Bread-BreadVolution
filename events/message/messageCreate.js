require("dotenv").config();
const Discord = require("discord.js");

module.exports = {
    name: "messageCreate",
    description: "Message Create",
    execute(message, commands) {
        if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

        const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!message.client.commands.has(commandName) && !message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))) {

            const command_not_found_embed = new Discord.MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setColor(red_bread)
                .setDescription("Hi, I see you want to use my command, now discord no longer allows you to use text commands like this, but now all commands have been transferred in the form of **SlashCommands** [find out more here](https://support.discord.com/hc/it/articles/1500000368501-Slash-Commands-FAQ).\nTo see a list of commands type `/help`, or just type `/` and click on my logo on the screen, which will open at this point, you will see all the commands available with their name and description")
            return message.reply({ embeds: [command_not_found_embed], ephemeral: true });
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

        const command_not_more_active = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setColor(red_bread)
            .setDescription(`This command is no longer available: \`${message.content}\`\nNow all the commands have been transformed into **Slash Commands** [find out more here](https://support.discord.com/hc/it/articles/1500000368501-Slash-Commands-FAQ).\nTo see a list of commands type \`/help\`, or just type \`/\` and click on my logo on the screen, which will open at this point, you will see all the commands available with their name and description`)

        try {
            // command.execute(message, args);
            message.reply({ embeds: [command_not_more_active] })
        } catch (error) {
            console.error(error);

            const command_error_embed = new Discord.MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setColor(red_bread)
                .setDescription(`There was an error trying to execute that command!\nAn error occurred in the execution of the command!
                If it persists enter the support server with this link\n[Join in the discord server](https://discord.gg/4E2P87sWyu)`)


            message.reply({ embeds: [command_error_embed] })
        }
    }
}