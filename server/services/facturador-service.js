'use strict';
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var sgMail = require('@sendgrid/mail');
var FacturasRP = require(__base + 'server/infrastructure/repositories').facturas;
var FacturasRS = require(__base + 'server/infrastructure/resources').factura;
var ClientesRS = require(__base + 'server/infrastructure/resources').cliente;
var fs = require("fs");

function generaProximoCons(factura,clienteId,tipo){
    var cliente = await(ClientesRS.getCliente(clienteId));
    var generaClaveRes;
    if(cliente){
        var str;
        if(tipo == 'NC'){
            str = "" + (cliente.consecutivoNc++);
        } else if(tipo == 'ND'){
            str = "" + (cliente.consecutivoNd++);
        } else {
            str = "" + (cliente.consecutivo++);
        }
        var pad = "000000000"
        var con = pad.substring(0, pad.length - str.length) + str
        generaClaveRes = await (FacturasRP.generaClave(tipo,cliente.tipoCedula,cliente.cedula,'506',con,factura.situacion,'00000010'));
    }
    return generaClaveRes;
}

function facturar(factura,clienteId,tipo,facturabase) {
    var cliente = await(ClientesRS.getCliente(clienteId));
    var env = cliente.env || 'api-stag';
    var xmlFirmado = '';
    var xmlResponse = '';
    var consultaRes;
    if(cliente){
        try{
            var iniciarSesionRes = await (FacturasRP.iniciarSesion(cliente.usuarioApi,cliente.claveApi));
            // Revisar si existe el cert ya????
            // Obtener el consecutivo
            console.log('iniciarSesionRes ---------------');
            console.log(iniciarSesionRes);
            console.log('---------------');
            console.log(Number(cliente.consecutivo));
            var str = "" + (cliente.consecutivo++);
            var pad = "000000000"
            var con = pad.substring(0, pad.length - str.length) + str
            console.log('con',con);
            var generaClaveRes = await (FacturasRP.generaClave(tipo,cliente.tipoCedula,cliente.cedula,'506',con,factura.situacion,'00000010'));
            console.log('generaClaveRes ---------------',con);
            console.log(generaClaveRes);
            console.log('---------------');
            var generarTERes;
            if(tipo == 'TE'){
                generarTERes = await(FacturasRP.generaTE(
                    generaClaveRes.resp.clave,
                    generaClaveRes.resp.consecutivo,
                    factura.fecha,
                    factura.emisor.nombre,
                    factura.emisor.tipoId,
                    factura.emisor.id,
                    factura.nombreComercial,
                    factura.emisor.provincia,
                    factura.emisor.canton,
                    factura.emisor.distrito,
                    factura.emisor.barrio,
                    factura.emisor.senas,
                    factura.emisor.codigoPaisTel,
                    factura.emisor.tel,
                    factura.emisor.codigoPaisFax,
                    factura.emisor.fax,
                    factura.emisor.email,
                    factura.receptor.nombre,
                    factura.receptor.tipoId,
                    factura.receptor.id,
                    factura.receptor.provincia,
                    factura.receptor.canton,
                    factura.receptor.distrito,
                    factura.receptor.barrio,
                    factura.receptor.senas,
                    factura.receptor.codigoPaisTel,
                    factura.receptor.tel,
                    factura.receptor.codigoPaisFax,
                    factura.receptor.fax,
                    factura.receptor.email,
                    factura.condicionVenta,
                    factura.plazoCredito,
                    factura.medioPago,// 01
                    factura.codMoneda,// CRC
                    factura.tipoCambio, // 564.48
                    factura.totalServGravados,
                    factura.totalServExentos,
                    factura.totalMercGravada,
                    factura.totalMercExenta,
                    factura.totalGravados,
                    factura.totalExentos,
                    factura.totalVentas,
                    factura.totalDescuentos,
                    factura.totalVentasNeta,
                    factura.totalImpuestos,
                    factura.totalComprobante,
                    factura.otros,
                    factura.detalles,
                    factura.omitirReceptor
                    ));
            } else {
                generarTERes = await(FacturasRP.generaFE(
                    generaClaveRes.resp.clave,
                    generaClaveRes.resp.consecutivo,
                    factura.fecha,
                    factura.emisor.nombre,
                    factura.emisor.tipoId,
                    factura.emisor.id,
                    factura.nombreComercial,
                    factura.emisor.provincia,
                    factura.emisor.canton,
                    factura.emisor.distrito,
                    factura.emisor.barrio,
                    factura.emisor.senas,
                    factura.emisor.codigoPaisTel,
                    factura.emisor.tel,
                    factura.emisor.codigoPaisFax,
                    factura.emisor.fax,
                    factura.emisor.email,
                    factura.receptor.nombre,
                    factura.receptor.tipoId,
                    factura.receptor.id,
                    factura.receptor.provincia,
                    factura.receptor.canton,
                    factura.receptor.distrito,
                    factura.receptor.barrio,
                    factura.receptor.senas,
                    factura.receptor.codigoPaisTel,
                    factura.receptor.tel,
                    factura.receptor.codigoPaisFax,
                    factura.receptor.fax,
                    factura.receptor.email,
                    factura.condicionVenta,
                    factura.plazoCredito,
                    factura.medioPago,// 01
                    factura.codMoneda,// CRC
                    factura.tipoCambio, // 564.48
                    factura.totalServGravados,
                    factura.totalServExentos,
                    factura.totalMercGravada,
                    factura.totalMercExenta,
                    factura.totalGravados,
                    factura.totalExentos,
                    factura.totalVentas,
                    factura.totalDescuentos,
                    factura.totalVentasNeta,
                    factura.totalImpuestos,
                    factura.totalComprobante,
                    factura.otros,
                    factura.detalles,
                    factura.omitirReceptor
                    ));
            }
            console.log('generarTERes ---------------');
            console.log(generarTERes);
            console.log('--------------- ');
            var firmarRes = await (FacturasRP.firmar(cliente.cert,generarTERes.resp.xml,cliente.pinCert,tipo));
            console.log('firmarRes ---------------');
            console.log(firmarRes);
            xmlFirmado = firmarRes.resp.xmlFirmado;
            console.log('---------------');
            var tokenRes = await (FacturasRP.token(env,cliente.usuarioHacienda, cliente.claveHacienda));
            console.log('tokenRes ---------------');
            console.log(tokenRes);
            console.log('---------------');
            var envioRes = await (FacturasRP.envioMH(
                    tokenRes.resp.access_token,
                    generaClaveRes.resp.clave,
                    factura.fecha,
                    factura.emisor.tipoId,
                    factura.emisor.id,
                    factura.receptor.tipoId,
                    factura.receptor.id,
                    env,
                    firmarRes.resp.xmlFirmado
                ));
            console.log('envioRes ---------------');
            // console.log(envioRes);
            console.log('---------------');
            // const sleep = ms => new Promise(res => setTimeout(res, ms));
            var times = 0;
            var consultarResRaw;
            var seconds = 2;
            var esperar = factura.esperar || true;
            async function consultarRes(){
                console.log('consulta inicial',esperar,factura.esperar);
                consultarResRaw = await (FacturasRP.consulta(env,tokenRes.resp.access_token,generaClaveRes.resp.clave));
                console.log('consultarResRaw ---------------');
                console.log(consultarResRaw);
                console.log('---------------');
                if (consultarResRaw.resp != null){
                    if((consultarResRaw.resp['ind-estado'] === 'procesando' || consultarResRaw.resp['ind-estado'] === 'recibido') && times < 10 && esperar === true){
                        times++;
                        console.log('va de vuelta')
                        var waitTill = new Date(new Date().getTime() + seconds * 1000);
                        while(waitTill > new Date()){}
                        console.log('es el tiempo');
                        await(consultarRes());
                    } else {
                        xmlResponse = consultarResRaw.resp['respuesta-xml'];
                    }
                }
            }
            await(consultarRes());
            var clienteActualizado = await(ClientesRS.updateCliente(cliente));
            console.log('act');
            console.log(clienteActualizado);
            if (consultarResRaw.resp == null){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'recibido',
                    'clave': generaClaveRes.resp.clave,
                    'refreshToken': tokenRes.resp.refresh_token,
                    'xml': generarTERes.resp.xml
                };
            } else if (consultarResRaw.resp['error']){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'Hay un error en el Ministerio de Hacienda, por favor volverlo a intentar'
                };
            } else if (consultarResRaw.resp['Status'] === '0'){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'Hay un error en el Ministerio de Hacienda, por favor volverlo a intentar'
                };
            } else if (consultarResRaw.resp['ind-estado'] === 'recibido' || consultarResRaw.resp['ind-estado'] === 'procesando'){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'recibido',
                    'clave': generaClaveRes.resp.clave,
                    'refreshToken': tokenRes.resp.refresh_token,
                    'xml': generarTERes.resp.xml
                };
            } else if (consultarResRaw.resp['ind-estado'] === 'rechazado'){
                consultaRes = {
                    'estado': 'success',
                    'fecha': consultarResRaw.resp.fecha,
                    'cliente': cliente.cedula,
                    'respuesta': consultarResRaw.resp['ind-estado'],
                    'xmlfirmado': xmlFirmado,
                    'xmlrespuesta': xmlResponse
                };
            } else {
                var dir = __base + 'server/facturas/'+cliente.cedula;
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }
                fs.writeFile(dir+"/"+consultarResRaw.resp.fecha+"-respuesta.xml", consultarResRaw.resp['respuesta-xml'], 'base64', function(err) {
                  console.log(err);
                });
                fs.writeFile(dir+"/"+consultarResRaw.resp.fecha+"-firmado.xml", firmarRes.resp.xmlFirmado, 'base64', function(err) {
                  console.log(err);
                });
                consultaRes = {
                    'estado': 'success',
                    'fecha': consultarResRaw.resp.fecha,
                    'cliente': cliente.cedula,
                    'respuesta': consultarResRaw.resp['ind-estado'],
                    'xmlfirmado': xmlFirmado,
                    'xmlrespuesta': xmlResponse
                };
                var to = [factura.emisor.email];
                if(factura.omitirReceptor == "false"){
                    to.push(factura.receptor.email)
                }
                const msg = {
                        to: to,
                        from: 'facturas@kyrapps.com',
                        subject: 'Factura Electrónica N° '+ generaClaveRes.resp.consecutivo +' del Emisor: '+ factura.nombreComercial,
                        text: 'Factura Electrónica por KyRapps.com',
                        html: `<div>
                            Factura Electronica N° `+generaClaveRes.resp.consecutivo+`<br>
                            Clave: `+generaClaveRes.resp.clave+`<br>
                            <br>
                            Emitida por: ` + factura.emisor.nombre + `<br>
                            Nombre Comercial: ` + factura.nombreComercial + `<br>
                            <br>
                            Generada por medio de <a href="http://www.kyrapps.com" target="_blank">http://www.kyrapps.com</a>
                        </div>`,
                        attachments: [
                            {
                              content: xmlFirmado,
                              filename: 'factura-'+factura.fecha+'.xml',
                              type: 'text/xml',
                              disposition: 'attachment',
                              content_id: 'xmlfirmado-'+consultarResRaw.resp.fecha
                            },
                            {
                              content: facturabase,
                              filename: 'factura-'+factura.fecha+'.pdf',
                              type: 'application/pdf',
                              disposition: 'attachment',
                              content_id: 'factura-'+consultarResRaw.resp.fecha
                            },
                            {
                              content: xmlResponse,
                              filename: 'factura-'+factura.fecha+'-respuesta.xml',
                              type: 'text/xml',
                              disposition: 'attachment',
                              content_id: 'xmlrespuesta-'+consultarResRaw.resp.fecha
                            },
                        ]
                };
                console.log('to',to,process.env.SENDGRID_API_KEY);
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                sgMail.send(msg).then(() => {
                    console.log('msg sent');
                  }).catch(error => {
                    console.log('error enviando');
                    console.log(error.toString());
                  });
            }
        } catch(e){
            consultaRes = {
                'estado': 'error en hacienda',
                'error': e.toString()
            }
        }
    } else {
        consultaRes = {
            'estado': 'fail',
            'error': 'El cliente no se encuentra en nuestros sistemas'
        }
    }
    return consultaRes;
}

