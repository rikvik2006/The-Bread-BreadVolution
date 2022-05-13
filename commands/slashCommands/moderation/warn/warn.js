const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const WarnSchema = require("../../../../models/WarnSchema")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warns a user")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Adds a warn to the user")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("The user to add a warning to")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("reason")
                        .setDescription("The reason for the warn")
                        .setRequired(false)
                )

        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Removes a warning from the user")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("The user to remove a warning from")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("id")
                        .setDescription("The ID of the warning to remove")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("LIsts all warnings for the user")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("The user to list warnings for")
                        .setRequired(true)
                )

        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user")
        const reason = interaction.options.getString("reason") || "No reason provided"
        const id = interaction.options.getString("id")

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
                return no_permission("add a warning to this user", "MANAGE MESSAGES")
            }

            const warinng = await WarnSchema.create({
                userId: user?.id,
                staffId: interaction.member.id,
                guildId: interaction.guild.id,
                reason,
            })

            const add_warn_embed = new Discord.MessageEmbed()
                .setAuthor({ name: `${user.tag} as been warned`, iconURL: user.displayAvatarURL() })
                .setDescription(`**WarningID:** ${warinng.id}\n**Reason:** ${reason}\n**Moderator:** <@${interaction.member.id}>`)

            return interaction.reply({ embeds: [add_warn_embed] })

        } else if (interaction.options.getSubcommand() === "remove") {

            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("remove a warning from this user", "MANAGE MESSAGES")
            }

            // if (WarnSchema.findOne({_id: id} ) == null) {
            //     const no_warn_found_embed = new Discord.MessageEmbed()
            //         .setColor("#F04848")
            //         .setDescription("No warning found with that ID")

            //     return interaction.reply({ embeds: [no_warn_found_embed], ephemeral: true })
            // }

            const warning = await WarnSchema.findByIdAndDelete(id)

            const remove_warn_embed = new Discord.MessageEmbed()
                .setAuthor({ name: `${user.tag} was been forgiven`, iconURL: user.displayAvatarURL() })
                .setDescription(`**WarningID:** ${warning.id}\n**Moderator:** ${interaction.member.id}`)

            return interaction.reply({ embeds: [remove_warn_embed] })

        } else if (interaction.options.getSubcommand() === "list") {

            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("you don't have a permission to look for a list of warnings of this user", "MANAGE MESSAGES")
            }

            const warnings = await WarnSchema.find({
                userId: user?.id,
                guildId: interaction.guild.id,
            })

            let description = `Warnings for <@${user?.id}>\n\n`

            for (const warn of warnings) {
                description += `**ID:** ${warn.id}\n`
                description += `**Date:** ${warn.createdAt.toLocaleString()}\n`
                description += `**Staff:** <@${warn.staffId}>\n`
                description += `**Reason:** ${warn.reason}\n\n`
            }

            const warn_list = new Discord.MessageEmbed()
                .setDescription(description)
                .setColor("#2D2D2D")

            return interaction.reply({ embeds: [warn_list] })
        }
    }
}