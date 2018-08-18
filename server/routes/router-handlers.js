'use strict';
var constants = require(__base + 'server/routes/constants');
function errorResponseHandler(response, error) {
    error.status = error.status || constants.codes.SERVER_FAILURE;
    return response
        .status(error.status)
        .json(error);
}

function successResponseHandler(response, result) {
    return response
        .status(constants.codes.SUCCESS)
        .json(result);
}

function validationErrorHandler(response, validationResult) {
    return response
        .status(constants.codes.BAD_REQUEST)
        .json(validationResult);
}

function validationHandlerCallback(response) {
    var handler = function(validationResult, callback) {
        if (validationResult !== true) {
            return response
                .status(constants.codes.BAD_REQUEST)
                .json({ message: validationResult});
        } else {
            callback();
        }
    };
    return handler;
}

module.exports = {
    errorResponseHandler,
    successResponseHandler,
    validationErrorHandler,
    validationHandlerCallback
};