module.exports = {
    name: "help",
    data: {
        name: "help",
        description: "Help command"
    },
    execute(interaction) {
        var help_embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Help")
            .setDescription("Prefix `!!`")
            .addField("!!moderation")
            .addField("!!utility")
        
        interaction.reply({ embeds: [help_embed] })
    }
}