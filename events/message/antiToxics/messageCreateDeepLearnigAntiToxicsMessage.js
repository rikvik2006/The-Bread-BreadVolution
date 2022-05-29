const Discord = require("discord.js");
const { google } = require("googleapis");
const GuildConfig = require("../../../models/GuildConfig");
const { v4: uuidv4 } = require('uuid');
const WarnSchema = require("../../../models/WarnSchema");
const { readFileSync, promises: fsPromises } = require('fs');

module.exports = {
    name: "messageCreate",

    async execute(message) {

        var badWords = ["cazzo", "merda", "coglione", "2g1c", "2 girls 1 cup", "acrotomophilia", "alabama hot pocket", "alaskan pipeline", "anal", "anilingus", "anus", "apeshit", "arsehole", "ass", "asshole", "assmunch", "auto erotic", "autoerotic", "babeland", "baby batter", "baby juice", "ball gag", "ball gravy", "ball kicking", "ball licking", "ball sack", "ball sucking", "bangbros", "bangbus", "bareback", "barely legal", "barenaked", "bastard", "bastardo", "bastinado", "bbw", "bdsm", "beaner", "beaners", "beaver cleaver", "beaver lips", "beastiality", "bestiality", "big black", "big breasts", "big knockers", "big tits", "bimbos", "birdlock", "bitch", "bitches", "black cock", "blonde action", "blonde on blonde action", "blowjob", "blow job", "blow your load", "blue waffle", "blumpkin", "bollocks", "bondage", "boner", "boob", "boobs", "booty call", "brown showers", "brunette action", "bukkake", "bulldyke", "bullet vibe", "bullshit", "bung hole", "bunghole", "busty", "butt", "buttcheeks", "butthole", "camel toe", "camgirl", "camslut", "camwhore", "carpet muncher", "carpetmuncher", "chocolate rosebuds", "cialis", "circlejerk", "cleveland steamer", "clit", "clitoris", "clover clamps", "clusterfuck", "cock", "cocks", "coprolagnia", "coprophilia", "cornhole", "coon", "coons", "creampie", "cum", "cumming", "cumshot", "cumshots", "cunnilingus", "cunt", "darkie", "date rape", "daterape", "deep throat", "deepthroat", "dendrophilia", "dick", "dildo", "dingleberry", "dingleberries", "dirty pillows", "dirty sanchez", "doggie style", "doggiestyle", "doggy style", "doggystyle", "dog style", "dolcett", "domination", "dominatrix", "dommes", "donkey punch", "double dong", "double penetration", "dp action", "dry hump", "dvda", "eat my ass", "ecchi", "ejaculation", "erotic", "erotism", "escort", "eunuch", "fag", "faggot", "fecal", "felch", "fellatio", "feltch", "female squirting", "femdom", "figging", "fingerbang", "fingering", "fisting", "foot fetish", "footjob", "frotting", "fuck", "fuck buttons", "fuckin", "fucking", "fucktards", "fudge packer", "fudgepacker", "futanari", "gangbang", "gang bang", "gay sex", "genitals", "giant cock", "girl on", "girl on top", "girls gone wild", "goatcx", "goatse", "god damn", "gokkun", "golden shower", "goodpoop", "goo girl", "goregasm", "grope", "group sex", "g-spot", "guro", "hand job", "handjob", "hard core", "hardcore", "hentai", "homoerotic", "honkey", "hooker", "horny", "hot carl", "hot chick", "how to kill", "how to murder", "huge fat", "humping", "incest", "intercourse", "jack off", "jail bait", "jailbait", "jelly donut", "jerk off", "jigaboo", "jiggaboo", "jiggerboo", "jizz", "juggs", "kike", "kinbaku", "kinkster", "kinky", "knobbing", "leather restraint", "leather straight jacket", "lemon party", "livesex", "lolita", "lovemaking", "make me come", "male squirting", "masturbate", "masturbating", "masturbation", "menage a trois", "milf", "missionary position", "mong", "motherfucker", "mound of venus", "mr hands", "muff diver", "muffdiving", "nambla", "nawashi", "negro", "neonazi", "nigga", "nigger", "nig nog", "nimphomania", "nipple", "nipples", "nsfw", "nsfw images", "nude", "nudity", "nutten", "nympho", "nymphomania", "octopussy", "omorashi", "one cup two girls", "one guy one jar", "orgasm", "orgy", "paedophile", "paki", "panties", "panty", "pedobear", "pedophile", "pegging", "penis", "phone sex", "piece of shit", "pikey", "pissing", "piss pig", "pisspig", "playboy", "pleasure chest", "pole smoker", "ponyplay", "poof", "poon", "poontang", "punany", "poop chute", "poopchute", "porn", "porno", "pornography", "prince albert piercing", "pthc", "pubes", "pussy", "queaf", "queef", "quim", "raghead", "raging boner", "rape", "raping", "rapist", "rectum", "reverse cowgirl", "rimjob", "rimming", "rosy palm", "rosy palm and her 5 sisters", "rusty trombone", "sadism", "santorum", "scat", "schlong", "scissoring", "semen", "sex", "sexcam", "sexo", "sexy", "sexual", "sexually", "sexuality", "shaved beaver", "shaved pussy", "shemale", "shibari", "shit", "shitblimp", "shitty", "shota", "shrimping", "skeet", "slanteye", "slut", "s&m", "smut", "snatch", "snowballing", "sodomize", "sodomy", "spastic", "spic", "splooge", "splooge moose", "spooge", "spread legs", "spunk", "strap on", "strapon", "strappado", "strip club", "style doggy", "suck", "sucks", "suicide girls", "sultry women", "swastika", "swinger", "tainted love", "taste my", "tea bagging", "threesome", "throating", "thumbzilla", "tied up", "tight white", "tit", "tits", "titties", "titty", "tongue in a", "topless", "tosser", "towelhead", "tranny", "tribadism", "tub girl", "tubgirl", "tushy", "twat", "twink", "twinkie", "two girls one cup", "undressing", "upskirt", "urethra play", "urophilia", "vagina", "venus mound", "viagra", "vibrator", "violet wand", "vorarephilia", "voyeur", "voyeurweb", "voyuer", "vulva", "wank", "wetback", "wet dream", "white power", "whore", "worldsex", "wrapping men", "wrinkled starfish", "xx", "xxx", "yaoi", "yellow showers", "yiffy", "zoophilia", "🖕"]

        let badwords_detected = false

        badWords.forEach(word => {
            if (message.content.includes(word)) 
            badwords_detected = true
        }) 

        if (badwords_detected) return

        let data

        try {
            data = await GuildConfig.findOne({ guildId: message.guild.id });

            if (!data) {
                data = await GuildConfig.create({ guildId: message.guild.id })
            }

        } catch (err) {
            console.log(err)
        }
        // if (data.moderatorRoles.includes(message.member.roles.cache.first().id)) return 


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


                        const toxic_percentage = data.toxicPercentage

                        // console.log(toxic_percentage)


                        if (toxicity >= toxic_percentage) {
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