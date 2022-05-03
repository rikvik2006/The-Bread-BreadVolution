const mongoose = require("mongoose");

const antispamModelSchema =  new mongoose.Schema({
    Guild: String,
    Channels: Array
})

module.exports = mongoose.model("antiSpamSchema", antispamModelSchema);