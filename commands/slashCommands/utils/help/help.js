const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Displays the help menu with all the commands")
        .addStringOption((option) =>
            option
                .setName("category")
                .setDescription("The category of the command to display")
                .setRequired(false)
                .addChoice("Moderation", "moderation")
                .addChoice("Antitoxic", "antitoxic")
                .addChoice("Antispam", "antispam")
                .addChoice("Antibadwords", "antibadwords")
                .addChoice("Utils", "utils"),
        ),

    async execute(interaction) {

        const category = interaction.options.getString("category") || null

        const moderation_page_help_embed = new Discord.MessageEmbed()
            .setAuthor({ name: `${interaction.client.user.username} moderation commands`, iconURL: interaction.client.user.displayAvatarURL() })
            .setColor(yellow_bread)
            .addField("`/ban [member] (optional reason)`", "Ban a member from the server")
            .addField("`/unban [member] (optional reason)`", "Unban member form the server")
            .addField("`/warn add [member] (optional reason)`", "Warn a member")
            .addField("`/warn remove [warn-ID]`", "Remove a specific warn form a member")
            .addField("`/warn remove_all [member]`", "Remove all warn from a member")
            .addField("`/warn list [member]`", "Get a list of warn of that user in that server")
            .addField("`/moderator_role add [role]`", "Add a role for your moderators (this role isn't affected form bot moderation BE CAREFUL)")
            .addField("`/modrator_role remove [role]`", "Remove a role from list of moderator role")
            .addField("`/moderator_role list [role]`", "Get a list of moderator roles")
        // .addField("`/`")

        if (category === null) {

            const frist_page_help_embed = new Discord.MessageEmbed()
                .setColor(yellow_bread)
                .setAuthor({ name: `${interaction.client.user.username} all commands`, iconURL: interaction.client.user.displayAvatarURL() })
                .addField("**Moderation**", "`/help moderation`", true)
                .addField("**Anti Toxic**", "`/help antitoxic`", true)
                .addField("**Anti Spam**", "`/help antispam`", true)
                .addField("**Anti Bad Words**", "`/help antibadwords`", true)
                .addField("**Utils**", "`/help utils`", true)

            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId("help_select_menu")
                        .setPlaceholder("Select a category")
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions([
                            {
                                label: "Moderation",
                                description: "Power your moderator whit this powerful commands",
                                value: "moderation_page"
                            },
                            {
                                label: "Anti Toxic",
                                description: "An anti-toxic system that uses machine learning to reveal toxic messages",
                                value: "anti_toxic_page"
                            },
                            {
                                label: "Anti Spam",
                                description: "An anti-spam system that you can full customize",
                                value: "anti_spam_page"
                            },
                            {
                                label: "Anti Bad Words",
                                description: "This system have a very very big list of bad wrods",
                                value: "anti_bad_words_page"
                            },
                            {
                                label: "Utils",
                                description: "A collection of useful commands",
                                value: "utilspage"
                            }

                        ])
                )


            await interaction.reply({ embeds: [frist_page_help_embed], components: [row] });


            const collector = interaction.channel.createMessageComponentCollector({ time: 150000 });

            collector.on("collect", async i => {

                if (i.customId === "help_select_menu") {
                    switch (i.values[0]) {
                        case "moderation_page":

                            await i.deferUpdate();
                            await wait(10);
                            await i.editReply({ embeds: [moderation_page_help_embed], components: [] })
                            collector.stop();
                            break;
                        case "anti_toxic_page":

                            break;
                        case "anti_spam_page":

                            break;
                        case "anti_bad_words_page":

                            break;
                        case "utilspage":

                            break;
                    }
                }
            })

        } else if (category === "moderation") {
            interaction.reply({ embeds: [moderation_page_help_embed] })
        } else if (category === "antitoxic") {

        } else if (category === "antispam") {

        } else if (category === "antibadwords") {

        } else if (category === "utils") {

        }

    }
}