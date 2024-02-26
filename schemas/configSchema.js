const { Schema, model } = require("mongoose");

const config = new Schema({
    guildId: {
        type: String
    },

    channelTranscript: {
        type: String
    },

    channelLog: {
        type: String
    },

    supportRoleId: {
        type: String
    }
});

module.exports = model("configSchema", config)