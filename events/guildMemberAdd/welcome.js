const Discord = require("discord.js");
const Canvas = require("canvas");
const GuildSettings = require("../../models/GuildSettings")
const path = require("path")

module.exports = {
    name: "guildMemberAdd",

    async execute(member) {
        Canvas.registerFont(path.join(__dirname, "../../assets/fonts", "Dosis-Bold.ttf"), {
            family: "Dosis",
        });

        var welcomeCanvas = {};
        welcomeCanvas.create = Canvas.createCanvas(1024, 500)
        welcomeCanvas.context = welcomeCanvas.create.getContext('2d')
        welcomeCanvas.context.font = '72px Dosis';
        welcomeCanvas.context.fillStyle = '#ffffff';

        Canvas.loadImage("./assets/img/banner.png").then(async (img) => {
            welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500)
            welcomeCanvas.context.fillText("welcome", 360, 360);
            welcomeCanvas.context.beginPath();
            welcomeCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
            welcomeCanvas.context.stroke()
            welcomeCanvas.context.fill()
        })

        let data

        try {
            data = await GuildSettings.findOne({ guild_id: member.guild.id })

            if (!data) {
                data = await GuildSettings.create({ guild_id: member.guild.id })
            }
        } catch (err) {
            console.log(err);
        }


        welcomechannel = member.guild.channels.cache.get(data.welcome_channel_id);


        let canvas = welcomeCanvas;
        canvas.context.font = '42px Dosis',
            canvas.context.textAlign = 'center';
        canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410)
        canvas.context.font = '32px Dosis'
        canvas.context.fillText(`You are the ${member.guild.memberCount}th`, 512, 455)
        canvas.context.beginPath()
        canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true)
        canvas.context.closePath()
        canvas.context.clip()


        await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png', size: 1024 }))
            .then(img => {
                canvas.context.drawImage(img, 393, 47, 238, 238);
            })
        let atta = new Discord.MessageAttachment(canvas.create.toBuffer(), `welcome-${member.id}.png`)
        try {
            welcomechannel.send({ content: `<a:pepesaber:875121214014758963> Hello ${member}, welcome to ${member.guild.name}!`, attachments: atta })
        } catch (error) {
            console.log(error)
        }
    }
}