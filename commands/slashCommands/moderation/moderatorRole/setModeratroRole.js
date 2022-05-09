const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const GuildConfig = require("../../../../models/GuildConfig");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("moderator_role")
        .setDescription("The moderator role for the server (Moderators will be ignored by bot restrictions)")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a role for the moderatro")
            )
}