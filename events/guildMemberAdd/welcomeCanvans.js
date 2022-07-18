// const Discord = require("discord.js")
// const canvas = require("canvas")
// const { createCanvas, loadImage, registerFont } = require("canvas")
// const GuildSettings = require("../../models/GuildSettings")

// module.exports = {
//     name: "guildMemberAdd",
//     async execute(member) {

//         registerFont("./assets/fonts/Dosis-Bold.ttf", { family: "dossisBold" })
//         registerFont("./assets/fonts/Dosis-VariableFont_wght.ttf", { family: "dossis", weight: 400 })

//         let canvas = await createCanvas(1700, 600); //best resolution for welcome image
//         let ctx = await canvas.getContext("2d");

//         let img = await loadImage("./assets/img/banner.png")
//         ctx.drawImage(img, canvas.width / 2 - 1700 / 2, canvas.height / 2 - 600 / 2, 1700, 600)

//         ctx.fillStyle = "rgba(0,0,0,0.3)"
//         ctx.fillRect(70, 70, canvas.width - 70 - 70, canvas.height - 70 - 70)

//         ctx.save()
//         ctx.beginPath()
//         ctx.arc(150 + 300 / 2, canvas.height / 2, 150, 0, 2 * Math.PI, false)
//         ctx.clip()
//         img = await loadImage(member.displayAvatarURL({ format: "png" }))
//         ctx.drawImage(img, 150, canvas.height / 2 - 300 / 2, 300, 300)
//         ctx.restore()

//         ctx.fillStyle = "#fff"
//         ctx.textBaseline = "middle"

//         ctx.font = "80px dossis"
//         ctx.fillText("Wellcome", 500, 200)

//         ctx.font = "100px dossisBold"
//         ctx.fillText(member.user.username.slice(0, 20) + "#" + member.user.discriminator, 500, canvas.height / 2)

//         ctx.font = "50px dossis"
//         ctx.fillText(`You are the ${member.guild.memberCount}° membmer`, 500, 400)

//         let data

//         try {
//             data = await GuildSettings.findOne({ guild_id: member.guild.id })

//             if (!data) return
//         } catch (err) {
//             console.log(err)
//         }

//         let channel = client.channels.cache.get(data.welcome_channel_id)

//         let attachments = new Discord.MessageAttachment(canvas.toBuffer(), "canvas.png")

//         channel.send({ files: [attachments] })
//     }
// }