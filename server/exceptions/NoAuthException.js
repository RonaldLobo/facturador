'use strict';
module.exports = function CustomError(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = 'NoAuthException';
    this.message = message || 'You don\'t have access to this application';
    this.status = extra.status || 403;
};

require('util').inherits(module.exports, Error);