const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    async execute(interaction) {
        const rackets = ["🪑", "💺", "🏓", "🗑️", "🍝", "🍞", "🥖", "🥪", "🥯", "🐕", "🎮"];

        interaction.reply("no non è un ping");

        const ping_embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Pong!")
            // .setDescription(rackets[Math.floor(Math.random() * rackets.length)])
            // .setFooter(client.user.username,client.user.avatar)

    }
}