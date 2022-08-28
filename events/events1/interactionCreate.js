module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        if (!interaction.isCommand()) return

        const command = interaction.client.commands.get(interaction.commandName)
        if (!command) return

        try {
            await command.execute(interaction);
        } catch (err) {
            if (err) console.error(err);

            const command_error_embed = new Discord.MessageEmbed()
                .setColor(red_bread)
                .setDescription(`There was an error trying to execute that command!\nAn error occurred in the execution of the command!
            If it persists enter the support server with this link\n[Join in the discord server](https://discord.gg/4E2P87sWyu)`)


            await interaction.reply({
                embeds: [command_error_embed],
                ephemeral: true
            })
        }
    }
}