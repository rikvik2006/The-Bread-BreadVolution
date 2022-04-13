const mongoose = require("mongoose");

const SetTimeZoneSchema = new mongoose.Schema({
    guild_id: String,
    timezone: String,
}); 

module.exports = mongoose.model("SetTimeZone", SetTimeZoneSchema);