function consultaFacturaRealizada(factura,clienteId,facturabase){
    var cliente = await(ClientesRS.getCliente(clienteId));
    var env = cliente.env || 'api-stag';
    var tokenRes = await (FacturasRP.tokenRefresh(env,factura.refreshToken));
    if(tokenRes.resp.error == "invalid_grant"){
        return {
            'estado': 'fail',
            'error': 'token_expirado'
        };
    }
    var consultarResRaw;
    var consultaRes;
    var xmlResponse;
    var times = 0;
    var seconds = 2;
    async function consultarRes(){
        console.log('consulta inicial');
        consultarResRaw = await (FacturasRP.consulta(env,tokenRes.resp.access_token,factura.clave));
        console.log('consultarResRaw ---------------');
        console.log(consultarResRaw);
        console.log('---------------');
        if(consultarResRaw.resp['ind-estado'] === 'procesando' || consultarResRaw.resp['ind-estado'] === 'recibido' && times < 4){
            console.log('va de vuelta')
            times++;
            var waitTill = new Date(new Date().getTime() + seconds * 1000);
            while(waitTill > new Date()){}
            console.log('es el tiempo');
            await(consultarRes());
        } else {
            xmlResponse = consultarResRaw.resp['respuesta-xml'];
        }
    }
    await(consultarRes());

    if (consultarResRaw.resp['Status'] === '0'){
        consultaRes = {
            'estado': 'fail',
            'error': 'Hay un error en el Ministerio de Hacienda, por favor volverlo a intentar'
        };
    } else if (consultarResRaw.resp['ind-estado'] === 'recibido'){
        consultaRes = {
            'estado': 'fail',
            'error': 'recibido',
            'refreshToken': tokenRes.resp.refresh_token
        };
    } else if (consultarResRaw.resp['ind-estado'] === 'rechazado'){
        consultaRes = {
            'estado': 'success',
            'fecha': consultarResRaw.resp.fecha,
            'cliente': cliente.cedula,
            'respuesta': consultarResRaw.resp['ind-estado'],
            'xmlfirmado': xmlFirmado,
            'xmlrespuesta': xmlResponse
        };
    } else {
        var dir = __base + 'server/facturas/'+cliente.cedula;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        fs.writeFile(dir+"/"+consultarResRaw.resp.fecha+".xml", consultarResRaw.resp['respuesta-xml'], 'base64', function(err) {
          console.log(err);
        });
        consultaRes = {
            'estado': 'success',
            'fecha': consultarResRaw.resp.fecha,
            'cliente': cliente.cedula,
            'respuesta': consultarResRaw.resp['ind-estado'],
            'xmlrespuesta': xmlResponse
        };
        var to = [factura.emisor.email];
        if(factura.omitirReceptor == "false" && factura.receptor.email && factura.receptor.email != factura.emisor.email){
            to.push(factura.receptor.email)
        }
        const msg = {
            to: to,
            from: 'facturas@kyrapps.com',
            subject: 'Factura Electrónica N° '+ factura.consecutivo +' del Emisor: '+ factura.nombreComercial,
            text: 'Factura Electrónica por KyRapps.com',
            html: `<div>
                Factura Electronica N° `+factura.consecutivo+`<br>
                Clave: `+factura.clave+`<br>
                <br>
                Emitida por: ` + factura.emisor.nombre + `<br>
                Nombre Comercial: ` + factura.nombreComercial + `<br>
                <br>
                Generada por medio de <a href="http://www.kyrapps.com" target="_blank">http://www.kyrapps.com</a>
            </div>`,
            attachments: [
                {
                  content: facturabase,
                  filename: 'factura-'+consultarResRaw.resp.fecha+'.pdf',
                  type: 'application/pdf',
                  disposition: 'attachment',
                  content_id: 'factura-'+consultarResRaw.resp.fecha
                },
                {
                  content: factura.xml,
                  filename: 'factura-'+consultarResRaw.resp.fecha+'.xml',
                  type: 'text/xml',
                  disposition: 'attachment',
                  content_id: 'factura-'+consultarResRaw.resp.fecha
                },
                {
                  content: xmlResponse,
                  filename: 'respuesta-'+consultarResRaw.resp.fecha+'.xml',
                  type: 'text/xml',
                  disposition: 'attachment',
                  content_id: 'respuesta-'+consultarResRaw.resp.fecha
                }
            ]
        };
        console.log('to',to,process.env.SENDGRID_API_KEY);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sgMail.send(msg).then(() => {
            console.log('msg sent');
        }).catch(error => {
            console.log('error enviando');
            console.log(error.toString());
        });
    }
    return consultaRes;
}

