module.exports = {
    name: "ban",
    data: {
        name: "ban",
        description: "Ban a user",
        options: [
            {
                name: "user",
                description: "The user to ban",
                type: "USER",
                required: true
            },
            {
                name: "reason",
                description: "The reason for the ban",
                type: "STRING",
                required: false
            }
        ]
    },
    execute(interaction) {

        if (!interaction.member.permissions.has("BAN_MEMBERS")) {
            return interaction.reply({ embeds: [no_permission], ephemeral: true })
        }
        var no_permission = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("No permission")
            .setDescription("You don't have permission to ban this user")
            .addField("Permission", "```BAN_MEMBERS```")
            .setThumbnail(interaction.client.user.avatarURL())

        var utente = interaction.options.getUser("user")
        var reason = interaction.options.getString("reason") || "No reason"

        var member = interaction.guild.members.cache.get(utente.id)
        if (!member?.banable) {
            return interaction.reply({ embeds: [no_banable], ephemeral: true });
        }
        var no_banable = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("No banable")
            .setDescription("The user isn't banable")
            .setThumbnail(interaction.client.user.avatarURL())

        member.ban()

        var ban_memeber = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("User banned")
            .setDescription(`${utente} has been banned`)
            .setThumbnail(utente.displayAvatarURL())
            .addField("User", utente.toString())
            .addField("Reason", reason)

        interaction.reply({ embeds: [ban_memeber] })
    }
}
