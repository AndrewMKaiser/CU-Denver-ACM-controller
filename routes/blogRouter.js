var express = require('express');
var router = express.Router();
var Blog = require('../models/Blog');
var Reply = require('../models/Reply');
var passport = require('passport');
const { isAuthenticated } = require('../auth_jwt');

// GET to fetch all blogs
router.get('/', function(req, res) {
    Blog.find({})
        .populate('author', 'name') // author field will be populated with the name field from the User model
        .exec(function(err, blogs) {
            if (err) {
                return res.status(500).json({ success: false, message: 'An error occurred while retrieving blogs.' });
            }
            res.json({ success: true, blogs: blogs });
        });
});

// GET to fetch a single blog post by ID w/ all replies
router.get('/:blogId', function(req, res) {
    Blog.findById(req.params.blogId)
        .populate('author', 'name') // author field will be populated with the name field from the User model
        .exec(function(err, blog) {
            if (err) {
                return res.status(500).json({ success: false, message: 'An error occurred while retrieving blog.' });
            }
            if (!blog) {
                return res.status(404).json({ success: false, message: 'Blog not found.' });
            }

            // Fetch replies for this blog
            Reply.find({ blogId: blog._id })
                .populate('authorId', 'name')
                .exec(function(err, replies) {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'An error occurred while retrieving replies.' });
                    }
                    res.json({ success: true, blog: blog, replies: replies });
                });
        });
});

// POST to add a new blog post
router.post('/', isAuthenticated, function(req, res) {
    var newBlog = new Blog({
        title: req.body.title,
        body: req.body.body,
        author: req.user._id
    });

    newBlog.save(function(err, blog) {
        if (err) {
            return res.status(500).json({ success: false, message: 'An error occurred while posting the blog.', error: err });
        }
        res.json({ success: true, message: 'Blog posted.', blog: blog });
    });
});

// PUT to update a blog post
router.put('/:blogId', isAuthenticated, function(req, res) {
    Blog.findOneAndUpdate({ _id: req.params.blogId, author: req.user._id }, req.body, { new: true }, function(err, blog) {
        if (err) {
            return res.status(500).json({ success: false, message: 'An error occurred while updating the blog.', error: err });
        }
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found or you are unauthorized to update this blog.' });
        }
        res.json({ success: true, message: 'Blog updated.', blog: blog });
    });
});

// DELETE to delete a blog post
router.delete('/:blogId', isAuthenticated, function(req, res) {
    Blog.findOne({ _id: req.params.blogId, author: req.user._id }, function(err, blog) {
        if (err) {
            return res.status(500).json({ success: false, message: 'An error occurred while deleting the blog.', error: err });
        }
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found or you are unauthorized to delete this blog.' });
        }
        blog.remove(function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'An error occurred while deleting the blog.', error: err });
            }
            res.json({ success: true, message: 'Blog and all associated deleted.', blog: blog });
        });
    });
});

// POST to add a reply to a blog post
router.post('/:blogId/replies', isAuthenticated, function(req, res) {
    var newReply = new Reply({
        body: req.body.body,
        authorId: req.user._id,
        blogId: req.params.blogId
    });

    newReply.save(function(err, reply) {
        if (err) {
            return res.status(500).json({ success: false, message: 'An error occurred while posting the reply.', error: err});
        }
        res.json({ success: true, message: 'Reply posted.', reply: reply });
    });
});

// PUT to update a reply to a blog post
router.put('/:blogId/replies/:replyId', isAuthenticated, function(req, res) {
    Reply.findOneAndUpdate({ _id: req.params.replyId, authorId: req.user._id }, req.body, { new: true }, function(err, reply) {
        if (err) {
            return res.status(500).json({ success: false, message: 'An error occurred while updating the reply.', error: err });
        }
        if (!reply) {
            return res.status(404).json({ success: false, message: 'Reply not found or you are unauthorized to update this reply.' });
        }
        res.json({ success: true, message: 'Reply updated.', reply: reply });
    });
});

// DELETE to delete a reply to a blog post
router.delete('/:blogId/replies/:replyId', isAuthenticated, function(req, res) {
    Reply.findOneAndRemove({ _id: req.params.replyId, authorId: req.user._id }, function(err, reply) {
        if (err) {
            return res.status(500).json({ success: false, message: 'An error occurred while deleting the reply.', error: err });
        }
        if (!reply) {
            return res.status(404).json({ success: false, message: 'Reply not found or you are unauthorized to delete this reply.' });
        }
        res.json({ success: true, message: 'Reply deleted.', reply: reply });
    });
});

module.exports = router;