const Topgg = require("@top-gg/sdk")
const api = new Topgg.Api(process.env.TOPGG_TOKEN)

module.exports = {
    name: "ready",

    async execute() {
        console.log("Posted");
    }
}