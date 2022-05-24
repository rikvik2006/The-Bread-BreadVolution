const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { google } = require("googleapis");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("toxic_analyze")
        .setDescription("Analyzes the toxicity of a message")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("The message to analyze")
                .setRequired(true)
        ),

    async execute(interaction) {
        const message = interaction.options.getString("message")

        google.discoverAPI(process.env.DISCOVERY_URL)
            .then(client => {
                const analyzeRequest = {
                    comment: {
                        text: message,
                    },
                    requestedAttributes: {
                        TOXICITY: {},
                    },
                };

                client.comments.analyze(
                    {
                        key: process.env.PROSPECTIVE_API_KEY,
                        resource: analyzeRequest,
                    },
                    (err, response) => {
                        const  analyzed_message_toxicity_err = new Discord.MessageEmbed()
                            .setColor(red_bread)
                            .setDescription("I couldn't analyze the message")
                        
                        if (err) return interaction.reply({ embeds: [analyzed_message_toxicity_err], ephemeral: true});


                        // console.log(JSON.stringify(response.data, null, 2));
                        const obj = JSON.parse(JSON.stringify(response.data, null, 2));
                        const toxicity = (obj.attributeScores.TOXICITY.summaryScore.value * 100).toFixed(2);

                        const analyzed_message_toxicity_result = new Discord.MessageEmbed()
                            .setColor(grey_bread)
                            .setAuthor({ name: `${interaction.user.tag}'s analized message`, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(`Your message is \`${toxicity} %\` toxic`)

                        interaction.reply({ embeds: [analyzed_message_toxicity_result], ephemeral: true });
                    }
                );

            }).catch(err => {
                throw err;
            })

    }
}


