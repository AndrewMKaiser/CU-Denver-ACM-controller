var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config();

mongoose.set('useCreateIndex', true);

var BlogSchema = new Schema({
    title: String,
    body: String,
    date: Date,
    author: String
});

module.exports = mongoose.model('Blog', BlogSchema);