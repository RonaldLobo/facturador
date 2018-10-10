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
        } else {
            var tipoFA = (request.body.factura.omitirReceptor == "false") ? 'FE': 'TE';
            if(request.body.con == true){
                result = await (service.facturadorService.generaProximoCons(request.body.factura,request.body.cliente.id,tipoFA));
            } else {
                result = await (service.facturadorService.facturar(request.body.factura,request.body.cliente.id,tipoFA,request.body.facturabase.base));
            }
        }
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        console.log('error',error);
        return handlers.errorResponseHandler(response, error);
    }
}

function notadebito(request, response) {
    console.log('POST notadebito');
    console.log('Debug POST notadebito',request.query.con);
    var result;
    try {
        if(request.body.conrealizada){
            result = await (service.facturadorService.consultaFacturaRealizada(request.body.factura,request.body.cliente.id,request.body.facturabase.base));
        } else {
            // var tipoFA = (request.body.factura.omitirReceptor == "false") ? 'FE': 'TE';
            if(request.body.con == true){
                result = await (service.facturadorService.generaProximoCons(request.body.factura,request.body.cliente.id,'ND'));
            } else {
                result = await (service.facturadorService.generarND(request.body.factura,request.body.cliente.id,'ND',request.body.facturabase.base));
            }
        }
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        console.log('error',error);
        return handlers.errorResponseHandler(response, error);
    }
}

function notacredito(request, response) {
    console.log('POST notacredito');
    console.log('Debug POST notacredito',request.query.con);
    var result;
    try {
        if(request.body.conrealizada){
            result = await (service.facturadorService.consultaFacturaRealizada(request.body.factura,request.body.cliente.id,request.body.facturabase.base));
        } else {
            // var tipoFA = (request.body.factura.omitirReceptor == "false") ? 'FE': 'TE';
            if(request.body.con == true){
                result = await (service.facturadorService.generaProximoCons(request.body.factura,request.body.cliente.id,'NC'));
            } else {
                result = await (service.facturadorService.generarNC(request.body.factura,request.body.cliente.id,'NC',request.body.facturabase.base));
            }
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
        if (request.body.datos.revisar && request.body.datos.revisar == true) {
            result = await (service.facturadorService.revisar(request.body.cliente.id,request.body.datos));
        } else {
            result = await (service.facturadorService.aprobar(request.body.cliente.id,request.body.datos));
        }
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        console.log('error',error);
        return handlers.errorResponseHandler(response, error);
    }
}

function consultar(request, response) {
    console.log('POST aprobar');
    console.log('Debug POST aprobar');
    var result;
    try {
        result = await (service.facturadorService.consultar(request.body.cliente.id,request.body.factura.clave));
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        console.log('error',error);
        return handlers.errorResponseHandler(response, error);
    }
}

routes.post('/', async(facturar));
routes.post('/aprobar/', async(aprobar));
routes.post('/notacredito/', async(notacredito));
routes.post('/notadebito/', async(notadebito));
routes.post('/consultar/', async(consultar));

module.exports = routes;