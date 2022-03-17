module.exports = {
    category: "Moderation",
    name: "ban",
    description: "Ban a user",
    slash: "both",
    testOnly: true,

    // text commands

    expectedArgs: "<user> <reason>",
    minArgs: 2,
    maxArgs: 2,

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
    ],

    callback: ({ interaction, message, args }) => {

        if (interaction) {
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

        if (message) {
            const user = message.mentions.users.first(args[0])
            const reason = args.slice(1).join(" ") || "No reason"

            if (!message.member.permissions.has("BAN_MEMBERS")) {
                return message.reply({ embeds: [no_permission], ephemeral: true })
            }
            var no_permission = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("No permission")
                .setDescription("You don't have permission to ban this user")
                .addField("Permission", "```BAN_MEMBERS```")
                .setThumbnail(message.client.user.avatarURL())
            
            if (!user) {
                return message.reply({ embeds: [no_user], ephemeral: true })
            }

            var no_user = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("User don't exist in this server")
                .setDescription("The user you specified doesn't exist in this server")
                .setThumbnail(message.client.user.avatarURL())
                .setFooter("Use the command with a valid user")
            
            if (!user?.bannable) {
                return message.reply({ embeds: [no_banable], ephemeral: true });
            }

            var no_banable = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("No banable")
                .setDescription("The user isn't banable")
                .setThumbnail(message.client.user.avatarURL())
            
            user.ban()

            var ban_memeber = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("User banned")
                .setDescription(`${user} has been banned`)
                .setThumbnail(user.displayAvatarURL())
                .addField("User", user.toString())
                .addField("Reason", reason)

            message.reply({ embeds: [ban_memeber] })
        }
    }
}