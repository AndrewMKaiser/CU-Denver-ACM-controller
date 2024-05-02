var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config();

mongoose.Promise = global.Promise;

var ReplySchema = new Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
