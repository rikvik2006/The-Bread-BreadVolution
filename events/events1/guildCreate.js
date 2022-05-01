const Discord = require("discord.js")
const GuildConfig = require("../../models/GuildConfig")

module.exports = {
    name: "guildCreate",
    async execute(guild) {

        GuildConfig.findOne({ guildId: guild.id }, (err, settings) => {
            console.log(settings)
            if (err) {

                const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))

                var error_to_set_guild_id = new Discord.MessageEmbed()
                    .setColor("#F04848")
                    .setDescription("An error occurred while trying to set the guild id in the databse. This error has been reported to the developers")

                console.log(err)
                return channel.send(error_to_set_guild_id)

            }

            if (!settings) {
                settings = new GuildConfig({
                    guildId: guild.id
                })
            }

            settings.save(err => {
                if (err) {
                    console.log(err);
                    const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))

                    var error_to_set_guild_id = new Discord.MessageEmbed()
                        .setColor("#F04848")
                        .setDescription("An error occurred while trying to set the guild id in the databse. This error has been reported to the developers")

                    return channel.send(error_to_set_guild_id)
                }
            })
        })

    }
}