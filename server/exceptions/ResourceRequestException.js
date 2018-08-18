'use strict';
module.exports = function CustomError(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = 'ResourceRequestException';
    this.message = message || 'Problem when requesting resource';
    this.status = 500;
};

require('util').inherits(module.exports, Error);