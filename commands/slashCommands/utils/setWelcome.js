const { SlashCommandBuilder } = require("@discordjs/builders");
const GuildSettings = require("../../../models/GuildSettings");
const { Permissions } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setwelcomechannel")
        .setDescription("Set the welcome channel for the server")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel to set as the welcome channel")
            .setRequired(true)
            .addChannelTypes([0])
        ),
    async execute(interaction) {

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply("You do not have permission to use this command.");
        }

        GuildSettings.findOne({ guild_id: interaction.guild.id }, (err, settings) => {
            if (err) {
                console.log(err);
                return interaction.reply("An error occurred while trying to set the welcome channel. This error has been reported to the developers");
            }

            if (!settings) {
                settings = new GuildSettings({
                    guild_id: interaction.guild.id,
                    welcome_channel_id: interaction.options.getChannel("channel").id
                })
            } else {
                settings.welcome_channel_id = interaction.options.getChannel("channel").id;
            }

            settings.save(err => {
                if (err) {
                    console.log(err);
                    return interaction.reply("An error occurred while trying to set the welcome channel. This error has been reported to the developers");
                }

                interaction.reply({ content: `Welcome channel set to ${interaction.options.getChannel("channel")}`, ephemeral: true })

            })
        })
    }
}