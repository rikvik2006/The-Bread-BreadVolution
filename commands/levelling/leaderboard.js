const { Message } = require("discord.js")

module.exports = {
    name: "leaderboard",
    data: {
        name: "leaderboard",
        description: "Leaderboard"
    },
    async callback(interaction) {


        await interaction.deferReply({
            ephemeral: true,
        });


        if (interaction.author.bot) return
        if (interaction.channel.type == "dm") {
            return (interaction.editReply({ embeds: [no_dm] }))
        }

        var no_dm = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("No dm")
            .setDescription("You can't use this command in a DM")
            .setThumbnail(interaction.client.user.avatarURL())

        con.query("SELECT * FOROM userstats", (err, result) => {
            var userstatsList = result

            var leaderboardList = userstatsList.sort((a, b) => (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0))

            var leaderboard = ""
            for (var i = 0; i < 10; i++) {
                if (leaderboardList.lenght - 1 < i) {
                    break
                }
                leaderboard += `**#${i + 1}** ${leaderboardList[i].username} - Level ${leaderboardList[i].level}\r`
            }

            var leaderboard_embed = new Discord.MessageEmbed()
                .setColor("#FFC307")
                .setTitle("Leaderboard")
                .setDescription("Rank leverls", leaderboard)

            interaction.editReply ({ embeds: [leaderboard_embed] })
        })
    }

}