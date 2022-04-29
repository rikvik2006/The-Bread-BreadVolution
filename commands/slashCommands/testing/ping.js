const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    async execute(interaction) {
        const rackets = ["🪑", "💺", "🏓", "🗑️", "🍝", "🍞", "🥖", "🥪", "🥯", "🐕", "🎮"];


        const ping_embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Pong!")
            .setDescription(rackets[Math.floor(Math.random() * rackets.length)])
            // .setFooter(client.user.username,client.user.avatar)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("ping")
                    .setStyle("primary") 
                    .setLabel("Ping"),
                new MessageButton()
                    .setCustomId("pong")
                    .setStyle("SUCCESS")
                    .setLabel("Pong")
            )


        await interaction.reply({ content: "Pong", embeds: [ping_embed], ephemeral: true,  components:  [row]});
        

        const collector = interaction.channel.createMessageCollector()

        collector.on("collect", async i => {
            if (i.customId === "ping") {
                await i.update({ content: "Pong", ephemeral: true, embeds: [], components: []})
            }
            if (i.customId === "pong") {
                i.reply("Ping")
            }
        })

    }
}