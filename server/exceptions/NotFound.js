'use strict';
module.exports = function CustomError(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = 'NotFound';
    this.message = message || 'Element not found, invalid identifier';
    this.status = 404;
};

require('util').inherits(module.exports, Error);