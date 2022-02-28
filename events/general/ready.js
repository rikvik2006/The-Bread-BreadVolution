module.exports = {
    name: "ready",
    description: "Ready event",
    execute() {
        console.log(`🍞｜Bread is ONLINE whit ${client.guilds.cache.size} guilds and ${client.users.cache.size} users!`);

        client.user.setActivity(`${client.guilds.cache.size} servers | ${process.env.PREFIX}help`, { type: "WATCHING" });
    }
}