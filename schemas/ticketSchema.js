const { Schema, model } = require("mongoose");

const ticket = new Schema({
    guildId: {
        type: String
    },

    userId: {
        type: String
    },

    channelId: {
        type: String
    },

    isClose: {
        type: Boolean,
        default: false
    }
});

module.exports = model("ticketSchema", ticket)