function aprobar(clienteId,data){
    var cliente = await(ClientesRS.getCliente(clienteId));
    var env = cliente.env || 'api-stag';
    var xmlFirmado = '';
    var xmlResponse = '';
    var consultaRes;
    if(cliente){
        try{
            var iniciarSesionRes = await (FacturasRP.iniciarSesion(cliente.usuarioApi,cliente.claveApi));
            // Revisar si existe el cert ya????
            // Obtener el consecutivo
            console.log('iniciarSesionRes ---------------');
            console.log(iniciarSesionRes);
            console.log('---------------');
            console.log(Number(cliente.consecutivoRespuesta));
            var str = "" + (cliente.consecutivoRespuesta++);
            var pad = "000000000"
            var con = pad.substring(0, pad.length - str.length) + str;
            console.log('con',con);
            var generaClaveRes = await (FacturasRP.generaClave(data.tipo,cliente.tipoCedula,cliente.cedula,'506',con,'normal','00000010'));
            console.log('generaClaveRes ----------------');
            console.log(generaClaveRes);
            console.log('---------------');

            var generaXMLRes = await (FacturasRP.generaMensaje(
                data.clave,
                generaClaveRes.resp.consecutivo,
                data.fecha_emision_doc,
                data.numero_cedula_emisor,
                data.numero_cedula_receptor,
                data.mensaje,
                data.detalle_mensaje,
                data.monto_total_impuesto,
                data.total_factura
                ));
            console.log('generaXMLRes ----------------');
            console.log(generaXMLRes);
            console.log('---------------');
            console.log('Firmar Inputs----------------');
            console.log(cliente.cert,cliente.pinCert,data.tipo);
            console.log('---------------');
            var firmarRes = await (FacturasRP.firmar(cliente.cert,generaXMLRes.resp.xml,cliente.pinCert,data.tipo));
            console.log('firmarRes ---------------');
            console.log(firmarRes);
            xmlFirmado = firmarRes.resp.xmlFirmado;
            console.log('---------------');
            var tokenRes = await (FacturasRP.token(env,cliente.usuarioHacienda, cliente.claveHacienda));
            console.log('tokenRes ---------------');
            console.log(tokenRes);
            console.log('---------------');
            var envioRes = await (FacturasRP.envioMH(
                    tokenRes.resp.access_token,
                    generaClaveRes.resp.clave,
                    data.fecha_emision_doc,
                    data.tipo_cedula_emisor,
                    data.numero_cedula_emisor,
                    data.tipo_cedula_receptor,
                    data.numero_cedula_receptor,
                    env,
                    firmarRes.resp.xmlFirmado
                ));
            console.log('envioRes ---------------');
            // console.log(envioRes);
            console.log('---------------');
            // const sleep = ms => new Promise(res => setTimeout(res, ms));
            var times = 0;
            var consultarResRaw;
            var seconds = 2;
            async function consultarRes(){
                console.log('consulta inicial');
                consultarResRaw = await (FacturasRP.consulta(env,tokenRes.resp.access_token,generaClaveRes.resp.clave));
                console.log('consultarResRaw ---------------');
                console.log(consultarResRaw);
                console.log('---------------');
                if(consultarResRaw.resp['ind-estado'] === 'procesando' || consultarResRaw.resp['ind-estado'] === 'recibido' && times < 10){
                    times++;
                    console.log('va de vuelta')
                    var waitTill = new Date(new Date().getTime() + seconds * 1000);
                    while(waitTill > new Date()){}
                    console.log('es el tiempo');
                    await(consultarRes());
                } else {
                    xmlResponse = consultarResRaw.resp['respuesta-xml'];
                }
            }
            await(consultarRes());
            var clienteActualizado = await(ClientesRS.updateCliente(cliente));
            if (consultarResRaw.resp['Status'] === '0'){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'Hay un error en el Ministerio de Hacienda, por favor volverlo a intentar'
                };
            } else if (consultarResRaw.resp['ind-estado'] === 'recibido'){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'recibido',
                    'refreshToken': tokenRes.resp.refresh_token
                };
            } else {
                consultaRes = {
                    'estado': 'success',
                    'fecha': consultarResRaw.resp.fecha,
                    'cliente': cliente.cedula,
                    'respuesta': consultarResRaw.resp['ind-estado'],
                    'xmlrespuesta': xmlResponse
                };
                var to = [cliente.correo];
                const msg = {
                    to: to,
                    from: 'facturas@kyrapps.com',
                    subject: 'Factura Electrónica con clave '+ data.clave +' del Emisor: '+ data.numero_cedula_emisor,
                    text: 'Factura Electrónica por KyRapps.com',
                    html: `<div>
                        Su factura con clave N° `+data.clave+` a sido aceptada<br>
                        <br>
                        Emitida por: ` + data.numero_cedula_emisor + `<br>
                        <br>
                        Aceptación generada por medio de <a href="http://www.kyrapps.com" target="_blank">http://www.kyrapps.com</a>
                    </div>`
                };
                console.log('to',to,process.env.SENDGRID_API_KEY);
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                sgMail.send(msg).then(() => {
                    console.log('msg sent');
                }).catch(error => {
                    console.log('error enviando');
                    console.log(error.toString());
                });
            }

        } catch(e){
            consultaRes = {
                'estado': 'error en hacienda',
                'error': e.toString()
            }
        }
        return consultaRes;
    }
}

