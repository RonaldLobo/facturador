var async = require('asyncawait/async');
var await = require('asyncawait/await');
var apiUrl = require(__base + 'server/configuration').api;
var FormData = require('form-data');
var fetch = require('node-fetch');

function nuevoUsuario() {
}

function iniciarSesion(userName, pwd) {
    const form = new FormData();
    form.append('w', 'users');
    form.append('r', 'users_log_me_in');
    form.append('userName', userName);
    form.append('pwd', pwd);
    var rawRes = await(fetch(apiUrl, { method: 'POST', body: form }));
    var res = await(rawRes.json());
    return res;
}

function certificadoUP(sessionKey,userName,fileName) {
    const form = new FormData();
    form.append('w', 'fileUploader');
    form.append('r', 'subir_certif');
    form.append('sessionKey', sessionKey);
    form.append('iam', userName);
    form.append('fileToUpload', fs.createReadStream(__base + 'certs/'+fileName+'.p12'));
    var rawRes = await(fetch(apiUrl, { method: 'POST', body: form }));
    var res = await(rawRes.json());
    return res;
}

function generaClave(tipoDocumento,tipoCedula,cedula,codigoPais,consecutivo,situacion,codigoSeguridad) {
    const form = new FormData();
    form.append('w', 'clave');
    form.append('r', 'clave');
    form.append('tipoDocumento', tipoDocumento);
    form.append('tipoCedula', tipoCedula);
    form.append('cedula', cedula);
    form.append('codigoPais', codigoPais);
    form.append('consecutivo', consecutivo);
    form.append('situacion', situacion);
    form.append('codigoSeguridad', codigoSeguridad);
    var rawRes = await(fetch(apiUrl, { method: 'POST', body: form }));
    var res = await(rawRes.json());
    return res;
}

function generaTE(
        clave,
        consecutivo,
        fecha_emision,
        emisor_nombre,
        emisor_tipo_indetif,
        emisor_num_identif,
        nombre_comercial,
        emisor_provincia,
        emisor_canton,
        emisor_distrito,
        emisor_barrio,
        emisor_otras_senas,
        emisor_cod_pais_tel,
        emisor_tel,
        emisor_cod_pais_fax,
        emisor_fax,
        emisor_email,
        receptor_nombre,
        receptor_tipo_identif,
        receptor_num_identif,
        receptor_provincia,
        receptor_canton,
        receptor_distrito,
        receptor_barrio,
        receptor_otras_senas,
        receptor_cod_pais_tel,
        receptor_tel,
        receptor_cod_pais_fax,
        receptor_fax,
        receptor_email,
        condicion_venta,
        plazo_credito,
        medio_pago,
        cod_moneda,
        tipo_cambio,
        total_serv_gravados,
        total_serv_exentos,
        total_merc_gravada,
        total_merc_exenta,
        total_gravados,
        total_exentos,
        total_ventas,
        total_descuentos,
        total_ventas_neta,
        total_impuestos,
        total_comprobante,
        otros,
        detalles,
        omitir_receptor
        ) {
    const form = new FormData();
    form.append('w', 'genXML');
    form.append('r', 'gen_xml_te');
    form.append('clave', clave);
    form.append('consecutivo', consecutivo);
    form.append('fecha_emision', fecha_emision);
    form.append('emisor_nombre', emisor_nombre);
    form.append('emisor_tipo_indetif', emisor_tipo_indetif);
    form.append('emisor_num_identif', emisor_num_identif);
    form.append('nombre_comercial', nombre_comercial);
    form.append('emisor_provincia', emisor_provincia);
    form.append('emisor_canton', emisor_canton);
    form.append('emisor_distrito', emisor_distrito);
    form.append('emisor_barrio', emisor_barrio);
    form.append('emisor_otras_senas', emisor_otras_senas);
    form.append('emisor_cod_pais_tel', emisor_cod_pais_tel);
    form.append('emisor_tel', emisor_tel);
    form.append('emisor_cod_pais_fax', emisor_cod_pais_fax);
    form.append('emisor_fax', emisor_fax);
    form.append('emisor_email', emisor_email);
    form.append('condicion_venta', condicion_venta);
    form.append('plazo_credito', plazo_credito);
    form.append('medio_pago', medio_pago);
    form.append('cod_moneda', cod_moneda);
    form.append('tipo_cambio', tipo_cambio);
    form.append('total_serv_gravados', total_serv_gravados);
    form.append('total_serv_exentos', total_serv_exentos);
    form.append('total_merc_gravada', total_merc_gravada);
    form.append('total_merc_exenta', total_merc_exenta);
    form.append('total_gravados', total_gravados);
    form.append('total_exentos', total_exentos);
    form.append('total_ventas', total_ventas);
    form.append('total_descuentos', total_descuentos);
    form.append('total_ventas_neta', total_ventas_neta);
    form.append('total_impuestos', total_impuestos);
    form.append('total_comprobante', total_comprobante);
    form.append('otros', otros);
    form.append('detalles', JSON.stringify(detalles));
    console.log('omitir_receptor',omitir_receptor);
    console.log('detalles',JSON.stringify(detalles));
    if(omitir_receptor){
        form.append('omitir_receptor', omitir_receptor);
    } else {
        form.append('receptor_nombre', receptor_nombre);
        form.append('receptor_tipo_indetif', receptor_tipo_indetif);
        form.append('receptor_num_identif', receptor_num_identif);
        form.append('receptor_provincia', receptor_provincia);
        form.append('receptor_canton', receptor_canton);
        form.append('receptor_distrito', receptor_distrito);
        form.append('receptor_barrio', receptor_barrio);
        form.append('receptor_otras_senas', receptor_otras_senas);
        form.append('receptor_cod_pais_tel', receptor_cod_pais_tel);
        form.append('receptor_tel', receptor_tel);
        form.append('receptor_cod_pais_fax', receptor_cod_pais_fax);
        form.append('receptor_fax', receptor_fax);
        form.append('receptor_email', receptor_email);
    }
    var rawRes = await(fetch(apiUrl, { method: 'POST', body: form }));
    var res = await(rawRes.json());
    return res;
}

