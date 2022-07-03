const Topgg = require("@top-gg/sdk");
const { createSpinner } = require("nanospinner");
const topgg_token = process.env.TOPGG_TOKEN || null;
const { AutoPoster } = require("topgg-autoposter")

module.exports = {
    name: "ready",

    async execute(client) {

        const spinner = createSpinner("Posting stats to Top.gg").start()
        if (topgg_token === null) {
            return spinner.error({ text: "Nothing posted to Top.gg" })
        } else {
            const ap = AutoPoster.apply(topgg_token, client)

            ap.on("posted", () => {
                spinner.success({ text: "Posted stats to Top.gg" })
            })
        }
    }
}