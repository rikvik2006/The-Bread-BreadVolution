const Discord = require("discord.js");
const GuildConfig = require("../../models/GuildConfig");

module.exports = {
    name: "guildBanRemove",
    async execute(ban) {

        let data

        try {
            data = await GuildConfig.findOne({ guildId: ban.guild.id })

            if (!data) {
                data = await GuildConfig.create({ guildId: ban.guild.id })
            }
        } catch (err) {
            console.log(err);
        }

        if (data.modLogChannel === undefined) return

        const channel = client.channels.cache.get(data.modLogChannel);

        const ban_remove_log_embed = new Discord.MessageEmbed()
            .setColor(red_bread)
            .setAuthor({ name: ban.user.tag, iconURL: ban.user.displayAvatarURL() })
            .setDescription(`🔓<@${ban.user.id}> was unbanned`)

        channel.send({ embeds: [ban_remove_log_embed] })
    }
}