const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const GuildConfig = require("../../../../models/GuildConfig");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("toxic_detector")
        .setDescription("Activates the toxic detector")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add the channel where the toxic detector will be activated")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("The channel where the toxic detector will be activated")
                        .setRequired(true)
                        .addChannelTypes([0])
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove the channel where the toxic detector was activated")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("The channel where the toxic detector will be deactivated")
                        .setRequired(true)
                        .addChannelTypes([0])
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("all_channels")
                .setDescription("Activates the toxic detector for all channels")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("A list with all the channels where the toxic detector is activated")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("toxic_percentage")
                .setDescription("Set the level that a message must pass to be considered toxic")
                .addNumberOption(option =>
                    option
                        .setName("percentage")
                        .setDescription("The field must be filled in only with the desired number, no symbols")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");

        const no_permission = function (action, permission_needed) {
            const no_permission_embed = new Discord.MessageEmbed()
                .setColor("#F04848")
                .setTitle("No permission")
                .setDescription(`You don't have permission to ${action}`)
                .addField("Permission", `\`\`\`${permission_needed}\`\`\``)

            interaction.reply({ embeds: [no_permission_embed], ephemeral: true })
        }

        if (interaction.options.getSubcommand() === "add") {

            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("activate toxic detector", "MANAGE MESSAGES")
            }

            let data

            try {
                data = await GuildConfig.findOne({ guildId: interaction.guild.id })

                if (!data) {
                    data = await GuildConfig.create({ guildId: interaction.guild.id })
                }
            } catch (err) {
                console.log(err)
            }

            if (data.toxicsDetectorChannel.includes(channel.id)) {
                const channel_already_added = new Discord.MessageEmbed()
                    .setColor("#F04848")
                    .setDescription(`Toxic detector is already activated in ${channel} channel!`)

                return interaction.reply({ embeds: [channel_already_added], ephemeral: true })
            }

            data.toxicsDetectorChannel.push(channel.id)
            await data.save()

            const channel_added = new Discord.MessageEmbed()
                .setColor("#2D2D2D")
                .setDescription(`Toxic detector as been activated in${channel} channel!`)

            interaction.reply({ embeds: [channel_added], ephemeral: true })
        } else if (interaction.options.getSubcommand() === "remove") {
            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("deactivate toxic detector", "MANAGE MESSAGES")
            }

            let data

            try {
                data = await GuildConfig.findOne({ guildId: interaction.guild.id })

                if (!data) {
                    data = await GuildConfig.create({ guildId: interaction.guild.id })
                }
            } catch (err) {
                console.log(err)
            }

            if (!data.toxicsDetectorChannel.includes(channel.id)) {
                const channel_already_added = new Discord.MessageEmbed()
                    .setColor("#F04848")
                    .setDescription(`Toxic detector isn't activated in ${channel} channel!`)

                return interaction.reply({ embeds: [channel_already_added], ephemeral: true })
            }

            let toxicsDetectorChannelArray = data.toxicsDetectorChannel

            toxicsDetectorChannelArray = toxicsDetectorChannelArray.filter(channelId => channelId !== channel.id)

            data.toxicsDetectorChannel = toxicsDetectorChannelArray

            await data.save()

            const channel_added = new Discord.MessageEmbed()
                .setColor("#2D2D2D")
                .setDescription(`Toxic detector as been deactivated in ${channel} channel!`)

            interaction.reply({ embeds: [channel_added], ephemeral: true })
        } else if (interaction.options.getSubcommand() === "all_channels") {
            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("activate toxic detector", "MANAGE MESSAGES")
            }

            let data

            try {
                data = await GuildConfig.findOne({ guildId: interaction.guild.id })

                if (!data) {
                    data = await GuildConfig.create({ guildId: interaction.guild.id })
                }
            } catch (err) {
                console.log(err)
            }

            const allChannels = interaction.guild.channels.cache.filter(c => c.type == "GUILD_TEXT")
            const allChannelsId = allChannels.map(c => c.id)

            data.toxicsDetectorChannel = allChannelsId
            await data.save()

            const channel_added = new Discord.MessageEmbed()
                .setColor("#2D2D2D")
                .setDescription(`Toxic detector has been activated for all channels!`)

            interaction.reply({ embeds: [channel_added], ephemeral: true })
        } else if (interaction.options.getSubcommand() === "list") {
            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("see a list of channels where the toxic detector is activated", "MANAGE MESSAGES")
            }

            let data = await GuildConfig.findOne({ guildId: interaction.guild.id })
            let channel

            if (!data) {
                channel = "NONE"
            } else {
                channel = data.toxicsDetectorChannel
            }

            let channels

            if (channel !== "NONE") {
                channels = channel.map((c) => interaction.guild.channels.cache.get(c)).join(",\r")
            } else {
                channel = "NOT YET ACTIVATED\rUse `/toxic_detector add` to activate for one channel.\rOr use `/toxic_detector all_channel` to activete toxic detector of all channel"
            }

            const badwords_channel_list = new Discord.MessageEmbed()
                .setColor("#2D2D2D")
                .setDescription(`Channels were is active the toxic detector are:\r ${channels}`)

            await interaction.reply({ embeds: [badwords_channel_list], ephemeral: true })
        } else if (interaction.options.getSubcommand() === "toxic_percentage") {
            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("hange the percentage to deem a toxic message", "MANAGE MESSAGES")
            }

            const percentage = interaction.options.getNumber("percentage")

            let data

            try {
                data = await GuildConfig.findOne({ guildId: interaction.guild.id })

                if (!data) {
                    data = await GuildConfig.create({ guildId: interaction.guild.id })
                }
            } catch (err) {
                console.log(err)
            }

            console.log(percentage)

            data.toxicPercentage = percentage
            await data.save()

            const change_toxic_percentage_warning = new Discord.MessageEmbed()
                .setDescription("ATTENTION, IF YOU HAVE JUST CHANGED THE PERCENTAGE OF THE TOXIC DETECTOR, WE RECOMMEND TESTING THE NEW PERCENTAGE WITH THE `/toxic_analyze` COMMAND IF YOU ARE NOT SATISFIED WITH YOUR NEW CHOICE, YOU CAN RESET IT AS DEFAULT.\rDEFAULT VALUE IS 90%")
                .setColor(yellow_bread)

            const change_toxic_percentage = new Discord.MessageEmbed()
                .setColor("#2d2d2d")
                .setDescription(`Now the prentage of the toxic detector is \`${percentage}%\``)


            interaction.reply({ embeds: [change_toxic_percentage_warning, change_toxic_percentage], ephemeral: true })

        }
    }
}