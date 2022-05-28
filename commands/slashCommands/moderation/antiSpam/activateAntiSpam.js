const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const antiSpamSchema = require('../../../../models/AntiSpam')
const GuildConfig = require("../../../../models/GuildConfig")
const ms = require("ms")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("antispam")
        .setDescription("Activates the antispam")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Adds channels to the atispam system ")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel where the atispam system will check for spammers")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Removes channels to the atispam system")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel where the anti spam system won't check for spammers")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("all_channels")
                .setDescription("Add all channels to the atispam system")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("Lists all the channels where the anti spam system is checking for spammers")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("set_time_out")
                .setDescription("Spammers will timeout born for the amount of time entered (default 30 minutes)")
                .addStringOption(option =>
                    option
                        .setName("time")
                        .setDescription("The amount of time in minutes the spammer will be timeouted")
                        .setRequired(true)
                )
        ),

    async execute(interaction, client) {
        const { options, guild, channel } = interaction

        const no_permission = function (action, permission_needed) {
            const no_permission_embed = new Discord.MessageEmbed()
                .setColor("#F04848")
                .setTitle("No permission")
                .setDescription(`You don't have permission to ${action}`)
                .addField("Permission", `\`\`\`${permission_needed}\`\`\``)

            interaction.reply({ embeds: [no_permission_embed], ephemeral: true })
        }

        switch (options.getSubcommand()) {

            case "add": {

                if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                    return no_permission("add channel to the anti spam system", "MANAGE MESSAGES")
                }

                const channel = options.getChannel("channel")

                let data

                try {

                    data = await antiSpamSchema.findOne({ Guild: guild.id })

                    if (!data) {

                        data = await antiSpamSchema.create({ Guild: guild.id })

                    }

                } catch (err) {

                    console.log(err)

                }

                if (data.Channels.includes(channel.id)) return interaction.reply({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setColor("#F04848")
                            .setDescription(`${channel} is already added to Anti-spam system!`)
                    ],
                    ephemeral: true
                })

                data.Channels.push(channel.id)
                await data.save()

                interaction.reply({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setColor("#2D2D2D")
                            .setDescription(`${channel} is successfully added to Anti-spam system`)
                    ],
                    ephemeral: true
                })

            } break;

            case "remove": {

                if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                    return no_permission("remove channel to the antispam system", "MANAGE MESSAGES")
                }


                const channel = options.getChannel("channel")

                let data

                try {

                    data = await antiSpamSchema.findOne({ Guild: guild.id })

                    if (!data) {

                        data = await antiSpamSchema.create({ Guild: guild.id })

                    }

                } catch (err) {

                    console.log(err)

                }

                if (!data.Channels.includes(channel.id)) return interaction.reply({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setColor(read_bread)
                            .setDescription(`${channel} is not even added to Anti-spam system!`)
                    ],
                    ephemeral: true
                })

                let array = data.Channels

                array = array.filter(x => x !== channel.id)

                data.Channels = array

                await data.save()

                interaction.reply({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setColor("#2D2D2D")
                            .setDescription(`${channel} is successfully deleted from Anti-spam system`)
                    ],
                    ephemeral: true
                })

            } break;

            case "list": {


                if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                    return no_permission("to watch a list of channel where the anti spam is activated", "MANAGE MESSAGES")
                }


                let data = await antiSpamSchema.findOne({ Guild: guild.id })
                let channel

                if (!data) {

                    channel = "NOT SET YET"

                } else {

                    channel = data.Channels

                }

                let channels

                if (channel !== "NOT SET YET") {

                    channels = channel.map((c) => guild.channels.cache.get(c)).join(",\r")

                } else {

                    channels = "NOT YET SET"

                }

                interaction.reply({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setColor("BLUE")
                            .setDescription(`✅ - The channels set in antispam system are:\r ${channels}`)
                    ],
                    ephemeral: true
                })

            } break;

            case "all_channels": {
                if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                    return no_permission("activate the bad words filter for all channels", "MANAGE MESSAGES")
                }

                let data

                try {
                    data = await antiSpamSchema.findOne({ Guild: interaction.guild.id })

                    if (!data) {
                        data = await antiSpamSchema.create({ Guild: interaction.guild.id })
                    }

                } catch (err) {
                    console.log(err)
                }

                const allChannels = interaction.guild.channels.cache.filter(c => c.type == "GUILD_TEXT")
                const allChannelsId = allChannels.map(c => c.id)

                data.Channels = allChannelsId

                await data.save()

                if (data.Channels == allChannelsId) {
                    const channel_already_added = new Discord.MessageEmbed()
                        .setColor("#F04848")
                        .setDescription(`Anti Spam is already active for all channels!`)

                    return interaction.reply({ embeds: [channel_already_added], ephemeral: true })
                }

                const channel_added = new Discord.MessageEmbed()
                    .setColor("#2D2D2D")
                    .setDescription(`Anti spam has been activated for all channels!`)

                interaction.reply({ embeds: [channel_added], ephemeral: true })

            } break;

            case "set_time_out": {
                if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                    return no_permission("set the timeout that will be given to spammers", "MANAGE MESSAGES")
                }

                const time = ms(interaction.options.getString("time"))

                let data

                try {
                    data = await GuildConfig.findOne({ guildId: interaction.guild.id })
                    if (!data) {
                        data = await GuildConfig.create({ guildId: interaction.guild.id })
                    }
                } catch (err) {
                    console.log(err)
                }
                
                console.log(time)

                await data.antiSpamTimeOut.create(time.toString())

                const timeOutSet_embed = new Discord.MessageEmbed()
                    .setColor("#2d2d2d")
                    .setDescription(`Now spammers will be time outed with a penalty of \`${time}\``)     

                interaction.reply({ embeds: [timeOutSet_embed], ephemeral: true })
            } break;


        }
    }
}