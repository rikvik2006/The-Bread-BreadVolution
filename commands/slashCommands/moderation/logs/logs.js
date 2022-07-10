const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const GuildConfig = require("../../../../models/GuildConfig");

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
        ),

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

            interaction.reply({ embeds: [serverLogChannel_set_embed], })
        }
    }
};
