var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    clienteId: { type: String, require: true },
    factura: mongoose.Schema.Types.Mixed
}, {
    versionKey: false
});

module.exports = mongoose.model('factura', schema);
