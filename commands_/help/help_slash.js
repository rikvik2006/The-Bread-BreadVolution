module.exports = {
    category: "Help",
    name: "help",
    description: "Commands list",
    testOnly: true,

    callback: ({client}) => {
        let help_embed = new Discord.MessageEmbed()
            .setAuthor(client.user.tag, client.user.avatarURL())
            .setTitle("Help")
            .setDescription("List of commands")
            .setColor("#EECF6D")
            .setThumbnail(client.user.avatarURL())
            .addField("```Ban```", "Ban a user", true)
            .addField("```Kick```", "Kick a user", true)
            .addField("```Clear```", "Clear the chat", true)
            .addField("```Serverinfo```", "Get information about the server", false)
            .addField("```Userinfo```", "Get information about the user", true)
            .addField("```Rank [user]```", "Get the rank of a user", true)
        return help_embed
    
    }
}