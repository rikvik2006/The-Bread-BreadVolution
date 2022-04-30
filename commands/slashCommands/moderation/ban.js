const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a user from the server")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to ban")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason for the ban")
                .setRequired(false),
        )
        .addIntegerOption(option =>
            option
                .setName("days")
                .setDescription("Number of days of messages to delete, must be between 0 and 7, inclusive. Default is 0")
                .setRequired(false)
                .addChoice("0 days", 0)
                .addChoice("1 days", 1)
                .addChoice("2 days", 2)
                .addChoice("3 days", 3)
                .addChoice("4 days", 4)
                .addChoice("5 days", 5)
                .addChoice("6 days", 6)
                .addChoice("7 days", 7)

        ),
    async execute(interaction) {

        var no_permission = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("No permission")
        .setDescription("You don't have permission to ban this user")
        .addField("Permission", "```BAN_MEMBERS```")

        if (!interaction.member.permissions.has("BAN_MEMBERS")) {
            return interaction.reply({ embeds: [no_permission], ephemeral: true })
        }


        var user = interaction.options.getUser("user")
        var reason = interaction.options.getString("reason") || "No reason"
        let days = interaction.options.getInteger("days") || 0


        var member = interaction.guild.members.cache.get(user.id)

        var no_banable = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("No banable")
            .setDescription("The user isn't banable")

        if (!member?.bannable) {
            return interaction.reply({ embeds: [no_banable], ephemeral: true });
        }
            

        member.ban({ reason: reason, days: days })

        var ban_memeber = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("User banned")
            .setDescription(`${user} has been banned`)
            .setThumbnail(member.displayAvatarURL())
            .addField("User:", user.toString())
            .addField("Reason:", reason)
            .addField("Number of days of messages deleted:", days.toString() + " days")

        interaction.reply({ embeds: [ban_memeber] })
    }

}
