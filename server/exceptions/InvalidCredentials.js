'use strict';
module.exports = function CustomError(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Authentication failed. Invalid credentials';
    this.status = 401;
};

require('util').inherits(module.exports, Error);