var async = require('asyncawait/async');
var await = require('asyncawait/await');
var facturaModel = require(__base + 'server/model/factura');

function getFacturas() {
    var facturas = await(facturaModel.find({}));
    return facturas;
}

function getFactura(id) {
    var factura = await(facturaModel.findOne({_id:id}));
    return factura;
}

function deleteFactura(id) {
    var factura = await(facturaModel.remove({_id:id}));
    return factura;
}

function updateFactura(facturaParam) {
    var factura = await(facturaModel.update({_id:facturaParam._id},facturaParam));
    return factura;
}

function addFactura(facturaParam) {
    var factura = await(facturaModel.create(facturaParam));
    return factura;
}

module.exports = {
    getFacturas: async(getFacturas),
    getFactura: async(getFactura),
    deleteFactura: async(deleteFactura),
    updateFactura: async(updateFactura),
    addFactura: async(addFactura)
};