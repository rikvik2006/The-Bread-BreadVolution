const Discord = require("discord.js");
const { google } = require("googleapis");
const GuildConfig = require("../../../models/GuildConfig");
const { v4: uuidv4 } = require('uuid');
const WarnSchema = require("../../../models/WarnSchema");
const {readFileSync, promises: fsPromises} = require('fs');

module.exports = {
    name: "messageCreate",

    async execute(message) {

        function syncReadFile(filename) {
            const contents = readFileSync(filename, 'utf-8');

            const badWords = contents.split(/\r?\n/);

            console.log(badWords);

            return badWords;
        }

        // syncReadFile("../../../config/badWords/badWords.txt");



        // badWords.forEach(word => {
        //     if (message.content.includes(word)) {
        //         return
        //     }
        // })

        let data

        try {
            data = await GuildConfig.findOne({ guildId: message.guild.id });
        } catch (err) {
            console.log(err)
        }


        if (!data.toxicsDetectorChannel.includes(message.channelId)) return

        let text = message.content;

        google.discoverAPI(process.env.DISCOVERY_URL)
            .then(client => {
                const analyzeRequest = {
                    comment: {
                        text: text,
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
                    async (err, response) => {
                        if (err) return //console.log(err);

                        // console.log(JSON.stringify(response.data, null, 2));
                        const obj = JSON.parse(JSON.stringify(response.data, null, 2));
                        const toxicity = Math.ceil(obj.attributeScores.TOXICITY.summaryScore.value * 100);


                        if (toxicity >= 90) {
                            message.delete()
                            const warinng = await WarnSchema.create({
                                userId: message.author?.id,
                                staffId: message.client.user.id,
                                guildId: message.guild.id,
                                warnId: uuidv4(),
                                reason: "Toxicity detected",
                            })

                            const toxicity_detected_warn_embed = new Discord.MessageEmbed()
                                .setColor(grey_bread)
                                .setAuthor({ name: `${message.author.tag}'s toxicity detected`, iconURL: message.author.displayAvatarURL() })
                                .setDescription(`**WarnID:** ${warinng.warnId}\n**Reason:** ${warinng.reason}\n**Moderator:** <@${warinng.staffId}>\n**Toxicity level:** \`${toxicity}%\``)

                            return message.channel.send({ embeds: [toxicity_detected_warn_embed] });
                        }
                    }
                );

            }).catch(err => {
                throw err;
            })
    }
}