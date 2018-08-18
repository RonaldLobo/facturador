var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    nombre: { type: String, require: true },
    telefono: { type: String, require: true },
    correo: { type: String, require: true },
    cedula: { type: String, require: true},
    cert: { type: String, require: true},
    usuarioHacienda: { type: String, require: true},
    claveHacienda: { type: String, require: true},
    usuarioApi: { type: String, require: true},
    claveApi: { type: String, require: true},
    tipoCedula: { type: String, require: true},
    consecutivo: { type: Number, require: true},
    pinCert: { type: String, require: true}
},{ 
	versionKey: false 
});

module.exports = mongoose.model('cliente', schema);
