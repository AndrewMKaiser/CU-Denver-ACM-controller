var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config();

mongoose.set('useCreateIndex', true);

var BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Blog', BlogSchema);