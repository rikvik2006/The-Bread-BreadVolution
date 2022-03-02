const ms = require('ms');

module.exports = {
    name: "mute",
    data: {
        name: "mute",
        description: "Mute a user",
        options: [
            {
                name: "user",
                description: "The user to mute",
                type: "USER",
                required: true
            },
            {
                name: "length",
                description: "The length of the mute",
                type: "STRING",
                required: true
            },
            {
                name: "reason",
                description: "The reason for the mute",
                type: "STRING",
                required: false
            }
        ]
    },
    execute(interaction) {
        var user = interaction.options.getUser("user")
        var reason = interaction.options.getString("reason") || "No reason"
        var length = interaction.options.getString("length")
        var member = interaction.guild.members.cache.get(user.id)


        if (!interaction.member.permissions.has("KICK_MEMBERS")) {
            return interaction.reply({ embeds: [no_permission], ephemeral: true })
        }
        var no_permission = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("No permission")
            .setThumbnail(interaction.client.user.avatarURL())
            .setDescription("You don't have permission to mute this user")
            .addField("Permission", "```KICK_MEMBERS```")

        const timeInMs = ms(length)
        if (timeInMs === undefined) 
            return interaction.reply("Plese specify a valid time");
        
        member.timeout(timeInMs, reason)

        var you_have_been_muted = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setThumbnail(interaction.client.user.avatarURL())
            .setTitle("You have been muted")
            .setDescription(`You have been muted for ${length.toString()}`)
            .addField("Reason", reason)

            interaction.reply({embeds: [you_have_been_muted]})
    }
}