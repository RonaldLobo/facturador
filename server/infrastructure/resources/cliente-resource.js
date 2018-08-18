var async = require('asyncawait/async');
var await = require('asyncawait/await');
var clienteModel = require(__base + 'server/model/cliente');

function getClientes() {
    var clientes = await(clienteModel.find({}));
    return clientes;
}

function getClientesNombre(nombre) {
    var clientes = await(clienteModel.find({nombre:new RegExp(nombre, 'i')}));
    return clientes;
}

function getClientesCedula(cedula) {
    var clientes = await(clienteModel.find({cedula:new RegExp(cedula, 'i')}));
    return clientes;
}

function getCliente(id) {
    var cliente = await(clienteModel.findOne({_id:id}));
    return cliente;
}

function deleteCliente(id) {
    var cliente = await(clienteModel.remove({_id:id}));
    return cliente;
}

function updateCliente(clienteParam) {
    var cliente = await(clienteModel.update({_id:clienteParam._id},clienteParam));
    return cliente;
}

function addCliente(clienteParam) {
    var cliente = await(clienteModel.create(clienteParam));
    return cliente;
}

module.exports = {
    getClientes: async(getClientes),
    getClientesNombre: async(getClientesNombre),
    getClientesCedula: async(getClientesCedula),
    getCliente: async(getCliente),
    deleteCliente: async(deleteCliente),
    updateCliente: async(updateCliente),
    addCliente: async(addCliente)
};