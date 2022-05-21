const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { v4: uuidv4 } = require('uuid');
const WarnSchema = require("../../models/WarnSchema");
const GuildConfig = require("../../models/GuildConfig")

module.exports = {
    name: "messageCreate",

    async execute(message) {

        let data

        try {
            data = await GuildConfig.findOne({guidlId: message.guild.id})

            if (!data) {
                data = await GuildConfig.create({guildId: message.guild.id})
            }

        } catch (err) {
            console.log(err)
        }

        //ignore users with roles that are in the guildConfig database;
        if (data.moderatorRoles.includes(message.member.roles.cache.first().id)) return



        var badWords = ["merda", "cazzo", "fuck", "shit"]
        let findBadWords = false

        badWords.forEach(word => {
            if (message.content.includes(word)) 
            findBadWords = true;
        })

        if (findBadWords) {
            const warinng = await WarnSchema.create({
                userId: message.author.id,
                staffId: message.client.user.id,
                guildId: message.guild.id,
                warnId: uuidv4(),
                reason: "Bad words detected",
            })
             

            message.delete()

            const add_warn_embed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag} as been warned`, iconURL: message.author.displayAvatarURL() })
                .setDescription(`**WarningID:** ${warinng.warnId}\n**Reason:** ${warinng.reason}\n**Moderator:** <@${message.client.user.id}>`)

            return message.channel.send({ embeds: [add_warn_embed] })
        }
    }
}