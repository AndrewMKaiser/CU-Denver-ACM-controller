var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
require('dotenv').config();

mongoose.Promise = global.Promise;
console.log(process.env.DB);
mongoose.connect(process.env.DB, { useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

// User schema
var BlogSchema = new Schema({
    title: String,
    body: String,
    date: Date,
    author: String
});

// Return the model of our server
module.exports = mongoose.model('Blog', BlogSchema);