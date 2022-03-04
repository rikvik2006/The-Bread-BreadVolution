module.exports = {
    name: "userinfo",
    data: {
        name: "userinfo",
        description: "Get information about a user",
        options: [
            {
                name: "user",
                description: "The user to get information about",
                type: "USER",
                required: true
            }
        ]
    },
    execute(interaction) {
        var user = interaction.options.getUser("user")
        var member = interaction.guild.members.cache.get(user.id)

        var perms_list = ""

        if (member.permissions.has("ADMINISTRATOR")) {
            perms_list += "👑 ADMINISTRATOR\n"
        }
        else {
            var perms = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"]

            for (var i = 0; i < perms.length; i++) {
                if (member.permissions.has(perms[i])) {
                    perms_list += "🔹 " + perms[i] + "\n"
                }
            }
        }

        var user_info_embed = new Discord.MessageEmbed()
            .setTitle(member.user.tag)
            .setDescription("All the info of this user")
            .setThumbnail(member.user.avatarURL())
            .addField("User id", "```" + member.user.id + "```", true)
            // .addField("Status", "```" + member.user.presence.status + "```", true)   <-- Priviliged intents
            .addField("Is a bot?", member.user.bot ? "```Yes```" : "```No```", true)
            .addField("Account created", "```" + member.user.createdAt.toDateString() + "```", true)
            .addField("Joined this server", "```" + member.joinedAt.toDateString() + "```", true)
            .addField("Permissions", "```" + perms_list + "```", false)
            .addField("Roles", "```" + member.roles.cache.map(ruolo => ruolo.name).join("\r") + "```", false)
            .setColor("#00ff00")

        interaction.reply({ embeds: [user_info_embed] })
    }
}
