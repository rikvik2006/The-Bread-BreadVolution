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
                .setName("delete_message_days")
                .setDescription("Number of days of messages to delete, must be between 0 and 7, inclusive. Default is 0")
                .setRequired(false)
                .addChoice("Don't delete Any", 0)
                .addChoice("Previous 1 day", 1)
                .addChoice("Previous 2 days", 2)
                .addChoice("Previous 3 days", 3)
                .addChoice("Previous 4 days", 4)
                .addChoice("Previous 5 days", 5)
                .addChoice("Previous 6 days", 6)
                .addChoice("Previous 7 days", 7),

        ),
    async execute(interaction) {

        var no_permission = new Discord.MessageEmbed()
            .setColor("#F04848")
            .setTitle("No permission")
            .setDescription("You don't have permission to ban this user")
            .addField("Permission", "```BAN_MEMBERS```")

        if (!interaction.member.permissions.has("BAN_MEMBERS")) {
            return interaction.reply({ embeds: [no_permission], ephemeral: true })
        }


        var user = interaction.options.getUser("user")
        var reason = interaction.options.getString("reason") || "No reason"
        let days = interaction.options.getInteger("delete_message_days") || 0


        var member = interaction.guild.members.cache.get(user.id)

        var user_not_found = new Discord.MessageEmbed()
            .setColor("#F04848")
            .setDescription("User doesn't exist in this server")

        if (!member) {
            return  interaction.reply({ embeds: [user_not_found], ephemeral: true });
        }

        var no_banable = new Discord.MessageEmbed()
            .setColor("#F04848")
            .setDescription("I can't ban this user, they have the same or a higher role than me.")

        if (!member?.bannable) {
            return interaction.reply({ embeds: [no_banable], ephemeral: true });
        }


        member.ban({ reason: reason, days: days })


        var ban_memeber = new Discord.MessageEmbed()
            .setColor("#2D2D2D")
            .setAuthor({ name: `${user.username}#${user.discriminator} has been banned`, iconURL: user.displayAvatarURL() })
            .setDescription(`**Reason:** ${reason} \n**Moderator:** <@${interaction.user.id}> \n**Number of days of messages deleted:** ${days}`)

        interaction.reply({ embeds: [ban_memeber] })
    }

}
