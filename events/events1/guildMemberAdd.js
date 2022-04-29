const Discord = require('discord.js');
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {

        const guildSettings = await GuildSettings.findOne({ guild_id: member.guild.id })
        
        if (!guildSettings && !guildSettings.welcome_channel_id) return; 

        const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#F8C300")
            .setTitle("New Member!") 
            .setDescription(`Welcome to the server, ${member.user.username}!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

            member.guild.channels.cache.get(guildSettings.welcome_channel_id).send({
                embeds: [newMemberEmbed]
            })
    }
}