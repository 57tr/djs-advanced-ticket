const { Schema, model } = require('mongoose');

const setup = new Schema({
    guildId: {
        type: String
    },

    channelId: {
        type: String
    },

    categoryId: {
        type: String
    },

    messageId: {
        type: String
    },

    embedDescription: {
        type: String
    }
});

module.exports = model('setupSchema', setup);