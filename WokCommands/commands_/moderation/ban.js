module.exports = {
    category: "moderation",
    description: "Ban a user from the server.",

    permissions: ["BAN_MEMBERS"],

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
            .setDescription("You must mention a user to bannable")
            .setThumbnail(interaction.client.user.avatarURL()) 
            .setFooter("Usege: !!ban @user <reason>", interaction.client.user.avatarURL())

        if (!target.bannable) {
            if (message) {
                const no_kikable = new Discord.MessageEmbed()
                    .setColor("#F71954")
                    .setTitle("No kikable")
                    .setDescription("The user isn't bannable")
                    .setThumbnail(message.client.user.avatarURL())
                    .setFooter("The user had to be a member of the server to be bannable", message.client.user.avatarURL())
                
                return "The user isn't bannable"//(message.reply({ embeds: no_kikable }))

            }
        }

        args.shift()
        const reason = args.join(" ") || "No reason"

        target.ban({
            reason,
            days: 7,
        })
        return `${target} has been banned.`
    }
    
}