function generaFE(clave,
        consecutivo,
        fecha_emision,
        emisor_nombre,
        emisor_tipo_indetif,
        emisor_num_identif,
        nombre_comercial,
        emisor_provincia,
        emisor_canton,
        emisor_distrito,
        emisor_barrio,
        emisor_otras_senas,
        emisor_cod_pais_tel,
        emisor_tel,
        emisor_cod_pais_fax,
        emisor_fax,
        emisor_email,
        receptor_nombre,
        receptor_tipo_identif,
        receptor_num_identif,
        receptor_provincia,
        receptor_canton,
        receptor_distrito,
        receptor_barrio,
        receptor_cod_pais_tel,
        receptor_tel,
        receptor_cod_pais_fax,
        receptor_fax,
        receptor_email,
        condicion_venta,
        plazo_credito,
        medio_pago,
        cod_moneda,
        tipo_cambio,
        total_serv_gravados,
        total_serv_exentos,
        total_merc_gravada,
        total_merc_exenta,
        total_gravados,
        total_exentos,
        total_ventas,
        total_descuentos,
        total_ventas_neta,
        total_impuestos,
        total_comprobante,
        otros,
        detalles,
        omitir_receptor) {
    const form = new FormData();
    form.append('w', 'genXML');
    form.append('r', 'gen_xml_fe');
    form.append('clave', clave);
    form.append('consecutivo', consecutivo);
    form.append('fecha_emision', fecha_emision);
    form.append('emisor_nombre', emisor_nombre);
    form.append('emisor_tipo_indetif', emisor_tipo_indetif);
    form.append('emisor_num_identif', emisor_num_identif);
    form.append('nombre_comercial', nombre_comercial);
    form.append('emisor_provincia', emisor_provincia);
    form.append('emisor_canton', emisor_canton);
    form.append('emisor_distrito', emisor_distrito);
    form.append('emisor_barrio', emisor_barrio);
    form.append('emisor_otras_senas', emisor_otras_senas);
    form.append('emisor_cod_pais_tel', emisor_cod_pais_tel);
    form.append('emisor_tel', emisor_tel);
    form.append('emisor_cod_pais_fax', emisor_cod_pais_fax);
    form.append('emisor_fax', emisor_fax);
    form.append('emisor_email', emisor_email);
    form.append('condicion_venta', condicion_venta);
    form.append('plazo_credito', plazo_credito);
    form.append('medio_pago', medio_pago);
    form.append('cod_moneda', cod_moneda);
    form.append('tipo_cambio', tipo_cambio);
    form.append('total_serv_gravados', total_serv_gravados);
    form.append('total_serv_exentos', total_serv_exentos);
    form.append('total_merc_gravada', total_merc_gravada);
    form.append('total_merc_exenta', total_merc_exenta);
    form.append('total_gravados', total_gravados);
    form.append('total_exentos', total_exentos);
    form.append('total_ventas', total_ventas);
    form.append('total_descuentos', total_descuentos);
    form.append('total_ventas_neta', total_ventas_neta);
    form.append('total_impuestos', total_impuestos);
    form.append('total_comprobante', total_comprobante);
    form.append('otros', otros);
    form.append('detalles', detalles);
    if(omitir_receptor){
        form.append('omitir_receptor', omitir_receptor);
    } else {
        form.append('receptor_nombre', receptor_nombre);
        form.append('receptor_tipo_indetif', receptor_tipo_indetif);
        form.append('receptor_num_identif', receptor_num_identif);
        form.append('receptor_provincia', receptor_provincia);
        form.append('receptor_canton', receptor_canton);
        form.append('receptor_distrito', receptor_distrito);
        form.append('receptor_barrio', receptor_barrio);
        form.append('receptor_otras_senas', receptor_otras_senas);
        form.append('receptor_cod_pais_tel', receptor_cod_pais_tel);
        form.append('receptor_tel', receptor_tel);
        form.append('receptor_cod_pais_fax', receptor_cod_pais_fax);
        form.append('receptor_fax', receptor_fax);
        form.append('receptor_email', receptor_email);
    }
    var rawRes = await(fetch(apiUrl, { method: 'POST', body: form }));
    var res = await(rawRes.json());
    return res;
}

