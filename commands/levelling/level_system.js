module.exports = {
    name: "level_system",
    data: {
        name: "rank",
        description: "Level System",
        options: [
            {
                name: "user",
                description: "The user to check",
                type: "USER",
                required: false
            }
        ]
    },
    execute(interaction) {
        if (interaction.author.bot) return
        if (interaction.channel.type == "dm") return

        con.query("SELECT * FROM  userstats", (err, result) => {
            var userstatsList = result

            var user = interaction.options.getUser("user") || interaction.author

            var member = interaction.guild.members.cache.get(user.id) || interaction.member

            var index = userstatsList.findIndex(x => x.userid == user.id)
            if (index < 0) {
                interaction.reply({ embeds: [no_rank] })
                return
            }
            var no_rank = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("No rank")
                .setDescription("The user doesn't have a rank")
                .setDescription("You can lebel up by sending a message in the server")
                .setThumbnail(interaction.client.user.avatarURL())

            var userstats = userstatsList[index]

            var progress = ""
            var nProgress = parseInt(7 * (userstats.xp - calcoloXpNecessario(userstats.level)) / (calcoloXpNecessario(userstats.level + 1) - calcoloXpNecessario(userstats.level)))
            for (var i = 0; i < nProgress; i++) {
                progress += ":white_medium_small_square:"
            }
            for (var i = 0; i < 7 - nProgress; i++) {
                progress += ":black_medium_small_square:"
            }

            var Level_Embed = new Discord.MessageEmbed()
                .setColor("#FFC307")
                .setTitle(utente.user.tag)
                .setDescription("The level of this user")
                .setThumbnail(utente.user.avatarURL())
                .addField("Level " + userstats.level, progress)

            interaction.reply({ embeds: [Level_Embed] })
        })
    }
}