module.exports = {
    name: "messageCreate",
    description: "Message Create",
    execute(message) {
        if (message.author.bot) return
        if (message.channell.type == "dm") {
            return (message.reply({ embeds: [no_dm] }))
        }
        var no_dm = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("No dm")
            .setDescription("You can't use this command in a DM")
            .setThumbnail(message.client.user.avatarURL())
    }
}