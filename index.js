// TODO: Add content-type checks, rate limiting, logging and monitoring, implement RS256 for JWT auth
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const jwt = require('jsonwebtoken');
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

var router = express.Router();
app.use('/', router);
app.use('/blogs', blogRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);

app.listen(process.env.PORT || 3000);
module.exports = app; // for testing