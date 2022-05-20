const Discord = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const wait = require("node:timers/promises").setTimeout

module.exports = {
    data: new SlashCommandBuilder()
        .setName("link-social")
        .setDescription("All social link like Discord, Twitter, etc."),

    async execute(interaction) {
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel("Discord Server")
                    .setStyle("LINK")
                    .setURL("https://youtu.be/a3Z7zEc7AXQ"),
                new Discord.MessageButton()
                    .setLabel("Invite Me")
                    .setStyle("LINK")
                    .setURL("https://discord.com/api/oauth2/authorize?client_id=784752071026802718&permissions=8&scope=bot%20applications.commands"),
                new Discord.MessageButton()
                    .setCustomId("c")
                    .setLabel("Success")
                    .setStyle("SUCCESS")
            )
                
        await interaction.reply({ content: "Social Links", components: [row] })

        const collector = interaction.channel.createMessageComponentCollector()

        collector.on("collect", async i => {
            if (i.customId === "c") {
            }
        })
    }
}