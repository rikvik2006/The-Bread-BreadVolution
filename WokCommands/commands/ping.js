module.exports = {
    category: "Testing",
    description: "Ping the bot",

    slash: "both",
    testOnly: true,


    callback: ({}) => {
        return "Pong!"
    },
}