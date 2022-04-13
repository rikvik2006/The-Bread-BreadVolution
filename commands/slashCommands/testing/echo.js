const { SlashCommandBuilder } = require("@discordjs/builders");



module.exports = {
    data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("Echo!")
        .addStringOption((option) => //addStringOption
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