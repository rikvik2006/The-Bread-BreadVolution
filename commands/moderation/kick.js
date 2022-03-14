module.exports = {
    name: "kick",
    data:{
        name: "kick",
        description: "Kick a user from the server.",
        options: [
            {
                name: "user",
                description: "The user to kick",
                type: "USER",
                required: true
            },
            {
                name: "reason",
                description: "The reason for the kick",
                type: "STRING",
                required: false
            }
        ]
    },
    execute(interaction){
        
        var member = interaction.guild.members.cache.get(user.id)
        if (!interaction.member.permissions.has("KICK_MEMBERS")) {
            return interaction.reply({ embeds: [no_permission], ephemeral: true })
        }

        var no_permission = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("No permission")
            .setDescription("You don't have permission to kick this user")
            .addField("Permission", "```KICK_MEMBERS```")
            .setThumbnail(interaction.client.user.avatarURL())

        var user = interaction.options.getUser("user")
        var reason = interaction.options.getString("reason") || "No reason"


        if (!member?.kikable) {
            return interaction.reply({ embeds: [no_kikable], ephemeral: true });
        }
        var no_kikable = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("No kikable")
            .setDescription("The user isn't kikable")
            .setThumbnail(interaction.client.user.avatarURL())

        member.kick()

        var kick_memeber = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("User kicked")
            .setDescription(`has been kicked`)
            .setThumbnail(user.displayAvatarURL())
            .addField("User", user.toString())
            .addField("Reason", reason)
        
        interaction.reply ({ embeds: [kick_memeber] })
    }

}