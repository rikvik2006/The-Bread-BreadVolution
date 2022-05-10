const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const GuildConfig = require("../../../../models/GuildConfig");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("moderator_role")
        .setDescription("The moderator role for the server (Moderators will be ignored by bot restrictions)")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a role for the moderator")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role that use your moderator")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a role for the moderator role")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role that will be removed from the moderator role")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("A list of the moderator roles")
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === "add") {
            const role = interaction.options.getRole("role");

            let data

            try {

                data = await GuildConfig.findOne({ guildId: interaction.guild.id })
                if (!data) {
                    data = await GuildConfig.create({ guildId: interaction.guild.id })
                }
            } catch (err) {
                console.log(err);
                
                const set_guild_id_error = new Discord.MessageEmbed()
                    .setColor("#F04848")
                    .setDescription("An error occurred while trying to set the moderator role. This error has been reported to the developers");

                return interaction.reply({ embeds: [set_guild_id_error], ephemeral: true});
            }

            if (data.moderatorRoles.includes(role.id)) {
                const already_in_list = new Discord.MessageEmbed()
                    .setColor("#F04848")
                    .setDescription(`The role ${role.name} is already in the moderator role list`);
                
                return interaction.reply({ embeds: [already_in_list], ephemeral: true });
            }

            data.moderatorRoles.push(role.id);
            await data.save()

            const added_to_list = new Discord.MessageEmbed()
                .setColor("#2D2D2D")
                .setDescription(`The role ${role.name} has been added to the moderator role list`);

            interaction.reply({ embeds: [added_to_list], ephemeral: true });


        } else if (interaction.options.getSubcommand() === "remove") {

        } else if (interaction.options.getSubcommad() === "list") {

        }
    }
}