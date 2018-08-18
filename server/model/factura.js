var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    clienteId: { type: String, require: true },
    fecha: { type: String, require: true },
    ubicacion: { type: String, require: true }
}, {
    versionKey: false
});

module.exports = mongoose.model('factura', schema);