function revisar(clienteId,data){
    var cliente = await(ClientesRS.getCliente(clienteId));
    var env = cliente.env || 'api-stag';
    var xmlFirmado = '';
    var xmlResponse = '';
    var consultarResRaw;
    var consultaRes;
    var times = 0;
    var seconds = 2;
    if(cliente){
        try{
            var iniciarSesionRes = await (FacturasRP.iniciarSesion(cliente.usuarioApi,cliente.claveApi));
            // Revisar si existe el cert ya????
            // Obtener el consecutivo
            console.log('iniciarSesionRes ---------------');
            console.log(iniciarSesionRes);
            console.log('---------------');
            var tokenRes = await (FacturasRP.tokenRefresh(env,data.refresh));
            if(tokenRes.resp.error == "invalid_grant"){
                return {
                    'estado': 'fail',
                    'error': 'token_expirado'
                };
            }
            async function consultarRes(){
                console.log('consulta inicial');
                consultarResRaw = await (FacturasRP.consulta(env,tokenRes.resp.access_token,data.clave));
                console.log('consultarResRaw ---------------');
                console.log(consultarResRaw);
                console.log('---------------');
                if(consultarResRaw.resp['ind-estado'] === 'procesando' || consultarResRaw.resp['ind-estado'] === 'recibido' && times < 4){
                    console.log('va de vuelta')
                    times++;
                    var waitTill = new Date(new Date().getTime() + seconds * 1000);
                    while(waitTill > new Date()){}
                    console.log('es el tiempo');
                    await(consultarRes());
                } else {
                    xmlResponse = consultarResRaw.resp['respuesta-xml'];
                }
            }
            await(consultarRes());

            if (consultarResRaw.resp['Status'] === '0'){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'Hay un error en el Ministerio de Hacienda, por favor volverlo a intentar'
                };
            } else if (consultarResRaw.resp['ind-estado'] === 'recibido'){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'recibido',
                    'refreshToken': tokenRes.resp.refresh_token
                };
            } else {
                consultaRes = {
                    'estado': 'success',
                    'fecha': consultarResRaw.resp.fecha,
                    'cliente': cliente.cedula,
                    'respuesta': consultarResRaw.resp['ind-estado'],
                    'xmlrespuesta': xmlResponse
                };
                var to = [cliente.correo];
                const msg = {
                    to: to,
                    from: 'facturas@kyrapps.com',
                    subject: 'Factura Electrónica con clave '+ data.clave +' del Emisor: '+ data.numero_cedula_emisor,
                    text: 'Factura Electrónica por KyRapps.com',
                    html: `<div>
                        Su factura con clave N° `+data.clave+` a sido aceptada<br>
                        <br>
                        Emitida por: ` + data.numero_cedula_emisor + `<br>
                        <br>
                        Aceptación generada por medio de <a href="http://www.kyrapps.com" target="_blank">http://www.kyrapps.com</a>
                    </div>`
                };
                console.log('to',to,process.env.SENDGRID_API_KEY);
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                sgMail.send(msg).then(() => {
                    console.log('msg sent');
                }).catch(error => {
                    console.log('error enviando');
                    console.log(error.toString());
                });
            }

        } catch(e){
            consultaRes = {
                'estado': 'error en hacienda',
                'error': e.toString()
            }
        }
        return consultaRes;
    }
}

