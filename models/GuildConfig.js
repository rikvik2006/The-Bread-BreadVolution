const mongoose = require("mongoose");


const GuildConfigSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    prefix: {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: "!!"
    },
    defaultRole: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    mamberLogChannel: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },

    moderatorRoles: Array,
    helperRoles: Array,

})

module.exports = mongoose.model("GuildConfig", GuildConfigSchema);