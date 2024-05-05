var express = require('express');
var router = express.Router();
var Blog = require('../models/Blog');
var Reply = require('../models/Reply');
const { isAuthenticated } = require('../auth_jwt');

// GET to fetch all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({}).populate('author', 'name');
        res.json({ success: true, blogs: blogs });
    } catch (err) {
        res.status(500).json({ success: false, message: 'An error occurred while retrieving blogs.', error: err });
    }
});

// GET to fetch a single blog post by ID w/ all replies
router.get('/:blogId', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId).populate('author', 'name');
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found.' });
        }
        const replies = await Reply.find({ blogId: blog._id }).populate('authorId', 'name');
        res.json({ success: true, blog: blog, replies: replies });
    } catch (err) {
        res.status(500).json({ success: false, message: 'An error occurred while retrieving blog.', error: err });
    }
});

// POST to add a new blog post
router.post('/', isAuthenticated, async (req, res) => {
    try {
        var newBlog = new Blog({
            title: req.body.title,
            body: req.body.body,
            author: req.user._id
        });
        const blog = await newBlog.save();
        res.json({ success: true, message: 'Blog posted.', blog: blog });
    } catch (err) {
        res.status(500).json({ success: false, message: 'An error occurred while posting the blog.', error: err });
    }
});

// PUT to update a blog post
router.put('/:blogId', isAuthenticated, async (req, res) => {
    try {
        const blog = await Blog.findOneAndUpdate({ _id: req.params.blogId, author: req.user._id }, req.body, { new: true });
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found or you are unauthorized to update this blog.' });
        }
        res.json({ success: true, message: 'Blog updated.', blog: blog });
    } catch (err) {
        res.status(500).json({ success: false, message: 'An error occurred while updating the blog.', error: err });
    }
});

// DELETE to delete a blog post
router.delete('/:blogId', isAuthenticated, async (req, res) => {
    try {
        var blogId = mongoose.Types.ObjectId(req.params.blogId);
        var userId = mongoose.Types.ObjectId(req.params.user._id);
        const blog = await Blog.findOne({ _id: blogId, author: userId });
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found or you are unauthorized to delete this blog.' });
        }
        await Blog.remove( { _id: blogId } );
        res.json({ success: true, message: 'Blog and all associated replies deleted.', blog: blog });
    } catch (err) {
        res.status(500).json({ success: false, message: 'An error occurred while deleting the blog.', error: err });
    }
});

// POST to add a reply to a blog post
router.post('/:blogId/replies', isAuthenticated, async (req, res) => {
    try {
        var newReply = new Reply({
            body: req.body.body,
            authorId: req.user._id,
            blogId: req.params.blogId
        });
        const reply = await newReply.save();
        res.json({ success: true, message: 'Reply posted.', reply: reply });
    } catch (err) {
        res.status(500).json({ success: false, message: 'An error occurred while posting the reply.', error: err });
    }
});

// PUT to update a reply to a blog post
router.put('/:blogId/replies/:replyId', isAuthenticated, async (req, res) => {
    try {
        const reply = await Reply.findOneAndUpdate({ _id: req.params.replyId, authorId: req.user._id }, req.body, { new: true });
        if (!reply) {
            return res.status(404).json({ success: false, message: 'Reply not found or you are unauthorized to update this reply.' });
        }
        res.json({ success: true, message: 'Reply updated.', reply: reply });
    } catch (err) {
        res.status(500).json({ success: false, message: 'An error occurred while updating the reply.', error: err });
    }
});

// DELETE to delete a reply to a blog post
router.delete('/:blogId/replies/:replyId', isAuthenticated, async (req, res) => {
    try {
        var replyId = mongoose.Types.ObjectId(req.params.replyId);
        var userId = mongoose.Types.ObjectId(req.params.user._id);
        const reply = await Reply.findOneAndRemove({ _id: replyId, authorId: userId });
        if (!reply) {
            return res.status(404).json({ success: false, message: 'Reply not found or you are unauthorized to delete this reply.' });
        }
        res.json({ success: true, message: 'Reply deleted.', reply: reply });
    } catch (err) {
        res.status(500).json({ success: false, message: 'An error occurred while deleting the reply.', error: err });
    }
});

module.exports = router;