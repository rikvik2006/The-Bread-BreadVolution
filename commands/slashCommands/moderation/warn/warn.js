const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const warnDataBase = require("../../../../models/WarnSchema");

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
        ).addSubcommand(subcommand =>
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
                .addUserOption(options =>
                    options
                        .setName("user")
                        .setDescription("The user to list warnings for")
                        .setRequired(true)
                )

        ),
    async execute({ guild, member: staff, interaction}) {

    }
}