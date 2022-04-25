const { SlashCommandBuilder } = require("@discordjs/builders");
const SetTimeZone = require("../../../models/SetTimeZoneSchema");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../../models/GuildSettings");

module.exports  = {
    data: new SlashCommandBuilder()
        .setName("settimezone")
        .setDescription("Set the timezone for the server")
        .addStringOption(option => option
                .setName("timezone")
                .setDescription("The timezone to set for the server")
                .setRequired(true)
                
                ),
    async execute(interaction) {
        
        if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
            return interaction.reply("You do not have permission to use this command.");
        }

        SetTimeZone.findOne({ guild_id: interaction.guild.id }, (err, settings) => {
            if (err) {
                console.log (err);
                return interaction.reply("An error occurred while trying to set the timezone. This error has been reported to the developers");
            }

            if (!settings) {
                settings = new GuildSettings({
                    guild_id: interaction.guild.id,
                    timezone: interaction.options.getString("timezone")
                })
            } else {
                settings.timezone = interaction.options.getString("timezone");
            }

            settings.save(err => {
                if (err) {
                    console.log(err)
                    return interaction.reply("An error occurred while trying to set the timezone. This error has been reported to the developers");
                }

                interaction.reply (`Timezone set to ${interaction.options.getString("timezone")}`);
            })
        })
    }
}