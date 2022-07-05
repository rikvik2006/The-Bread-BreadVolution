const mongoose = require("mongoose");

const ReactionRolesSchema = new mongoose.Schema({
    menuReactionId: {
        type: String,
        required: true,
        unique: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    roleId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        default: null,
    },
    emoji: {
        type: String,
        required: true,
    },

})

module.exports = mongoose.model("ReactionRole", ReactionRolesSchema);