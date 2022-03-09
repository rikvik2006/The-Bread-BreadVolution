const { Message } = require("discord.js")

module.exports  = {
    name: "leaderboard",
    data: {
        name: "leaderboard",
        description: "Leaderboard"
    },
    execute(interaction) {
        if (interaction.author.bot) return
        if (interaction.channel.type == "dm") {
            return(interaction.reply({ embeds: [no_dm]}))
        }

        var no_dm = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("No dm")
            .setDescription("You can't use this command in a DM")
            .setThumbnail(interaction.client.user.avatarURL())

        con.query("SELECT * FOROM userstats", (err, result) => {
            var userstatsList = result
            
        })
    }

}