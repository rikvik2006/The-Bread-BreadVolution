const Discord = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unbans a user from the server")
        .addUserOption((option) => 
            option
                .setName("user")
                .setDescription("The user to unban")
                .setRequired(true),
        )
        .addStringOption((option) => 
            option
                .setName("reason")
                .setDescription("Resson for the unban")
                .setRequired(false),

        ),
    async execute(interaction) {
        var no_permission = new Discord.MessageEmbed()
            .setColor("#F04848")
            .setTitle("No permission")
            .setDescription("You don't have permission to unban this user")
            .addField("Permission", "```BAN_MEMBERS```")

        if (!interaction.member.permissions.has("BAN_MEMBERS")) {
            return interaction.reply({ embeds: [no_permission], ephemeral: true })
        }

        var user = interaction.options.getUser("user")
        var reason = interaction.options.getString("reason") || "No reason"

        var member = interaction.guild.members.cache.get(user.id)

        interaction.guild.members.unban(user.id)
            .then(() => {
                var user_unbanned = new Discord.MessageEmbed()
                    .setColor("#2D2D2D")
                    .setAuthor({ name: `${user.username}#${user.discriminator} has been unbanned`, iconURL: user.displayAvaterURL()})
                    .setDescription(`**Reason:** ${reason} \n**Moderator:** <@${interaction.user.id}>`)
                interaction.reply({ embeds: [user_unbanned], ephemeral: true })
            })
            .catch(() => {
                var user_not_valid = new Discord.MessageEmbed()
                    .setColor("#F04848")
                    .setDescription(`User is not valid or not banned in this server` )
                interaction.reply({ embeds: [user_not_valid], ephemeral: true })
            })
    }
}