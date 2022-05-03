const Discord = require('discord.js');
const antispamSchema = require('../../models/AntiSpam');
const map = new Map()


module.exports = {
    name: "messageCreate",

    async execute(message) {

        // If the message author is a bot or it's not from a guild
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

        // If the channel data, where you're typing all the messages is same as it's saved in the DB it's gonna consider it
        if (channelData.Channels.some(chn => chn === message.channel.id)) {

            // If map has the author id
            if (map.has(message.author.id)) {

                const data = map.get(message.author.id)
                const { lastmsg, timer } = data
                const diff = message.createdTimestamp - lastmsg.createdTimestamp
                let msgs = data.msgs

                // The 2000 here means the timer for sending each message - 2 messages should be sent at a higher consistency of 2 secs
                // You can change the 2000 to any time interval you want
                if (diff > 2000) {

                    clearTimeout(timer)
                    data.msgs = 1
                    data.lastmsg = message

                    data.timer = setTimeout(() => {

                        map.delete(message.author.id)

                    }, 5000)

                    map.set(message.author.id, data)

                } else {

                    // If the time interval for messages are less than 2 secs
                    const reason = "The user has sent a series of messages with an interval of less than 2 seconds"

                    ++msgs

                    // If a person has exceed the parameter of sending 5 msgs inside an interval of 2 secs
                    if (parseInt(msgs) === 5) {

                        // Require the member
                        const member = message.guild.members.cache.get(message.author.id)

                        // Timeout the member
                        member.timeout(1 * 60 * 1000, reason).catch(err => {

                            if (err) {

                                return console.log(err)

                            }

                        })

                        message.reply({
                            embeds: [
                                new Discord.MessageEmbed()
                                    .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL()})
                                    .setDescription("Has been timed out for spamming!")
                                    
                            ]
                        })

                    } else {
                        data.msgs = msgs
                        map.set(message.author.id, data)
                    }

                }

            } else {

                // After the time is over remove the map from the member
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