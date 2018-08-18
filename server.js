// ==================================================
// Initialize globals
// ==================================================
'use strict';
global.__base = __dirname + '/';

// ==================================================
// Load modules
// ==================================================
var express = require('express');
var app = express();
var server;
var enableDestroy = require('server-destroy');
var configuration = require(__base + 'server/configuration');
var mongoose = configuration.mongoose;
var routes = require(__base + '/server/routes');
var port = process.env.PORT || 8080;

configuration.express(app);
app.use('/', routes);

// graceful shutdowns on ctrl-c
process.on('SIGINT', destroyServer);

function destroyServer() {
    console.log('Received shutdown command on SIGINT');
    // enableDestroy(server); // enabling http process destroyer
    // server.destroy();
    // server.close(function () {
    //     console.log('exiting process... so long and thanks for all the fish');
        process.exit(0);
    // });
}

function startServer() {
    console.log('Starting the application on port ' + port + '...');
    server = app.listen(port, function () {
        console.log('---- application started on port ' + port + '----');
    });
}
// ==================================================
// Start the app
// ==================================================
startServer();



module.exports = app;
