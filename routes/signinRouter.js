// Purpose: Handle requests for signing in a new user
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please enter both your email and password to sign in.' });
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
        }

        const userToken = { id: user._id, email: user.email };
        const token = jwt.sign(userToken, process.env.SECRET_KEY, { expiresIn: '1h' }); // User will need to relog after 1 hour. Prevents token hijacking.
        res.json({ success: true, token: 'Bearer ' + token, message: 'Successfully signed in.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred during sign in.' });
    }
});

router.all('/', function(req, res) {
    res.status(405).json({ success: false, message: 'The requested method is not allowed.' });
});

module.exports = router;