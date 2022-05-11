const mongoose = require("mongoose");

const reqSting = {
    type: String,
    required: true,
}

const WarnSchema = new mongoose.Schema(
    {
        userId: reqSting,
        guildId: reqSting,
        reason: reqSting,
        staffId: reqSting,
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("warnDataBase", WarnSchema);