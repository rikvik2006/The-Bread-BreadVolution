const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    async execute(interaction) {
        const rackets = ["🪑", "💺", "🏓", "🗑️", "🍝", "🍞", "🥖", "🥪", "🥯", "🐕", "🎮"];

        const ping_embed = new MessageEmbed()
            .setColor("#2D2D2D")
            .setAuthor({ name:`${interaction.user.tag} pong!`, iconURL: interaction.user.displayAvatarURL()})
            // .setDescription(rackets[Math.floor(Math.random() * rackets.length)])
            // .setFooter(client.user.username,client.user.avatar)

        // const row = new MessageActionRow()
        //     .addComponents(
        //         new MessageButton()
        //             .setCustomId("ping")
        //             .setStyle("primary") 
        //             .setLabel("Ping"),
        //         new MessageButton()
        //             .setCustomId("pong")
        //             .setStyle("SUCCESS")
        //             .setLabel("Pong")
        //     )


        await interaction.reply({ embeds: [ping_embed], ephemeral: true});
        

        // const collector = interaction.channel.createMessageComponentCollector()

        // collector.on("collect", async i => {
        //     if (i.customId === "ping") {
        //         await i.update({ content: "Pong", ephemeral: true, embeds: [], components: []})

        //     } else if (i.customId === "pong") {
        //         await i.folowUp("Ping")
        //     }
        // })


    

    }
}