const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const WarnSchema = require("../../../../models/WarnSchema");

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
                        .setRequired(true)
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

    async execute({ guild, member: staff, interaction }) {
        const user = interaction.options.getUser("user")
        const reason = interaction.options.getString("reason")
        const id = interaction.options.getString("id")

        if (interaction.options.getSubcommand() === "add") {
            const warinng = await WarnSchema.create({
                userId: user?.id,
                staffId: staff.id,
                guildId: guild.id,
                reason,
            })

            return interaction.reply({ content: `Added a warning to ${user.tag} to <@${user?.id}>` })

        } else if (interaction.options.getSubcommand() === "remove") {

            const warning = await WarnSchema.findByIdAndDelete(id)

            return interaction.reply({ content: `Removed a warning to ${user.tag} to <@${user?.id}>` })

        } else if (interaction.options.getSubcommand() === "list") {
            const warnings = await WarnSchema.find({
                userId: user?.id,
                guildId: guild.id,
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