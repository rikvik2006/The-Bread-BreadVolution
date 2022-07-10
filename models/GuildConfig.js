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

    moderatorRoles: {
        type: Array,
        required: true,
        default: [],
    },
    helperRoles: Array,

    punishmentBan: {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: "8" //number of warn for trigger the ban punishment
    },

    punishmentKick: {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: "6", //number of warn for trigger the kick punishment
    },

    punishmentMute: {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: "4" //number of warn for trigger the mute punishment
    },

    punishmentTempmute: {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: "3", //number of warn for trigger the tempmute punishment
    },

    autoTempmuteTime: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 1800000 //time in ms for the tempmute (30 minutes)
    },

    badWordsChannelAdd: {
        type: Array,
        required: true,
        default: [],
    },

    toxicsDetectorChannel: {
        type: Array,
        required: true,
        default: [],
    },

    antiSpamTimeOut: { //time out seconds
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 1800000,  //30 minutes
    },

    toxicPercentage: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 90,
    },

    //logs

    modLogChannel: {
        type: String,
    },

    serverLogChannel: {
        type: String,
    }



})

module.exports = mongoose.model("GuildConfig", GuildConfigSchema);