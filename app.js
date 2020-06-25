const port = process.env.PORT || 5000;
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

var app = express();
app.use(cors({
    exposedHeaders: ['Location'],
}));
  
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.listen(port);

module.exports = app;
require('./loader.js');
