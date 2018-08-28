'use strict';
var await = require('asyncawait/await');
var async = require('asyncawait/async');
var handlers = require(__base + 'server/routes/router-handlers');
var service = require(__base + 'server/services');
var routes = require('express').Router();

function facturar(request, response) {
    console.log('POST factura');
    // console.log('Debug POST factura',request.body);
    var result;
    try {
        result = await (service.facturadorService.facturar('api-stag',request.body.factura,request.body.cliente.id,'TE',request.body.facturabase.base));
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        console.log('error',error);
        return handlers.errorResponseHandler(response, error);
    }
}

routes.post('/', async(facturar));

module.exports = routes;