module.exports = {
    category: "moderation",
    description: "Kick a user from the server.",

    permissions: ["KICK_MEMBERS"],

    slash: "both",
    testOnly: true,

    guildOnly: true,

    minArgs: 2,
    expectedArgs: "<user> <reason>",
    expectedARgsTypes: ["USER", "STRING"],

    

    callback: ({ message, interaction, args }) => {
        const target = message ? message.mentions.members?.frist() : interaction.options.getMember("user")

        const no_target = new Discord.MessageEmbed()
            .setColor("#F71954")
            .setTitle("No target")
            .setDescription("You must mention a user to kick")
            .setThumbnail(message.client.user.avatarURL()) 
            .setFooter("Usege: !!kick @user <reason>", message.client.user.avatarURL())

        if (!target.kikable) {
            if (message) {
                const no_kikable = new Discord.MessageEmbed()
                    .setColor("#F71954")
                    .setTitle("No kikable")
                    .setDescription("The user isn't kikable")
                    .setThumbnail(message.client.user.avatarURL())
                    .setFooter("The user had to be a member of the server to be kikable", message.client.user.avatarURL())
                
                return (message.reply({ embeds: no_kikable }))

            }
        }

        args.shift()
        const reason = args.join(" ") || "No reason"

        target.kick(reason)
        return `${target} has been kicked.`
    }
    
}

