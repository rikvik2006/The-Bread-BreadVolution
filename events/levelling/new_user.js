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

        con.query("SELECT * FROM  userstats", (err, result) => {
            var userstatsList = result;

            var index = userstatsList.findIndex(x => x.id == message.author.id);
            if (index < 0) {
                index = userstatsList.length;

                userstatsList[index] = {
                    id: message.author.id,
                    username: message.member.user.tag,
                    xp: 0,
                    level: 0,
                    cooldownXp: 0
                }
                
                con.query(`INSERT INTO userstats VALUES ('${message.author.id}', '${message.member.user.tag}', 0, 0, 0)`)
            }

            var userstats = userstatsList[index];

            if (userstats.cooldownXp <= 0) {
                userstatasl.coolddownXP = 60; 
                var xp = Math.floor(Math.random() * (40 - 15 + 1)) + 15;
                userstats.xp += xp;

                if (userstats.xp >= calcoloXpNecessario(userstats.level + 1)) {
                    userstats.level++;

                    var channel = client.channels.chache.get("942724846201241631");
                    channel.send(`${message.member.user.tag} you have reached teh level ${userstats.level}`)

                }

                con.query(`UPDATE userstats SET level = ${userstats.level}, xp = ${userstats.xp}, cooldownXp = ${userstats.cooldownXp} WHERE id = ${userstats.id}`)
            }
        })
    }
}

//test
//test