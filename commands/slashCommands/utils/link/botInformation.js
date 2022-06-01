const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Displays information about the bot. And the privacy policy and terms of service."),
    
    async execute(interaction) {
        const bot_information_embed = new Discord.MessageEmbed()
            .setAuthor({ name: `${interaction.client.user.tag}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setDescription(`${interaction.client.user.tag} is a bot created by [${interaction.client.users.cache.get("715103156568064060").tag}](https://discord.com/users/715103156568064060).\nThis is the [privacy policy](https://bread-its-not-mee6.web.app/privacy-policy) of the application\nAnd this is the instructions to request [elimination of data](https://bread-its-not-mee6.web.app/request-data-deletion). If you want`)
            .setColor(yellow_bread)

        interaction.reply({ embeds: [bot_information_embed], epehemeral: true });
    }
}