const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
    guild_id: {
        type: String,
        unique: true,
        required: true,
    },
    welcome_channel_id: {
        type: String,
        required: true,
        default: null
    },

});

module.exports = mongoose.model("GuildSettings", GuildSettingsSchema);