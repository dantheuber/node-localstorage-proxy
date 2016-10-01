'use strict';

var express = require('express');
var app = express();

module.exports = initializeApp();

function initializeApp() {
    // sole purpose of express is to serve this single static file
    app.use(express.static('public'));
    // return method to start the server
    return {
        startServer: startServer
    };
}

function startServer() {
    app.listen(3000);
}