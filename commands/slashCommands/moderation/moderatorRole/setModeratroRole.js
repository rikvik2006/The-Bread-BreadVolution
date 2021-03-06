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

        const no_permission = function (action, permission_needed) {
            const no_permission_embed = new Discord.MessageEmbed()
                .setColor("#F04848")
                .setTitle("No permission")
                .setDescription(`You don't have permission to ${action}`)
                .addField("Permission", `\`\`\`${permission_needed}\`\`\``)
            
            interaction.reply({ embeds: [no_permission_embed], ephemeral: true })
        }

        if (interaction.options.getSubcommand() === "add") {

            if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                return no_permission("add a moderator role", "ADMINISTRATOR")
            }

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

                return interaction.reply({ embeds: [set_guild_id_error], ephemeral: true });
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
                .setDescription(`The role ${role} has been added to the moderator role list.\nAll users who have this role will be immune to the bot's restrictions. So be careful what you add`);

            interaction.reply({ embeds: [added_to_list], ephemeral: true });


        } else if (interaction.options.getSubcommand() === "remove") {

            if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                return no_permission("remove a moderator role", "ADMINISTRATOR")
            }

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
                    .setDescription("An error occurred while trying to remove the moderator role. This error has been reported to the developers");

                return interaction.reply({ embeds: [set_guild_id_error], ephemeral: true });
            }

            if (!data.moderatorRoles.includes(role.id)) {
                const not_yet_in_list = new Discord.MessageEmbed()
                    .setColor("#F04848")
                    .setDescription(`The role ${role} isn't yet in the moderator role list`);

                return interaction.reply({ embeds: [not_yet_in_list], ephemeral: true });
            }

            data.moderatorRoles.splice(data.moderatorRoles.indexOf(role.id), 1);
            await data.save()

            const removed_to_list = new Discord.MessageEmbed()
                .setColor("#2D2D2D")
                .setDescription(`The role ${role} has been removed to the moderator role list`);

            interaction.reply({ embeds: [removed_to_list], ephemeral: true });


        } else if (interaction.options.getSubcommand() === "list") {

            if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                return no_permission("get a list of moderator roles", "ADMINISTRATOR")
            }

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
                    .setDescription("An error occurred while trying to whatch the list of moderator role. This error has been reported to the developers");

                return interaction.reply({ embeds: [set_guild_id_error], ephemeral: true });
            }

            if (!data.moderatorRoles.length > 0) {
                const no_role_added = new Discord.MessageEmbed()
                    .setColor("#F04848")
                    .setDescription("There are no moderator roles added to the list");

                return interaction.reply({ embeds: [no_role_added], ephemeral: true});
            }

            const list_of_roles = new Discord.MessageEmbed()
                .setAuthor({name: `${interaction.guild.name} moderator roles`, iconURL: interaction.guild.iconURL()})
                .setColor("#2D2D2D")
                .setDescription(`All users who have this role will be immune to the bot's restrictions. So be careful what you add\n\n**List of role**\n\n${data.moderatorRoles.map(role => `<@&${role}>`).join("\n")}`);

            interaction.reply({ embeds: [list_of_roles], ephemeral: true });

        }
    }
}