function generarNC(factura,clienteId,tipo,facturabase) {
    var cliente = await(ClientesRS.getCliente(clienteId));
    var env = cliente.env || 'api-stag';
    var xmlFirmado = '';
    var xmlResponse = '';
    var consultaRes;
    if(cliente){
        try{
            var iniciarSesionRes = await (FacturasRP.iniciarSesion(cliente.usuarioApi,cliente.claveApi));
            // Revisar si existe el cert ya????
            // Obtener el consecutivo
            console.log('iniciarSesionRes ---------------');
            console.log(iniciarSesionRes);
            console.log('---------------');
            console.log(Number(cliente.consecutivoNc));
            var str = "" + (cliente.consecutivoNc++);
            var pad = "000000000"
            var con = pad.substring(0, pad.length - str.length) + str
            console.log('con',con);
            var generaClaveRes = await (FacturasRP.generaClave(tipo,cliente.tipoCedula,cliente.cedula,'506',con,factura.situacion,'00000010'));
            console.log('generaClaveRes ---------------',con);
            console.log(generaClaveRes);
            console.log('---------------');
            var generarNCRes = await(FacturasRP.generaNC(
                    generaClaveRes.resp.clave,
                    generaClaveRes.resp.consecutivo,
                    factura.fecha,
                    factura.emisor.nombre,
                    factura.emisor.tipoId,
                    factura.emisor.id,
                    factura.nombreComercial,
                    factura.emisor.provincia,
                    factura.emisor.canton,
                    factura.emisor.distrito,
                    factura.emisor.barrio,
                    factura.emisor.senas,
                    factura.emisor.codigoPaisTel,
                    factura.emisor.tel,
                    factura.emisor.codigoPaisFax,
                    factura.emisor.fax,
                    factura.emisor.email,
                    factura.receptor.nombre,
                    factura.receptor.tipoId,
                    factura.receptor.id,
                    factura.receptor.provincia,
                    factura.receptor.canton,
                    factura.receptor.distrito,
                    factura.receptor.barrio,
                    factura.receptor.senas,
                    factura.receptor.codigoPaisTel,
                    factura.receptor.tel,
                    factura.receptor.codigoPaisFax,
                    factura.receptor.fax,
                    factura.receptor.email,
                    factura.condicionVenta,
                    factura.plazoCredito,
                    factura.medioPago,// 01
                    factura.codMoneda,// CRC
                    factura.tipoCambio, // 564.48
                    factura.totalServGravados,
                    factura.totalServExentos,
                    factura.totalMercGravada,
                    factura.totalMercExenta,
                    factura.totalGravados,
                    factura.totalExentos,
                    factura.totalVentas,
                    factura.totalDescuentos,
                    factura.totalVentasNeta,
                    factura.totalImpuestos,
                    factura.totalComprobante,
                    factura.otros,
                    factura.detalles,
                    factura.omitirReceptor,
                    factura.infoRefeTipoDoc,
                    factura.infoRefeNumero,
                    factura.infoRefeFechaEmision,
                    factura.infoRefeCodigo,
                    factura.infoRefeRazon
                    ));
            console.log('generarNCRes ---------------');
            console.log(generarNCRes);
            console.log('--------------- ');
            var firmarRes = await (FacturasRP.firmar(cliente.cert,generarNCRes.resp.xml,cliente.pinCert,tipo));
            console.log('firmarRes ---------------');
            console.log(firmarRes);
            xmlFirmado = firmarRes.resp.xmlFirmado;
            console.log('---------------');
            var tokenRes = await (FacturasRP.token(env,cliente.usuarioHacienda, cliente.claveHacienda));
            console.log('tokenRes ---------------');
            console.log(tokenRes);
            console.log('---------------');
            var envioRes = await (FacturasRP.envioMH(
                    tokenRes.resp.access_token,
                    generaClaveRes.resp.clave,
                    factura.fecha,
                    factura.emisor.tipoId,
                    factura.emisor.id,
                    factura.receptor.tipoId,
                    factura.receptor.id,
                    env,
                    firmarRes.resp.xmlFirmado
                ));
            console.log('envioRes ---------------');
            // console.log(envioRes);
            console.log('---------------');
            // const sleep = ms => new Promise(res => setTimeout(res, ms));
            var times = 0;
            var consultarResRaw;
            var seconds = 2;
            async function consultarRes(){
                console.log('consulta inicial');
                consultarResRaw = await (FacturasRP.consulta(env,tokenRes.resp.access_token,generaClaveRes.resp.clave));
                console.log('consultarResRaw ---------------');
                console.log(consultarResRaw);
                console.log('---------------');
                if (consultarResRaw.resp != null){
                    if(consultarResRaw.resp['ind-estado'] === 'procesando' || consultarResRaw.resp['ind-estado'] === 'recibido' && times < 10){
                        times++;
                        console.log('va de vuelta')
                        var waitTill = new Date(new Date().getTime() + seconds * 1000);
                        while(waitTill > new Date()){}
                        console.log('es el tiempo');
                        await(consultarRes());
                    } else {
                        xmlResponse = consultarResRaw.resp['respuesta-xml'];
                    }
                }
            }
            await(consultarRes());
            var clienteActualizado = await(ClientesRS.updateCliente(cliente));
            console.log('act');
            console.log(clienteActualizado);
            if (consultarResRaw.resp == null){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'recibido',
                    'clave': generaClaveRes.resp.clave,
                    'refreshToken': tokenRes.resp.refresh_token,
                    'xml': generarNCRes.resp.xml
                };
            } else if (consultarResRaw.resp['error']){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'Hay un error en el Ministerio de Hacienda, por favor volverlo a intentar'
                };
            } else if (consultarResRaw.resp['Status'] === '0'){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'Hay un error en el Ministerio de Hacienda, por favor volverlo a intentar'
                };
            } else if (consultarResRaw.resp['ind-estado'] === 'recibido' || consultarResRaw.resp['ind-estado'] === 'procesando'){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'recibido',
                    'clave': generaClaveRes.resp.clave,
                    'refreshToken': tokenRes.resp.refresh_token,
                    'xml': generarNCRes.resp.xml
                };
            } else if (consultarResRaw.resp['ind-estado'] === 'rechazado'){
                consultaRes = {
                    'estado': 'success',
                    'fecha': consultarResRaw.resp.fecha,
                    'cliente': cliente.cedula,
                    'respuesta': consultarResRaw.resp['ind-estado'],
                    'xmlfirmado': xmlFirmado,
                    'xmlrespuesta': xmlResponse
                };
            } else {
                var dir = __base + 'server/facturas/'+cliente.cedula;
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }
                fs.writeFile(dir+"/"+consultarResRaw.resp.fecha+"-respuesta.xml", consultarResRaw.resp['respuesta-xml'], 'base64', function(err) {
                  console.log(err);
                });
                fs.writeFile(dir+"/"+consultarResRaw.resp.fecha+"-firmado.xml", firmarRes.resp.xmlFirmado, 'base64', function(err) {
                  console.log(err);
                });
                consultaRes = {
                    'estado': 'success',
                    'fecha': consultarResRaw.resp.fecha,
                    'cliente': cliente.cedula,
                    'respuesta': consultarResRaw.resp['ind-estado'],
                    'xmlfirmado': xmlFirmado,
                    'xmlrespuesta': xmlResponse
                };
                var to = [factura.emisor.email];
                if(factura.omitirReceptor == "false"){
                    to.push(factura.receptor.email)
                }
                const msg = {
                        to: to,
                        from: 'facturas@kyrapps.com',
                        subject: 'Nota de Crédito N° '+ generaClaveRes.resp.consecutivo +' del Emisor: '+ factura.nombreComercial,
                        text: 'Factura Electrónica por KyRapps.com',
                        html: `<div>
                            Nota de Crédito Electronica N° `+generaClaveRes.resp.consecutivo+`<br>
                            Clave: `+generaClaveRes.resp.clave+`<br>
                            <br>`+(factura.infoRefeCodigo == '01') ? `Factura Eliminada` : ``+`<br>
                            Emitida por: ` + factura.emisor.nombre + `<br>
                            Nombre Comercial: ` + factura.nombreComercial + `<br>
                            <br>
                            Generada por medio de <a href="http://www.kyrapps.com" target="_blank">http://www.kyrapps.com</a>
                        </div>`,
                        attachments: [
                            {
                              content: facturabase,
                              filename: 'factura-'+consultarResRaw.resp.fecha+'.pdf',
                              type: 'application/pdf',
                              disposition: 'attachment',
                              content_id: 'factura-'+consultarResRaw.resp.fecha
                            },
                            {
                              content: xmlFirmado,
                              filename: 'factura-'+factura.fecha+'.xml',
                              type: 'text/xml',
                              disposition: 'attachment',
                              content_id: 'xmlfirmado-'+consultarResRaw.resp.fecha
                            },
                            {
                              content: xmlResponse,
                              filename: 'factura-'+factura.fecha+'-respuesta.xml',
                              type: 'text/xml',
                              disposition: 'attachment',
                              content_id: 'xmlrespuesta-'+consultarResRaw.resp.fecha
                            },
                        ]
                };
                console.log('to',to,process.env.SENDGRID_API_KEY);
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                sgMail.send(msg).then(() => {
                    console.log('msg sent');
                  }).catch(error => {
                    console.log('error enviando');
                    console.log(error.toString());
                  });
            }
        } catch(e){
            consultaRes = {
                'estado': 'error en hacienda',
                'error': e.toString()
            }
        }
    } else {
        consultaRes = {
            'estado': 'fail',
            'error': 'El cliente no se encuentra en nuestros sistemas'
        }
    }
    return consultaRes;
}

