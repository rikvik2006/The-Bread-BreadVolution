const { SlashCommandBuilder } = require("@discordjs/builders");
const { DiscordAPIError } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    async execute(interaction) {
        const rackets = ["🪑", "💺", "🏓", "🗑️", "🍝", "🍞", "🥖", "🥪", "🥯", "🐕", "🎮"];

        await interaction.reply({
            
            content: ({embeds: [ping_embed]}),
            ephemeral: true
        });

        const ping_embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Pong!")
            // .setDescription(rackets[Math.floor(Math.random() * rackets.length)])
            // .setFooter(client.user.username,client.user.avatar)

    }
}