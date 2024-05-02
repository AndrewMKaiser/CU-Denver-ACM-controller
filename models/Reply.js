var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config();

var ReplySchema = new Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Reply', ReplySchema);
