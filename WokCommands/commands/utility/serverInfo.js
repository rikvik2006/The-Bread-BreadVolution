module.exports = {
    name: "serverinfo",
    data: {
        name: "serverinfo",
        description: "Get information about the server",
    },
    callback(interaction) {

        var server = interaction.guild;

        var botCount = server.members.cache.filter(member => member.user.bot).size;
        var utentiCount = server.memberCount - botCount;

        var categoryCount = server.channels.cache.filter(c => c.type == "category").size
        var textCount = server.channels.cache.filter(c => c.type == "text").size
        var voiceCount = server.channels.cache.filter(c => c.type == "voice").size

        var server_info_embed = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setThumbnail(server.iconURL())
            .setDescription("All info on this server")
            .setThumbnail(server.iconURL())
            .addField("Owner", "```" + server.ownerId.tag + "```", true)
            .addField("Server id", "```" + server.id + "```", true)
            .addField("Server region", "```" + server.region + "```", true)
            .addField("Members", "```Total: " + server.memberCount + " - Users: " + utentiCount + " - Bots: " + botCount + "```", false)
            .addField("Channels", "```Category: " + categoryCount + " - Text: " + textCount + " - Voice: " + voiceCount + "```", false)
            .addField("Server created", "```" + server.createdAt.toDateString() + "```", true)
            .addField("Boost level", "```Level " + server.premiumTier + " (Boost: " + server.premiumSubscriptionCount + ")```", true)



        interaction.reply({ embeds: [server_info_embed] })
    }
}