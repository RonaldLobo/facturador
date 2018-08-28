'use strict';
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var sgMail = require('@sendgrid/mail');
var FacturasRP = require(__base + 'server/infrastructure/repositories').facturas;
var FacturasRS = require(__base + 'server/infrastructure/resources').factura;
var ClientesRS = require(__base + 'server/infrastructure/resources').cliente;
var fs = require("fs");

function facturar(env,factura,clienteId,tipo,facturabase) {
    var cliente = await(ClientesRS.getCliente(clienteId));
    var xmlFirmado = '';
    var xmlResponse = '';
    var consultaRes;
    if(cliente){
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
        var generarTERes = await(FacturasRP.generaTE(
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
        // console.log(tokenRes);
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
        const sleep = ms => new Promise(res => setTimeout(res, ms));
        var consultarResRaw;
        async function consultarRes(){
            consultarResRaw = await (FacturasRP.consulta(env,tokenRes.resp.access_token,generaClaveRes.resp.clave));
            console.log('consultarResRaw ---------------');
            console.log(consultarResRaw);
            console.log('---------------');
            if(consultarResRaw.resp['ind-estado'] === 'procesando' || consultarResRaw.resp['ind-estado'] === 'recibido'){
                await sleep(1000)
                await(consultarRes());
            } else {
                xmlResponse = consultarResRaw.resp['respuesta-xml'];
            }
        }
        await(consultarRes());
        var clienteActualizado = await(ClientesRS.updateCliente(cliente));
        console.log('act');
        console.log(clienteActualizado);
        if (consultarResRaw.resp['Status'] === '0'){
            consultaRes = {
                'estado': 'fail',
                'error': 'Hay un error en el Ministerio de Hacienda, por favor volverlo a intentar'
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
                        <br>
                        Emitida por: ` + factura.emisor.nombre + `<br>
                        Nombre Comercial: ` + factura.nombreComercial + `<br>
                        <br>
                        Generada por medio de <a href="https://www.kyrapps.com" target="_blank">https://www.kyrapps.com</a>
                    </div>`,
                    attachments: [
                        {
                          content: xmlFirmado,
                          filename: 'xml-firmado.xml',
                          type: 'text/xml',
                          disposition: 'attachment',
                          content_id: 'xmlfirmado-'+consultarResRaw.resp.fecha
                        },
                        {
                          content: facturabase,
                          filename: 'factura-'+consultarResRaw.resp.fecha+'.pdf',
                          type: 'application/pdf',
                          disposition: 'attachment',
                          content_id: 'factura-'+consultarResRaw.resp.fecha
                        },
                        {
                          content: xmlResponse,
                          filename: 'xml-respuesta.xml',
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
    } else {
        consultaRes = {
            'estado': 'fail',
            'error': 'El cliente no se encuentra en nuestros sistemas'
        }
    }
    return consultaRes;
}

module.exports.facturar = async(facturar);