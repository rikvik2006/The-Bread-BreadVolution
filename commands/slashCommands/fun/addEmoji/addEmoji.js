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
                )
        ),

}