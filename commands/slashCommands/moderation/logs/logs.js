const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const GuildConfig = require("../../../../models/GuildConfig");
const { Discovery } = require("googleapis-common");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("log_channel")
        .setDescription("Set a log log channel for your server")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("modlog")
                .setDescription("Set a channel for moderation log")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The chanenl to set for the moderation log")
                        .setRequired(true)
                        .addChannelTypes([0])
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("serverlog")
                .setDescription("Set the channel for server log (join, leaves, delete/created chanenls ecc..)")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("The channel to set for the server log")
                        .setRequired(true)
                        .addChannelTypes([0])
                )
        )
    // .addSubcommand(subcommand =>
    //     subcommand
    //         .setName("remove")
    //         .setDescription("Remove the channel for mod log from the server")
    //         .addSubcommand(subcommand =>
    //             subcommand
    //                 .setName("modlog")
    //                 .setDescription("Set the channel for modlog")
    //                 .addChannelOption(option =>
    //                     option
    //                         .setName("channel")
    //                         .setDescription("The channel to set for the server log")
    //                         .setRequired(true)
    //                         .addChannelTypes([0])
    //                 )

    //         )
    // )
    // .addSubcommand(subcommand =>
    //     subcommand
    //         .setName("remove")
    //         .setDescription("Remove the channel for mod log from the server")
    //         .addSubcommand(subcommand =>
    //             subcommand
    //                 .setName("serverlog")
    //                 .setDescription("Remove the channel for server log")
    //                 .addChannelOption(option =>
    //                     option
    //                         .setName("channel")
    //                         .setDescription("The channel to set for the server log")
    //                         .setRequired(true)
    //                         .addChannelTypes([0])
    //                 )

    //         )
    // )
    ,

    async execute(interaction) {

        const no_permission = function (action, permission_needed) {
            const no_permission_embed = new Discord.MessageEmbed()
                .setColor("#F04848")
                .setTitle("No permission")
                .setDescription(`You don't have permission to ${action}`)
                .addField("Permission", `\`\`\`${permission_needed}\`\`\``)

            interaction.reply({ embeds: [no_permission_embed], ephemeral: true })
        }

        if (interaction.options.getSubcommand() === "modlog") {
            const channel = interaction.options.getChannel("channel")

            if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                return no_permission("set moderation logs channel", "ADMINISTRATOR")
            }

            let data

            try {
                data = await GuildConfig.findOne({ guildId: interaction.guild.id })

                if (!data) {
                    data = await GuildConfig.create({ guildId: interaction.guild.id })
                }
            } catch (err) {
                console.log(err);
            }

            data.modLogChannel = channel.id;
            await data.save()

            const modLogChannel_set_embed = new Discord.MessageEmbed()
                .setAuthor({ name: `${interaction.user.tag} set a moderation channel log`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`**Channel:** ${channel}\n**Type:** Moderation`)
                .setColor("#2d2d2d")

            interaction.reply({ embeds: [modLogChannel_set_embed] })

        } else if (interaction.options.getSubcommand() === "serverlog") {
            const channel = interaction.options.getChannel("channel");

            if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                return no_permission("set server logs channel", "ADMINISTRATOR")
            }

            let data

            try {
                data = await GuildConfig.findOne({ guildId: interaction.guild.id })

                if (!data) {
                    data = await GuildConfig.create({ guildId: interaction.guild.id })
                }
            } catch (err) {
                console.log(err);
            }

            data.serverLogChannel = channel.id
            await data.save()

            const serverLogChannel_set_embed = new Discord.MessageEmbed()
                .setAuthor({ name: `${interaction.user.tag} added a server log channel`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`**Channel:** ${channel}\n**Type:** Server`)
                .setColor("#2d2d2d")

            interaction.reply({ embeds: [serverLogChannel_set_embed] })
        } if (interaction.options.getSubcommand() === "remove") {
            if (interaction.options.getSubcommand() === "modlog") {

                if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                    return no_permission("remove mod logs channel", "ADMINISTRATOR")
                }

                const channel = interaction.options.getChannel("channel")

                let data

                try {
                    data = await GuildConfig.findOne({ guildId: interaction.guild.id })

                    if (!data) {
                        data = await GuildConfig.create({ guildId: interaction.guild.id })
                    }
                } catch (err) {
                    console.log(err);
                }

                if (data.modLogChannel === undefined) {
                    const no_modlog_channel_set = new Discord.MessageEmbed()
                        .setDescription("You don't have any log mod channel set")
                        .setColor(red_bread)

                    interaction.reply({ embeds: [no_modlog_channel_set], ephemeral: true })
                }

                data.modLogChannel = null;
                await data.save()

                const modLog_chnnel_remove = new Discord.MessageEmbed()
                    .setColor("#2d2d2d")
                    .setAuthor({ name: `${interaction.user.tag} have removed a mod log channel`, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(`**Removed Channel:** ${channel}\n**Type:** Moderation`)

                interaction.reply({ embeds: [modLog_chnnel_remove] })
            } else if (interaction.options.getSubcommand() === "serverlog") {
                if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                    return no_permission("remove server logs channel", "ADMINISTRATOR")
                }

                const channel = interaction.options.getChannel("channel");

                let data

                try {
                    data = await GuildConfig.findOne({ guildId: interaction.guild.id })

                    if (!data) {
                        data = await GuildConfig.create({ guildId: interaction.guild.id })
                    }
                } catch (err) {
                    console.log(err);
                }

                if (data.modLogChannel === undefined) {
                    const no_modlog_channel_set = new Discord.MessageEmbed()
                        .setDescription("You don't have any server log channel set")
                        .setColor(red_bread)

                    interaction.reply({ embeds: [no_modlog_channel_set], ephemeral: true })
                }

                data.serverLogChannel = null;
                data.save();

                const serverLog_channel_remove_embed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${interaction.user.tag} has removed the mod log channel` })
                    .setDescription(`**Removed Channel:** ${channel}\n**Type:** Server Log`)
                    .setColor("#2d2d2d")

                interaction.reply({ embeds: [serverLog_channel_remove_embed] })
            }
        }
    }
};
