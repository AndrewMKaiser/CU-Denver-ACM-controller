// Purpose: To handle signups for new users
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    if (!req.body.name || !req.body.password || !req.body.email) {
        res.status(400).json({ success: false, message: 'Please enter a name, email, and password to sign up.' });
    } 
    try {
        var newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        // Hashing moved here to explicitly handle the async nature of bcrypt
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        
        await newUser.save();
        res.json({ success: true, message: 'Successfully created new user.' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'A user with that email already exists.' });
        } else {
            return res.status(500).json({ success: false, message: 'An error occurred during signup: ' + err.message });
        }
    }
});

router.all('/', function(req, res) {
    res.status(405).json({ success: false, message: 'The requested method is not allowed.' });
});

module.exports = router;