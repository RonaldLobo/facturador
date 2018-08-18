'use strict';
var await = require('asyncawait/await');
var async = require('asyncawait/async');
var handlers = require(__base + 'server/routes/router-handlers');
var service = require(__base + 'server/services');
var routes = require('express').Router();


function getFacturas(request, response) {
    console.log('GET factura',request.params.id);
    var result;
    try {
        result = await (service.facturasService.getFactura(request.params.id));
        return handlers.successResponseHandler(response, result);
    } catch (error) {
    	console.log('error',error);
        return handlers.errorResponseHandler(response, error);
    }
}

function deleteFacturas(request, response) {
    console.log('DELETE factura');
    var result;
    try {
        result = await (service.facturasService.deleteFactura(request.params.id));
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        return handlers.errorResponseHandler(response, error);
    }
}

function updateFacturas(request, response) {
    console.log('UPDATE factura');
    var result;
    try {
        result = await (service.facturasService.updateFactura(request.body.factura));
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        return handlers.errorResponseHandler(response, error);
    }
}

function postFacturas(request, response) {
    console.log('POST factura');
    var result;
    try {
        result = await (service.facturasService.postFactura(request.body.factura));
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        if(error.code === 11000){
            return handlers.validationErrorHandler(response, error);
        }
        return handlers.errorResponseHandler(response, error);
    }
}

routes.get('/:id', async(getFacturas));
routes.get('/', async(getFacturas));
routes.delete('/:id', async(deleteFacturas));
routes.put('/:id', async(updateFacturas));
routes.post('/', async(postFacturas));

module.exports = routes;