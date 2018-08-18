'use strict';
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var FacturasRsrc = require(__base + 'server/infrastructure/resources').factura;

function getFactura(id) {
    var result;
    console.log('get factura by ' + id);
    try {
    	if(id){
        	result = await (FacturasRsrc.getFactura(id));
        } else {
        	result = await (FacturasRsrc.getFacturas());
        }   
    } catch(error) {
        throw error;
    }
    return { factura: result };
}

function updateFactura(factura) {
    var result;
    console.log('update factura by ' + factura._id);
    try {
        result = await (FacturasRsrc.updateFactura(factura));
    } catch(error) {
        throw error;
    }
    return { factura: result };
}

function deleteFactura(id) {
    var result;
    console.log('delete factura by ' + id);
    try {
        result = await (FacturasRsrc.deleteFactura(id));
    } catch(error) {
        throw error;
    }
    return { factura: result };
}

function postFactura(factura) {
    var result;
    console.log('post factura');
    try {
        result = await (FacturasRsrc.addFactura(factura));
    } catch(error) {
        throw error;
    }
    return { factura: result };
}

module.exports.getFactura = async(getFactura);
module.exports.updateFactura = async(updateFactura);
module.exports.deleteFactura = async(deleteFactura);
module.exports.postFactura = async(postFactura);