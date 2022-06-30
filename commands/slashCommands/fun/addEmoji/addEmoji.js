const Discord = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders");
const { default: axios } = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add_emoji")
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
        ),

    async execute(interaction) {
        if (interaction.options.getSubcommand() === "copy") {
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
                    const added_emoji = new Discord.MessageEmbed()
                        .setAuthor({ name: `${interaction.user.tag} added an emoji`, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(`**Emoji:** ${emoji.toString()}\n**Name:** \`${emoji.name}\``)
                        .setColor("#2d2d2d")

                    return interaction.reply({ embeds: [added_emoji] })
                }).catch(err => {
                    const err_emoji = new Discord.MessageEmbed()
                        .setDescription(x + "There are an erore while adding you emoji")
                        .setColor(red_bread)
                    return interaction.reply({ embeds: [err_emoji], ephemeral: true })
                })
        }
    }
}