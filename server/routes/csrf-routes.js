'use strict';
var routes = require('express').Router();

function getCrsfToken(request, response) {
    console.log('GET: /token', request.path);
    response.setHeader('Content-Type', 'application/json');
    var token = request.csrfToken();
    response.locals._csrf = token;
    return response.status(200).json({csrfToken: token});
}

// routes.get('/', getCrsfToken);

module.exports = routes;