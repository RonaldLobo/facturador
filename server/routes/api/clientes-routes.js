'use strict';
var await = require('asyncawait/await');
var async = require('asyncawait/async');
var handlers = require(__base + 'server/routes/router-handlers');
var service = require(__base + 'server/services');
var routes = require('express').Router();


function getClientes(request, response) {
    console.log('GET Cliente');
    console.log('GET nombre',request.query.nombre);
    console.log('GET codigo',request.query.cedula);
    var result;
    try {
        if(request.query.cedula){
            result = await (service.clientesService.getClienteCedula(request.query.cedula));
        } else if (request.query.nombre){
            result = await (service.clientesService.getClienteNombre(request.query.nombre));
        } else {
            result = await (service.clientesService.getCliente(request.params.id));
        }
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        console.log('error',error);
        return handlers.errorResponseHandler(response, error);
    }
}

function deleteCliente(request, response) {
    console.log('DELETE Cliente');
    var result;
    try {
        result = await (service.clientesService.deleteCliente(request.params.id));
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        return handlers.errorResponseHandler(response, error);
    }
}

function updateCliente(request, response) {
    console.log('UPDATE Cliente');
    var result;
    try {
        result = await (service.clientesService.updateCliente(request.body.cliente));
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        return handlers.errorResponseHandler(response, error);
    }
}

function postCliente(request, response) {
    console.log('POST Cliente',request.body);
    var result;
    try {
        result = await (service.clientesService.postCliente(request.body.cliente));
        return handlers.successResponseHandler(response, result);
    } catch (error) {
        if(error.code === 11000){
            return handlers.validationErrorHandler(response, error);
        }
        return handlers.errorResponseHandler(response, error);
    }
}

routes.get('/:id', async(getClientes));
routes.get('/', async(getClientes));
routes.delete('/:id', async(deleteCliente));
routes.put('/:id', async(updateCliente));
routes.post('/', async(postCliente));

module.exports = routes;