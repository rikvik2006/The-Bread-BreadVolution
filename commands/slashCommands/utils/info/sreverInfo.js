const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const GuildConfig = require("../../../../models/GuildConfig");
const GuildSettings = require("../../../../models/GuildSettings");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Gets information about the server"),
    
    async execute (interaction) {
        
        const server = interaction.guild;

        const owner_member = interaction.guild.members.cache.get(server.ownerId);

        var botCount = server.members.cache.filter(member => member.user.bot).size;
        var userCount = server.memberCount - botCount;

        var categoryCount = server.channels.cache.filter(c => c.type == "category").size
        var textCount = server.channels.cache.filter(c => c.type == "text").size
        var voiceCount = server.channels.cache.filter(c => c.type == "voice").size
        var roleCount = server.roles.cache.size;

        if (server.premiumTier === "NONE") {
            server.premiumTier = "No boost";
        }

        let data_guild_config

        let data_guild_settings

        try {
            data_guild_config = await GuildConfig.findOne({guildId: server.id})

            data_guild_settings = await GuildSettings.findOne({guild_id: server.id})

            if (!data_guild_config) {
                data_guild_config = await GuildConfig.create({guildId: server.id})
            }
            if (!data_guild_settings) {
                data_guild_settings = await GuildSettings.create({guild_id: server.id})
            }

        } catch (err) {
            console.log(err)
        }


        var server_info_embed = new Discord.MessageEmbed()
            .setThumbnail(server.iconURL())
            .setColor("#2D2D2D")
            .addField("Server Name", server.name, true)
            .addField("Server ID", server.id, true)
            .addField("Guild Owner", `${owner_member.tag}`, true)
            .addField("Boost", server.premiumTier || "No boost", true)
            .addField("Channels", textCount + voiceCount + " Channels", true)
            .addField("Roles", roleCount + " Roles", true)
            .addField("Categories", categoryCount + " Categories", true)
            .addField ("Members", userCount + " Members", true)
            .addField ("Server Prefix", data_guild_config.prefix, true)
            .addField("Welcome Channel", `<#${data_guild_settings.welcome_channel_id}>`)







            // .addField("Owner", "```" + server.ownerId.tag + "```", true)
            // .addField("Server id", "```" + server.id + "```", true)
            // .addField("Server region", "```" + server.region + "```", true)
            // .addField("Members", "```Total: " + server.memberCount + " - Users: " + utentiCount + " - Bots: " + botCount + "```", false)
            // .addField("Channels", "```Category: " + categoryCount + " - Text: " + textCount + " - Voice: " + voiceCount + "```", false)
            // .addField("Server created", "```" + server.createdAt.toDateString() + "```", true)
            // .addField("Boost level", "```Level " + server.premiumTier + " (Boost: " + server.premiumSubscriptionCount + ")```", true)



        interaction.reply({ embeds: [server_info_embed], ephemeral: true })
    }
}
