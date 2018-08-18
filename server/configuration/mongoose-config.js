var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/facturador', {
    connectTimeoutMS: 5000
});
var db = mongoose.connection;

db.on('error',function (error) {
    console.log('CONNECTION ERROR:',error);
});
//Output - 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting 
db.once('open',function () {
    console.log('Connected to mongodb');
});

module.exports = db;
