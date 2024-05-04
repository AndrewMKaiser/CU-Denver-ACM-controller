var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config();

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

// Middleware to delete all replies associated with a blog post when the blog post is deleted
BlogSchema.pre('remove', async function() {
    try {
        // Await the completion of deleteMany operation
        await this.model('Reply').deleteMany({ blogId: this._id });
        next();
    } catch (err) {
        console.error("Error deleting associated replies:", err);
        // Rethrow the error to ensure the removal process stops if replies can't be deleted
        next(err);
    }
});


module.exports = mongoose.model('Blog', BlogSchema);