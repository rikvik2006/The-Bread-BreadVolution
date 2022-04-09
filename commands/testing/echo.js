const { SlashCommandBuilder } = require("@discordjs/builders");
const { options } = require("../../comandi non utilizait/ban");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("Echo!")
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("The message to echo")
                .setRequired(true)
        ),

    async execute(interaction) {
        interaction.reply({
            content: interaction.options.getString("message"),
            ephemeral: true
        })
    }
}