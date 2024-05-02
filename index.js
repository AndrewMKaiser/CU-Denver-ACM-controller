var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

var app = express();
var router = express.Router();

