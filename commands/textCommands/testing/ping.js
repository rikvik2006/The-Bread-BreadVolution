module.exports = {
    name: "ping",
    description: "Ping",
    async execute(message) {

        const rackets = ["🪑", "💺", "🏓", "🗑️", "🍝", "🍞", "🥖", "🥪", "🥯", "🐕", "🎮"]
        await message.reply ({
            content: "Pong! " + rackets[Math.floor(Math.random() * rackets.length)],
            ephemeral: true
        })
    }
}