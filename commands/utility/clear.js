module.exports = {
    name: "clear",
    data: {
        name: "clear",
        description: "Clear the chat",
        options: [
            {
                name: "amount",
                description: "The amount of messages to delete",
                type: "string",
                required: true
            }

        ]
    },
    execute(interaction) {
        if (!interaction.member.permission.has("MANAGE_MESSAGES")) {
            return interaction.reply({ embeds: [no_premission_embed] })
        }
        var no_premission_embed = new Discord.MessageEmbed()
            .setTitle("No permission")
            .setDescription("You don't have the permission to use this command")
            .setColor("#ff0000")
            .setThumbnail(interaction.client.user.avatarURL())
            .seaFoter("You need the permission `MANAGE_MESSAGES`")

        if (!interaction.guild.me.permissions.has("MANAGE_MESSAGES")) {
            return interaction.reply({ embeds: [no_me_permissions_embed] })
        }
        var no_me_permissions_embed = new Discord.MessageEmbed()
            .setTitle("No permission")
            .setDescription("I don't have the permission to use this command")
            .setColor("#ff0000")
            .setThumbnail(interaction.client.user.avatarURL())
            .seaFoter("I need the permission `MANAGE_MESSAGES`")

        var amount = interaction.options.getString("amount")
        if (!isNaN(amount)) {
            return interaction.reply({ embeds: [invalid_amount_embed] })
        }

        var invalid_amount_embed = new Discord.MessageEmbed()
            .setTitle("Invalid amount")
            .setDescription("The amount is invalid")
            .setColor("#ff0000")
            .setThumbnail(interaction.client.user.avatarURL())
            .seaFoter("The amount must be a number")
    
        if (amount > 100) {
            return interaction.reply({ embeds: [too_much_embed] })
        }
        var too_much_embed = new Discord.MessageEmbed()
            .setTitle("Too much")
            .setDescription("You can't delete more than 100 messages at once")
            .setColor("#ff0000")
            .setThumbnail(interaction.client.user.avatarURL())
            .setFooter("If you want to delete more than 100 messages, you need to clone channel and delete this channel")

        interaction.bulkDelete(amount, true)
        interaction.reply({ embeds: [deleted_embed] }).then(msg => {
            msg.delete({ timeout: 5000 })
        })
        var deleted_embed = new Discord.MessageEmbed()
            .setTitle("Deleted")
            .setDescription("Deleted " + amount + " messages")
            .setColor("#00ff00")
            .setThumbnail(interaction.client.user.avatarURL())
    }
}
