const Discord = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const GuildConfig = require("../../../../models/GuildConfig")
const ReactionRole = require("../../../../models/ReactionRoleSchema")
const { v4: uuidv4 } = require('uuid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reaction_roles")
        .setDescription("Create your reaction roles")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Create new embeds whit your reaction roles")
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("Add the role that you will be able to select")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("emoji")
                        .setDescription("Set an emoji for the role (only one)")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("description")
                        .setDescription("Set a description for the role. Maximus 50 characters")
                )
                .addStringOption(option =>
                    option
                        .setName("message-url")
                        .setDescription("Message URL where the reactions will atthached")
                )


        ),
    async execute(interaction) {

        if (interaction.options.getSubcommand() === "add") {

            const role = interaction.options.getRole("role")
            const description = interaction.options.getString("description") || "\u200b"
            const emoji = interaction.options.getString("emoji")
            const url = interaction.options.getString("message-url") || null


            if (description.length > 50) {
                const description_too_length = new Discord.MessageEmbed()
                    .setDescription(x + "The role description can be length maximus 50 characters")
                    .setColor(red_bread)

                return interaction.reply({ embeds: [description_too_length], ephemeral: true })
            }


            if (!emoji.startsWith("<") && !emoji.endsWith(">") /*|| !emoji.startsWith(":") && !emoji.endsWith(":")*/) {
                const invalid_emoji_embed = new Discord.MessageEmbed()
                    .setDescription(x + "The emoji is invialid, or it's not from this server.\n**Tip:** Use the `/emoji copy` for copy an emoji from another server")
                    .setColor(red_bread)

                return interaction.reply({ embeds: [invalid_emoji_embed], ephemeral: true })
            }

            if (url !== null) {
                if (url.length !== 85) {
                    const invalid_url_embed = new Discord.MessageEmbed()
                        .setDescription(x + "The message url, is ivaild, check if was typed well")
                        .setColor(red_bread)

                    return interaction.reply({ embeds: [invalid_url_embed], ephemeral: true })
                }
            }

            const reactionMenu = await ReactionRole.create({
                menuReactionId: uuidv4(),
                guildId: interaction.guild.id,
                userId: interaction.user.id,
                roleId: role.id,
                description: description,
                emoji: emoji
            })

            // for (const role of reactionMenu) {
            //     descriprionEmbed += `**Role:** <@&${role.roleId}>\n`
            //     descriprionEmbed += `**Description:** ${role.description}\n\n`
            // }

            const emojiId = emoji.match(/\d{15,}/g)[0]

            const reaction_roles_embed = new Discord.MessageEmbed()
                .setAuthor({ name: "Select an emoji for get the role", iconURL: interaction.guild.iconURL() })
                .setDescription(`**Role:** <@&${reactionMenu.roleId}>\n**Description:** ${reactionMenu.description}\n\n`)
                .setColor("BLURPLE")
                .setFooter({ text: `Reaction menuID: ${reactionMenu.menuReactionId}` })

            const message = await interaction.reply({ embeds: [reaction_roles_embed], fetchReply: true })
            message.react(emojiId)
            // .catch(() => {
            //     const invalid_emoji_embed = new Discord.MessageEmbed()
            //         .setDescription(x + "The emoji isn't of this server.\n**Tip:** Use the `/emoji copy` for copy an emoji from another server")
            //         .setColor(red_bread)

            //     interaction.reply({ embeds: [invalid_emoji_embed], ephemeral: true })
            // })
        }
    }
}