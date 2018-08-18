'use strict';
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');


function configure(app) {
    app.use(bodyParser.json());
    app.set('view engine', 'html');
    console.log('loading content routes using static path to dist directory');
    app.use(express.static(__base + '/dist'));
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          
        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
          res.send(200);
        }
        else {
          next();
        }
    });

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());

    app.use(function(req, res, next) {
        res.locals.ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        next();
    });

    // app.use(
    //   expressJWT({
    //     secret: 'secret',
    //     getToken: function fromHeaderOrQueryString (req) {
    //         if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    //             return req.headers.authorization.split(' ')[1];
    //         else if (req.query && req.query.token)
    //             return req.query.token;

    //         return null;
    //     }
    //   }).unless({ path: ['/api/login'] })
    // );
}
module.exports = configure;