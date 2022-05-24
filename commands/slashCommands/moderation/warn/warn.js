const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const WarnSchema = require("../../../../models/WarnSchema");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require('uuid');


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
                // .addUserOption(option =>
                //     option
                //         .setName("user")
                //         .setDescription("The user to remove a warning from")
                //         .setRequired(true)
                // )
                .addStringOption(option =>
                    option
                        .setName("id")
                        .setDescription("The ID of the warning to remove")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove_all")
                .setDescription("Removes all warnings from the user")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("The user to remove all warnings from")
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
        const member =  interaction.guild.members.cache.get(user.id)

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


            let myuuid = uuidv4();

            const warinng = await WarnSchema.create({
                userId: user?.id,
                staffId: interaction.member.id,
                guildId: interaction.guild.id,
                warnId: myuuid,
                reason,
            })


            const add_warn_embed = new Discord.MessageEmbed()
                .setAuthor({ name: `${user.tag} as been warned`, iconURL: user.displayAvatarURL() })
                .setDescription(`**WarningID:** ${warinng.warnId}\n**Reason:** ${reason}\n**Moderator:** <@${interaction.member.id}>`)

            return interaction.reply({ embeds: [add_warn_embed] })

        } else if (interaction.options.getSubcommand() === "remove") {

            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("remove a warning from this user", "MANAGE MESSAGES")
            }

            let data

            try {

                data = await WarnSchema.findOne({ warnId: id })
                if (!data) {
                    const no_warn_found_embed = new Discord.MessageEmbed()
                        .setColor("#F04848")
                        .setDescription("No warning found with that ID")

                    return interaction.reply({ embeds: [no_warn_found_embed], epehmeral: true })
                }
            } catch (err) {
                console.log(err)
            }

            const remove_warn_user = data.userId

            const member = interaction.guild.members.cache.get(remove_warn_user)

            const warning = await WarnSchema.findOne({ warnId: id }).deleteOne()



            const remove_warn_embed = new Discord.MessageEmbed()
                .setAuthor({ name: `${member.tag} was been forgiven`, iconURL: member.displayAvatarURL() })
                .setDescription(`**WarningID:** ${id}\n**Moderator:** <@${interaction.member.id}>`)

            return interaction.reply({ embeds: [remove_warn_embed] })

        } else if (interaction.options.getSubcommand() === "list") {

            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("you don't have a permission to look for a list of warnings of this user", "MANAGE MESSAGES")
            }

            const warnings = await WarnSchema.find({
                userId: user?.id,
                guildId: interaction.guild.id,
            })

            let description

            for (const warn of warnings) {
                description += `**ID:** ${warn.warnId}\n`
                description += `**Date:** ${warn.createdAt.toLocaleString()}\n`
                description += `**Moderator:** <@${warn.staffId}>\n`
                description += `**Reason:** ${warn.reason}\n\n`
            }

            if (typeof description === "undefined") {
                const no_warns_embed = new Discord.MessageEmbed()
                    .setColor("#2D2D2D")
                    .setAuthor({ name: `${user.tag} has no warnings`, iconURL: user.displayAvatarURL() })

                return interaction.reply({ embeds: [no_warns_embed] })
            } else {

                const warn_list = new Discord.MessageEmbed()
                    .setAuthor({ name: `${user.tag}'s warnings`, iconURL: user.displayAvatarURL() })
                    .setDescription(description)
                    .setColor("#2D2D2D")

                return interaction.reply({ embeds: [warn_list] })

            }
        } else if (interaction.options.getSubcommand() === "remove_all") {
            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return no_permission("remove all warnings from this user", "MANAGE MESSAGES")
            }

            // const warnings = await WarnSchema.find({
            //     userId: user?.id,
            //     guildId: interaction.guild.id,
            // })

            // for (const warn of warnings) {
            //     await warn.deleteOne()
            // }

            // let data

            try {
                data = await WarnSchema.find({ userId: user?.id, guildId: interaction.guild.id})

                if (!data) {
                    const no_warn_found_embed = new Discord.MessageEmbed()
                        .setColor(red_bread)
                        .setDescription("No warnings found for this user")

                    return interaction.reply({ embeds: [no_warn_found_embed], epehmeral: true })
                }

            } catch (err) {
                console.log(err)
            }

            let description = `The following warnings was been forgiven:\n\n`

            for (const warn of data) {
                await warn.deleteOne()
                description += `**WarningID:** ${warn.warnId}\n`
            }


            const removed_all_warns_embed = new Discord.MessageEmbed()
                .setColor(grey_bread)
                .setAuthor({ name: `All warnings was been forgiven from ${member.tag}`, iconURL: member.displayAvatarURL() })
                .setDescription(`**Moderator:** <@${interaction.user.id}>\n${description}`)

            return interaction.reply({ embeds: [removed_all_warns_embed] })
            
        }
    }
}