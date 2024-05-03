// TODO: Add content-type checks, rate limiting, logging and monitoring, implement RS256 for JWT auth
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const rateLimit = require("express-rate-limit");
const blogRouter = require('./routes/blogRouter');
const signupRouter = require('./routes/signupRouter');
const signinRouter = require('./routes/signinRouter');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

var router = express.Router();

// // Middleware to check for content-type
// app.use((req, res, next) => {
//     if (req.headers['content-type'] !== 'application/json') {
//         res.status(415).send('Server only accepts application/json data.');
//     } else {
//         next();
//     }
// });

// // Middleware to check for rate limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

var router = express.Router();
app.use('/', router);
app.use('/blogs', blogRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);

app.listen(process.env.PORT || 3000);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error occurred in application.');
});

module.exports = app; // for testing