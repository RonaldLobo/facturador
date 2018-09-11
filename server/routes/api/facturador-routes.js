'use strict';
var await = require('asyncawait/await');
var async = require('asyncawait/async');
var handlers = require(__base + 'server/routes/router-handlers');
var service = require(__base + 'server/services');
var routes = require('express').Router();

function facturar(request, response) {
    console.log('POST factura');
    console.log('Debug POST factura',request.query.con);
    var result;
    try {
        if(request.body.conrealizada){
            result = await (service.facturadorService.consultaFacturaRealizada(request.body.factura,request.body.cliente.id,request.body.facturabase.base));
        }
        var tipoFA = (request.body.factura.omitirReceptor == "false") ? 'FE': 'TE';
        if(request.body.con == true){
            result = await (service.facturadorService.generaProximoCons(request.body.factura,request.body.cliente.id,tipoFA));
        } else {
            result = await (service.facturadorService.facturar(request.body.factura,request.body.cliente.id,tipoFA,request.body.facturabase.base));
        
        }
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        console.log('error',error);
        return handlers.errorResponseHandler(response, error);
    }
}

function aprobar(request, response) {
    console.log('POST aprobar');
    console.log('Debug POST aprobar');
    var result;
    try {
        result = await (service.facturadorService.aprobar(request.body.cliente.id,request.body.datos));
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        console.log('error',error);
        return handlers.errorResponseHandler(response, error);
    }
}

routes.post('/', async(facturar));
routes.post('/aprobar/', async(aprobar));

module.exports = routes;