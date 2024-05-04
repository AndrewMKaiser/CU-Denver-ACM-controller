var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config();

var BlogSchema = new Schema({
    title: {
        type: String,
        required: true
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

// Middleware to delete all replies associated with a blog post when the blog post is deleted
BlogSchema.pre('remove', function(next) {
    this.model('Reply').deleteMany({ blogId: this._id }, next);
});

module.exports = mongoose.model('Blog', BlogSchema);