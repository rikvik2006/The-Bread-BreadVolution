const Discord = require('discord.js');
const antispamSchema = require('../../models/AntiSpam');
const map = new Map()


module.exports = {
    name: "messageCreate",

    async execute(message) {

        if (message.author.bot || !message.guild) return

        let channelData

        try {

            channelData = await antispamSchema.findOne({ Guild: message.guild.id })

            if (!channelData) {
                channelData = await antispamSchema.create({ Guild: message.guild.id })
            }

        } catch (err) {

            console.log(err)

        }

        if (channelData.Channels.some(chn => chn === message.channel.id)) {

            if (map.has(message.author.id)) {

                const data = map.get(message.author.id)
                const { lastmsg, timer } = data
                const diff = message.createdTimestamp - lastmsg.createdTimestamp
                let msgs = data.msgs

                // The 2000 here means the timer for sending each message - 2 messages should be sent at a higher consistency of 2 secs

                if (diff > 2000) {

                    clearTimeout(timer)
                    data.msgs = 1
                    data.lastmsg = message

                    data.timer = setTimeout(() => {

                        map.delete(message.author.id)

                    }, 5000)

                    map.set(message.author.id, data)

                } else {

        
                    const reason = "The user has sent a series of messages with an interval of less than 2 seconds"

                    ++msgs

                    // If a person has exceed the parameter of sending 5 msgs inside an interval of 2 secs
                    if (parseInt(msgs) === 5) {

                        const member = message.guild.members.cache.get(message.author.id)

                        member.timeout(1 * 60 * 1000, reason).catch(err => {

                            if (err) {

                                return console.log(err)

                            }

                        })

                        message.reply({
                            embeds: [
                                new Discord.MessageEmbed()
                                    .setAuthor({name: `${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL()})
                                    .setDescription("Has been timed out for spamming!")
                                    
                            ]
                        })

                    } else {
                        data.msgs = msgs
                        map.set(message.author.id, data)
                    }

                }

            } else {

                let remove = setTimeout(() => {
                    map.delete(message.author.id)
                }, 5000)

                map.set(message.author.id, {
                    msgs: 1,
                    lastmsg: message,
                    timer: remove,
                })

            }

        } else return
    }
}