function generarND(factura,clienteId,tipo,facturabase) {
    var cliente = await(ClientesRS.getCliente(clienteId));
    var env = cliente.env || 'api-stag';
    var xmlFirmado = '';
    var xmlResponse = '';
    var consultaRes;
    if(cliente){
        try{
            var iniciarSesionRes = await (FacturasRP.iniciarSesion(cliente.usuarioApi,cliente.claveApi));
            // Revisar si existe el cert ya????
            // Obtener el consecutivo
            console.log('iniciarSesionRes ---------------');
            console.log(iniciarSesionRes);
            console.log('---------------');
            console.log(Number(cliente.consecutivoNd));
            var str = "" + (cliente.consecutivoNd++);
            var pad = "000000000"
            var con = pad.substring(0, pad.length - str.length) + str
            console.log('con',con);
            var generaClaveRes = await (FacturasRP.generaClave(tipo,cliente.tipoCedula,cliente.cedula,'506',con,factura.situacion,'00000010'));
            console.log('generaClaveRes ---------------',con);
            console.log(generaClaveRes);
            console.log('---------------');
            var generarNDRes = await(FacturasRP.generaND(
                    generaClaveRes.resp.clave,
                    generaClaveRes.resp.consecutivo,
                    factura.fecha,
                    factura.emisor.nombre,
                    factura.emisor.tipoId,
                    factura.emisor.id,
                    factura.nombreComercial,
                    factura.emisor.provincia,
                    factura.emisor.canton,
                    factura.emisor.distrito,
                    factura.emisor.barrio,
                    factura.emisor.senas,
                    factura.emisor.codigoPaisTel,
                    factura.emisor.tel,
                    factura.emisor.codigoPaisFax,
                    factura.emisor.fax,
                    factura.emisor.email,
                    factura.receptor.nombre,
                    factura.receptor.tipoId,
                    factura.receptor.id,
                    factura.receptor.provincia,
                    factura.receptor.canton,
                    factura.receptor.distrito,
                    factura.receptor.barrio,
                    factura.receptor.senas,
                    factura.receptor.codigoPaisTel,
                    factura.receptor.tel,
                    factura.receptor.codigoPaisFax,
                    factura.receptor.fax,
                    factura.receptor.email,
                    factura.condicionVenta,
                    factura.plazoCredito,
                    factura.medioPago,// 01
                    factura.codMoneda,// CRC
                    factura.tipoCambio, // 564.48
                    factura.totalServGravados,
                    factura.totalServExentos,
                    factura.totalMercGravada,
                    factura.totalMercExenta,
                    factura.totalGravados,
                    factura.totalExentos,
                    factura.totalVentas,
                    factura.totalDescuentos,
                    factura.totalVentasNeta,
                    factura.totalImpuestos,
                    factura.totalComprobante,
                    factura.otros,
                    factura.detalles,
                    factura.omitirReceptor,
                    factura.infoRefeTipoDoc,
                    factura.infoRefeNumero,
                    factura.infoRefeFechaEmision,
                    factura.infoRefeCodigo,
                    factura.infoRefeRazon
                    ));
            console.log('generarNDRes ---------------');
            console.log(generarNDRes);
            console.log('--------------- ');
            var firmarRes = await (FacturasRP.firmar(cliente.cert,generarNDRes.resp.xml,cliente.pinCert,tipo));
            console.log('firmarRes ---------------');
            console.log(firmarRes);
            xmlFirmado = firmarRes.resp.xmlFirmado;
            console.log('---------------');
            var tokenRes = await (FacturasRP.token(env,cliente.usuarioHacienda, cliente.claveHacienda));
            console.log('tokenRes ---------------');
            console.log(tokenRes);
            console.log('---------------');
            var envioRes = await (FacturasRP.envioMH(
                    tokenRes.resp.access_token,
                    generaClaveRes.resp.clave,
                    factura.fecha,
                    factura.emisor.tipoId,
                    factura.emisor.id,
                    factura.receptor.tipoId,
                    factura.receptor.id,
                    env,
                    firmarRes.resp.xmlFirmado
                ));
            console.log('envioRes ---------------');
            // console.log(envioRes);
            console.log('---------------');
            // const sleep = ms => new Promise(res => setTimeout(res, ms));
            var times = 0;
            var consultarResRaw;
            var seconds = 2;
            async function consultarRes(){
                console.log('consulta inicial');
                consultarResRaw = await (FacturasRP.consulta(env,tokenRes.resp.access_token,generaClaveRes.resp.clave));
                console.log('consultarResRaw ---------------');
                console.log(consultarResRaw);
                console.log('---------------');
                if (consultarResRaw.resp != null){
                    if(consultarResRaw.resp['ind-estado'] === 'procesando' || consultarResRaw.resp['ind-estado'] === 'recibido' && times < 10){
                        times++;
                        console.log('va de vuelta')
                        var waitTill = new Date(new Date().getTime() + seconds * 1000);
                        while(waitTill > new Date()){}
                        console.log('es el tiempo');
                        await(consultarRes());
                    } else {
                        xmlResponse = consultarResRaw.resp['respuesta-xml'];
                    }
                }
            }
            await(consultarRes());
            var clienteActualizado = await(ClientesRS.updateCliente(cliente));
            console.log('act');
            console.log(clienteActualizado);
            if (consultarResRaw.resp == null){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'recibido',
                    'clave': generaClaveRes.resp.clave,
                    'refreshToken': tokenRes.resp.refresh_token,
                    'xml': generarNDRes.resp.xml
                };
            } else if (consultarResRaw.resp['error']){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'Hay un error en el Ministerio de Hacienda, por favor volverlo a intentar'
                };
            } else if (consultarResRaw.resp['Status'] === '0'){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'Hay un error en el Ministerio de Hacienda, por favor volverlo a intentar'
                };
            } else if (consultarResRaw.resp['ind-estado'] === 'recibido' || consultarResRaw.resp['ind-estado'] === 'procesando'){
                consultaRes = {
                    'estado': 'fail',
                    'error': 'recibido',
                    'clave': generaClaveRes.resp.clave,
                    'refreshToken': tokenRes.resp.refresh_token,
                    'xml': generarNDRes.resp.xml
                };
            } else if (consultarResRaw.resp['ind-estado'] === 'rechazado'){
                consultaRes = {
                    'estado': 'success',
                    'fecha': consultarResRaw.resp.fecha,
                    'cliente': cliente.cedula,
                    'respuesta': consultarResRaw.resp['ind-estado'],
                    'xmlfirmado': xmlFirmado,
                    'xmlrespuesta': xmlResponse
                };
            } else {
                var dir = __base + 'server/facturas/'+cliente.cedula;
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }
                fs.writeFile(dir+"/"+consultarResRaw.resp.fecha+"-respuesta.xml", consultarResRaw.resp['respuesta-xml'], 'base64', function(err) {
                  console.log(err);
                });
                fs.writeFile(dir+"/"+consultarResRaw.resp.fecha+"-firmado.xml", firmarRes.resp.xmlFirmado, 'base64', function(err) {
                  console.log(err);
                });
                consultaRes = {
                    'estado': 'success',
                    'fecha': consultarResRaw.resp.fecha,
                    'cliente': cliente.cedula,
                    'respuesta': consultarResRaw.resp['ind-estado'],
                    'xmlfirmado': xmlFirmado,
                    'xmlrespuesta': xmlResponse
                };
                var to = [factura.emisor.email];
                if(factura.omitirReceptor == "false"){
                    to.push(factura.receptor.email)
                }
                const msg = {
                        to: to,
                        from: 'facturas@kyrapps.com',
                        subject: 'Nota de Debito N° '+ generaClaveRes.resp.consecutivo +' del Emisor: '+ factura.nombreComercial,
                        text: 'Factura Electrónica por KyRapps.com',
                        html: `<div>
                            Nota de Debito Electronica N° `+generaClaveRes.resp.consecutivo+`<br>
                            Clave: `+generaClaveRes.resp.clave+`<br>
                            <br>
                            Emitida por: ` + factura.emisor.nombre + `<br>
                            Nombre Comercial: ` + factura.nombreComercial + `<br>
                            <br>
                            Generada por medio de <a href="http://www.kyrapps.com" target="_blank">http://www.kyrapps.com</a>
                        </div>`,
                        attachments: [
                            {
                              content: facturabase,
                              filename: 'factura-'+consultarResRaw.resp.fecha+'.pdf',
                              type: 'application/pdf',
                              disposition: 'attachment',
                              content_id: 'factura-'+consultarResRaw.resp.fecha
                            },
                            {
                              content: xmlFirmado,
                              filename: 'factura-'+factura.fecha+'.xml',
                              type: 'text/xml',
                              disposition: 'attachment',
                              content_id: 'xmlfirmado-'+consultarResRaw.resp.fecha
                            },
                            {
                              content: xmlResponse,
                              filename: 'factura-'+factura.fecha+'-respuesta.xml',
                              type: 'text/xml',
                              disposition: 'attachment',
                              content_id: 'xmlrespuesta-'+consultarResRaw.resp.fecha
                            },
                        ]
                };
                console.log('to',to,process.env.SENDGRID_API_KEY);
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                sgMail.send(msg).then(() => {
                    console.log('msg sent');
                  }).catch(error => {
                    console.log('error enviando');
                    console.log(error.toString());
                  });
            }
        } catch(e){
            consultaRes = {
                'estado': 'error en hacienda',
                'error': e.toString()
            }
        }
    } else {
        consultaRes = {
            'estado': 'fail',
            'error': 'El cliente no se encuentra en nuestros sistemas'
        }
    }
    return consultaRes;
}

function consultar(idCliente,clave){
    var cliente = await(ClientesRS.getCliente(idCliente));
    var env = cliente.env || 'api-stag';
    var consultarResRaw;
    if(cliente){
        try{
            var tokenRes = await (FacturasRP.token(env,cliente.usuarioHacienda, cliente.claveHacienda));
            consultarResRaw = await (FacturasRP.consulta(env,tokenRes.resp.access_token,clave));
        } catch(e){
            consultaRes = {
                'estado': 'error en hacienda',
                'error': e.toString()
            }
        }
    }
    return consultarResRaw;
}



module.exports.consultaFacturaRealizada = async(consultaFacturaRealizada);
module.exports.facturar = async(facturar);
module.exports.generarNC = async(generarNC);
module.exports.generarND = async(generarND);
module.exports.generaProximoCons = async(generaProximoCons);
module.exports.aprobar = async(aprobar);
module.exports.revisar = async(revisar);
module.exports.consultar = async(consultar);





