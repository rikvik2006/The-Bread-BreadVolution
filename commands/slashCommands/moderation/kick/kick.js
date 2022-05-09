const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user from the server")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to kick")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason for the kick")
                .setRequired(false),
        ),
    async execute(interaction) {

        var no_permission = new Discord.MessageEmbed()
            .setColor("#F04848")
            .setTitle("No permission")
            .setDescription("You don't have permission to kick this user")
            .addField("Permission", "```KICK MEMBERS```")

        if (!interaction.member.permissions.has("KICK_MEMBERS")) {
            return interaction.reply({ embeds: [no_permission], ephemeral: true })
        }

        var user = interaction.options.getUser("user")
        var reason = interaction.options.getString("reason") || "No reason"

        var member = interaction.guild.members.cache.get(user.id)

        var user_not_found = new Discord.MessageEmbed()
            .setColor("#F04848")
            .setDescription("User doesn't exist in this server")

        if (!member) {
            return  interaction.reply({ embeds: [user_not_found], ephemeral: true });
        }

        var no_kickable = new Discord.MessageEmbed()
            .setColor("#F04848")
            .setDescription("I can't kick this user, they have the same or a higher role than me.")
        
        if (!member?.kickable) {
            return interaction.reply({ embeds: [no_kickable], ephemeral: true })
        }

        var kick_embed = new Discord.MessageEmbed()
            .setColor("#2D2D2D")
            .setAuthor({ name: `${user.username}#${user.discriminator} has been kicked`, iconURL: user.displayAvatarURL() })
            .setDescription(`**Reason:** ${reason} \n**Moderator:** <@${interaction.user.id}>`)
        
        member.kick(reason)

        interaction.reply({ embeds: [kick_embed] })

    }
}