function firmar(p12Url,inXml,pin,tipodoc) {
    const form = new FormData();
    form.append('w', 'signXML');
    form.append('r', 'signFE');
    form.append('p12Url', p12Url);
    form.append('inXml', inXml);
    form.append('pinP12', pin);
    form.append('tipodoc', tipodoc);
    var rawRes = await(fetch(apiUrl, { method: 'POST', body: form }));
    var res = await(rawRes.json());
    return res;
}

function token(client_id,username,password) {
    const form = new FormData();
    form.append('w', 'token');
    form.append('r', 'gettoken');
    form.append('grant_type', 'password');
    form.append('client_id', client_id);
    form.append('username', username);
    form.append('password', password);
    var rawRes = await(fetch(apiUrl, { method: 'POST', body: form }));
    var res = await(rawRes.json());
    return res;
}

function envioMH(token,clave,fecha,emi_tipoIdentificacion,emi_numeroIdentificacion,recp_tipoIdentificacion,recp_numeroIdentificacion,client_id,comprobanteXml) {
    const form = new FormData();
    form.append('w', 'send');
    form.append('r', 'json');
    form.append('token', token);
    form.append('clave', clave);
    form.append('fecha', fecha);
    form.append('emi_tipoIdentificacion', emi_tipoIdentificacion);
    form.append('emi_numeroIdentificacion', emi_numeroIdentificacion);
    var recTipoID = recp_tipoIdentificacion || ''
    form.append('recp_tipoIdentificacion', recTipoID);
    var recID = recp_numeroIdentificacion || ''
    form.append('recp_numeroIdentificacion', recID);
    form.append('client_id', client_id);
    form.append('comprobanteXml', comprobanteXml);
    var rawRes = await(fetch(apiUrl, { method: 'POST', body: form }));
    var res = await(rawRes.json());
    return res;
}

function consulta(client_id,token,clave) {
    const form = new FormData();
    form.append('w', 'consultar');
    form.append('r', 'consultarCom');
    form.append('client_id', client_id);
    form.append('token', token);
    form.append('clave', clave);
    var rawRes = await(fetch(apiUrl, { method: 'POST', body: form }));
    var res = await(rawRes.json());
    return res;
}

module.exports = {
    nuevoUsuario: async(nuevoUsuario),
    iniciarSesion: async(iniciarSesion),
    certificadoUP: async(certificadoUP),
    generaClave: async(generaClave),
    generaTE: async(generaTE),
    generaFE: async(generaFE),
    firmar: async(firmar),
    token: async(token),
    envioMH: async(envioMH),
    consulta: async(consulta)
};