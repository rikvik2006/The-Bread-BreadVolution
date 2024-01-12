const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const GuildConfig = require("../../../../models/GuildConfig");
const GuildSettings = require("../../../../models/GuildSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Gets information about the server"),

    /**
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(interaction) {

        const server = await interaction.guild.fetch();

        const guildMembers = await server.members.fetch()
        let ownerMember, botCount, userCount;
        let isDefinedGuildMembers = false;
        if (guildMembers && guildMembers.size != 0) {
            isDefinedGuildMembers = true
            ownerMember = guildMembers.get(server.ownerId);
            botCount = guildMembers.filter(member => member.user.bot).size;
            userCount = server.memberCount - botCount;
        }

        const guildChannels = await server.channels.fetch();

        var categoryCount = guildChannels.filter(c => c.type == "GUILD_CATEGORY").size
        var textCount = guildChannels.filter(c => c.type == "GUILD_TEXT").size
        var voiceCount = guildChannels.filter(c => c.type == "GUILD_VOICE").size
        var roleCount = server.roles.cache.size;

        // if (server.premiumTier === "NONE") {
        //     server.premiumTier = "No boost";
        // } else if 

        let premiumTierLevel
        switch (server.premiumTier) {
            case "NONE":
                premiumTierLevel = null
                break
            case "TIER_1":
                premiumTierLevel = "Level 1";
                break
            case "TIER_2":
                premiumTierLevel = "Level 2";
                break
            case "TIER_3":
                premiumTierLevel = "Level 3"
                break
        }

        let data_guild_config

        let data_guild_settings

        try {
            data_guild_config = await GuildConfig.findOne({ guildId: server.id })

            data_guild_settings = await GuildSettings.findOne({ guild_id: server.id })

            if (!data_guild_config) {
                data_guild_config = await GuildConfig.create({ guildId: server.id })
            }
            if (!data_guild_settings) {
                data_guild_settings = await GuildSettings.create({ guild_id: server.id })
            }

        } catch (err) {
            console.log(err)
        }


        var server_info_embed = new Discord.MessageEmbed()
            .setThumbnail(server.iconURL())
            .setColor(yellow_bread)
            .addField("Server Name", server.name, true)
            .addField("Server ID", server.id, true)

        if (isDefinedGuildMembers) {
            server_info_embed.addField("Guild Owner", `${ownerMember.user.username}`, true)
        }

        server_info_embed
            .addField("Boost", `${premiumTierLevel ? '[' + premiumTierLevel + ']' : ""} ${server.premiumSubscriptionCount}`, true)
            .addField("Channels", textCount + voiceCount + " Channels", true)
            .addField("Roles", roleCount + " Roles", true)
            .addField("Categories", categoryCount + " Categories", true)

        if (isDefinedGuildMembers) {
            server_info_embed.addField("Members", userCount + " Members", true)
        }

        server_info_embed
            .addField("Server Prefix", data_guild_config.prefix, true)
            // <#${data_guild_settings.welcome_channel_id}>
            .addField("Welcome Channel", data_guild_settings.welcome_channel_id ? `<#${data_guild_settings.welcome_channel_id}>` : "No welcome channel setted")





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
