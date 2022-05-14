const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears a number of messages")
        .addIntegerOption(option =>
            option
                .setName("ammount")
                .setDescription("The number of messages to delete")
                .setRequired(true)
        ),
    async execute(interaction) {

        const no_permission = function (action, permission_needed) {
            const no_permission_embed = new Discord.MessageEmbed()
                .setColor("#F04848")
                .setTitle("No permission")
                .setDescription(`You don't have permission to ${action}`)
                .addField("Permission", `\`\`\`${permission_needed}\`\`\``)

            interaction.reply({ embeds: [no_permission_embed], ephemeral: true })
        }

        if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
            return no_permission("delete messages", "MANAGE MESSAGES")
        }

        if (!interaction.guild.me.permissions.has("MANAGE_MESSAGES")) {
            var no_me_permissions_embed = new Discord.MessageEmbed()
                .setTitle("No permission")
                .setDescription("I don't have the permission to delete messages")
                .addField("Permission", `\`\`\`MANAGE MESSAGES\`\`\``)
                .setColor("#F04848")
            return interaction.reply({ embeds: [no_me_permissions_embed] })
        }

        var ammount = interaction.options.getInteger("ammount") || 0

        if (ammount > 100) {
            var too_much_embed = new Discord.MessageEmbed()
                .setDescription("I can't delete more than 100 message per time")
                .setColor("#F04848")

            return interaction.reply({ embeds: [too_much_embed] })
        }

        const messages_deleted_embed = new Discord.MessageEmbed()
            .setDescription(`Deleted ${ammount} messages (This message will be automatically deleted
                )`)
            .setColor("#2D2D2D")

        // await interaction.deleteReply(ammount, true)/
        await interaction.reply({ embeds: [messages_deleted_embed] })
        setTimeout(function() {
            interaction.deleteReply()
        }, 3000);


    }
}