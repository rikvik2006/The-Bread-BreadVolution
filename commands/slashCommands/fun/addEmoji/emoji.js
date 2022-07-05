const Discord = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders");
const { default: axios } = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emoji")
        .setDescription("Add an emoji in your server")
        .addSubcommand(subcommand =>
            subcommand
                .setName("copy")
                .setDescription("Copy an emoji form another server")
                .addStringOption(option =>
                    option
                        .setName("emoji")
                        .setDescription("The emoji to copy")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("name")
                        .setDescription("Name of emoji")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove an emoji form the server")
                .addStringOption(option =>
                    option
                        .setName("emoji_name")
                        .setDescription("The name of emoji to remove")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {

        const no_permission = function (action, permission_needed) {
            const no_permission_embed = new Discord.MessageEmbed()
                .setColor("#F04848")
                .setTitle("No permission")
                .setDescription(`${x}You don't have permission to ${action}`)
                .addField("Permission", `\`\`\`${permission_needed}\`\`\``)

            interaction.reply({ embeds: [no_permission_embed], ephemeral: true })
        }

        if (interaction.options.getSubcommand() === "copy") {

            if (!interaction.member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
                return no_permission("add a emoji in this server", "MANAGE EMOJIS AND STICKERS")
            }

            let emoji = interaction.options.getString("emoji").trim()
            let name = interaction.options.getString("name")

            if (name.length < 2 || name.length > 32) {
                const err_name_length = new Discord.MessageEmbed()
                    .setColor(red_bread)
                    .setDescription(x + "The name of emoji must be between 2 and 32 length ")
                return interaction.reply({ embeds: [err_name_length], ephemeral: true })
            }

            if (!emoji.startsWith("<") && !emoji.endsWith(">")) {
                const non_emoji = new Discord.MessageEmbed()
                    .setColor(red_bread)
                    .setDescription(x + "Specific one vaild **custom** emotes")

                return interaction.reply({ embeds: [non_emoji], ephemeral: true })
            }

            if (emoji.startsWith("<") && emoji.endsWith(">")) {
                const id = emoji.match(/\d{15,}/g)[0]

                const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                    .then(image => {
                        if (image) return "gif"
                        else return "png"
                    }).catch(err => {
                        return "png"
                    })

                emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
            }

            interaction.guild.emojis.create(emoji, name)
                .then(emoji => {
                    6
                    const added_emoji = new Discord.MessageEmbed()
                        .setAuthor({ name: `${interaction.user.tag} added an emoji`, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(`**Emoji:** ${emoji.toString()}\n**Name:** \`${emoji.name}\``)
                        .setColor("#2d2d2d")

                    return interaction.reply({ embeds: [added_emoji] })
                }).catch(err => {
                    const err_emoji = new Discord.MessageEmbed()
                        .setDescription(x + "There are an error while adding you emoji")
                        .setColor(red_bread)
                    return interaction.reply({ embeds: [err_emoji], ephemeral: true })
                })
        } else if (interaction.options.getSubcommand() === "remove") {
            if (!interaction.member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
                return no_permission("remove a emoji in this server", "MANAGE EMOJIS AND STICKERS")
            }

            const emojiQuery = interaction.options.getString("emoji_name")?.trim()

            const emoji = await interaction.guild.emojis.fetch()
                .then(emojis => {
                    return emojis.find(x => x.name === emojiQuery || x.toString() === emojiQuery)
                }).catch(err => { })

            if (!emoji) {
                const no_emoji_found = new Discord.MessageEmbed()
                    .setColor(red_bread)
                    .setDescription(`${x}There isn't any emoji whit this name`)

                return interaction.reply({ embeds: [no_emoji_found], ephemeral: true })
            }

            emoji.delete()
                .then(emoji => {
                    const succesDeleted = new Discord.MessageEmbed()
                        .setAuthor({ name: `${interaction.user.tag} deleted an emoji`, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(`**Name: **${emojiQuery}`)
                        .setColor("#2d2d2d")

                    return interaction.reply({ embeds: [succesDeleted] })
                }).catch(err => {
                    const err_delete = new Discord.MessageEmbed()
                        .setColor(red_bread)
                        .setDescription(`${x}unable to remove emoji`)

                    return interaction.reply({ embeds: [err_delete], ephemeral: true })
                })
        }
    }
}