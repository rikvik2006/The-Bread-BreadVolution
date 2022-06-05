const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const GuildConfig = require("../../../../models/GuildConfig");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("badwords_filter")
        .setDescription("Activates the bad words filter")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add channels to the bad words filter")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel where the bad words filter will check for bad words")
                        .setRequired(true)
                        .addChannelTypes([0])
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove channels from the bad words filter")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel to remove from the bad words filter")
                        .setRequired(true)
                        .addChannelTypes([0])
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("all_channels")
                .setDescription("Activates the bad words filter for all channels")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List all channels in the bad words filter")
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
                return no_permission("add channel to the bad words filter", "MANAGE MESSAGES")
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

            if (data.badWordsChannelAdd.includes(channel.id)) {
                const channel_already_added = new Discord.MessageEmbed()
                    .setColor("#F04848")
                    .setDescription(`${channel} is already added to the bad words filter!`)

                return interaction.reply({ embeds: [channel_already_added], ephemeral: true })
            }

            data.badWordsChannelAdd.push(channel.id)
            await data.save()

            const channel_added = new Discord.MessageEmbed()
                .setColor("#2D2D2D")
                .setDescription(`${channel} has been added to the bad words filter!`)

            interaction.reply({ embeds: [channel_added], ephemeral: true })
        } else if (interaction.options.getSubcommand() === "remove") {
            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("add channel to the bad words filter", "MANAGE MESSAGES")
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

            if (!data.badWordsChannelAdd.includes(channel.id)) {
                const channel_already_added = new Discord.MessageEmbed()
                    .setColor("#F04848")
                    .setDescription(`${channel} isn't added to the bad words filter!`)

                return interaction.reply({ embeds: [channel_already_added], ephemeral: true })
            }

            let badWordsChannelArray = data.badWordsChannelAdd

            badWordsChannelArray = badWordsChannelArray.filter(channelId => channelId !== channel.id)

            data.badWordsChannelAdd = badWordsChannelArray

            await data.save()

            const badwords_channel_removed = new Discord.MessageEmbed()
                .setColor("#2D2D2D")
                .setDescription(`${channel} has been removed from the bad words filter!`)

            interaction.reply({ embeds: [badwords_channel_removed], ephemeral: true })
        } else if (interaction.options.getSubcommand() === "list") {
            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("see a channel list with the bad word filter active", "MANAGE MESSAGES")
            }
            let data = await GuildConfig.findOne({ guildId: interaction.guild.id })
            let channel

            if (!data) {
                channel = "NONE"
            } else {
                channel = data.badWordsChannelAdd
            }

            let channels

            if (channel !== "NONE") {
                channels = channel.map((c) => interaction.guild.channels.cache.get(c)).join(",\r")
            } else {

                channels = "NOT YET SET\r Use `/badwords_filter add` to add channels"
            }

            const badwords_channel_list = new Discord.MessageEmbed()
                .setColor("#2D2D2D")
                .setDescription(`The channels set in the bad words filter are:\r ${channels}`)

            const badwords_any_channel_list = new Discord.MessageEmbed()
                .setColor("#F04848")
                .setDescription("There are no channels set in the bad words filter!")


            if (channel == "NONE") {
                return interaction.reply({ embeds: [badwords_any_channel_list], ephemeral: true })
            }

            await interaction.reply({ embeds: [badwords_channel_list], ephemeral: true })

        } else if (interaction.options.getSubcommand() === "all_channels") {
            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("activate the bad words filter for all channels", "MANAGE MESSAGES")
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

            data.badWordsChannelAdd = allChannelsId

            await data.save()


            const channel_added = new Discord.MessageEmbed()
                .setColor("#2D2D2D")
                .setDescription(`The bad words filter has been activated for all channels!`)

            interaction.reply({ embeds: [channel_added], ephemeral: true })
        }
    }

}