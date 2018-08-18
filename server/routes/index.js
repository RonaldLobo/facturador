/**
 * Routes entry point
 * @module routes/index.js
 */
'use strict';
var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var csrfMiddleware = require(__base + 'server/middleware/csrf-validator');
var apiRoutesInitializer = require('./api');
var csrfTokenRouter = require('./csrf-routes');
var cookieOptions = {
    cookie: {
        key:'CSRF-TOKEN',
        path:'/'
    }
};

// router.use('/', csrf(cookieOptions));
// router.use('/token', csrfTokenRouter);
// router.use('/api', csrfMiddleware);
apiRoutesInitializer(router, '/api');

module.exports = router;
