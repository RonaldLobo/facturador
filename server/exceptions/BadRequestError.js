'use strict';
module.exports = function CustomError(message, request) {
    Error.captureStackTrace(this, this.constructor);
    this.name = 'BadRequestError';
    this.message = message || 'Bad request error';
    this.status = 400;
    if (request) {
        this.request = request;
    }
};

require('util').inherits(module.exports, Error);