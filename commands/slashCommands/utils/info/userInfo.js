const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Get information about the user")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The name of the user to get info about")
                .setRequired(true)
        ),

    async execute(interaction) {

        const user = interaction.options.getUser("user")

        const member = interaction.guild.members.cache.get(user.id)

        var perms_list = "";

        if (member.permissions.has("ADMINISTRATOR")) {
            perms_list += "👑 ADMINISTRATOR\n"
        } else {
            var perms = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"]

            for (var i = 0; i < perms.length; i++) {
                if (member.permissions.has(perms[i])) {
                    perms_list += "🔹 " + perms[i] + "\n";
                }
            }
        }

        const rolesId = member.roles.cache.map(roles => roles.id)

        console.log(rolesId)

        let rolesIDEceptEveryone = rolesId.slice(0, rolesId.length - 1);

        console.log(rolesIDEceptEveryone)



        var user_info_embed = new Discord.MessageEmbed()
            .setColor(yellow_bread)
            .setAuthor({ name: `${user.tag}'s informations`, iconURL: user.displayAvatarURL() })
            .addField("Username", user.tag, true)
            .addField("User ID", user.id, true)
            .addField("Created At", member.user.createdAt.toDateString(), true)
            .addField("Joined At", member.joinedAt.toDateString(), true)
            .addField("Roles", `Roles: ${rolesIDEceptEveryone.join(", ")}`, true)
            .setThumbnail(user.displayAvatarURL())


        // .setThumbnail(user.displayAvatarURL())
        // .addField("User id", "```" + member.user.id + "```", true)
        // // .addField("Status", "```" + member.user.presence.status + "```", true)   <-- Priviliged intents
        // .addField("Is a bot?", member.user.bot ? "```Yes```" : "```No```", true)
        // .addField("Account created", "```" + member.user.createdAt.toDateString() + "```", true)
        // .addField("Joined this server", "```" + member.joinedAt.toDateString() + "```", true)
        // .addField("Permissions", "```" + perms_list + "```", false)
        // .addField("Roles", "```" + member.roles.cache.map(ruolo => ruolo.name).join("\r") + "```", false)
        // .setColor("#2D2D2D")

        interaction.reply({ embeds: [user_info_embed], ephemeral: true })
    }
}