import * as nodemailer from 'nodemailer';

// modulos de node
import * as path from 'path';
import * as fs from 'fs';
// Modelos
import { UserEntity } from '../models/user.entity';

// Assets || Si es una class lo tego que poner en el constructor y como proverdor del modulo
import { DummyPromise } from './promises.assets';
import { ReadFileContent } from './file-manager.assets';
import { HbsConvertHtmlRender } from './hbs.assets'

//Interface
import { NestExpressApplication } from '@nestjs/platform-express';

// Template config
import { SQLITE_PATH, TEMPLATE_MAIL_PATH } from '../config/path.config';
import { MailOptions } from '../models/assets/mailOptions.model';
import { MailLastVoyage } from '../models/sendMailConfig';
import { ConvertDateUTC_To_FORMAT_UTC } from './moment.assets';
import { mathRound } from './math.assets';
import { translateActivity } from './translate.assets';
import { URL_Server } from '../config/server.config';


let mailServer;

// Funcion para inicializar el engine de templating
export function NodemailerInit(): Promise<boolean> {

    // Armo promesa para devolver
    return DummyPromise().then(
        (result: boolean) => {

            let email = 'transgasshippinglines@gmail.com';
            let password = 'getlsmyuiluiwktq';

            // Create reusable transporter object using the default SMTP transport
            mailServer = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: URL_Server.emailNotification, // generated ethereal user
                    pass: URL_Server.passwordNotification // generated ethereal password
                }
            });

            // Verifico la conexión
            return mailServer.verify();
        }
    ).then(
        (resultVerify: boolean) => {

            // Verifico que el resultado sea el esperado.
            if (!resultVerify) throw Error('MailServer.verify() no respondio como esperabamos.');

            return resultVerify;

        }
    ).catch(
        error => {

            console.log(('NodemailerInit() \'' + error + '\' - revisar NodemailerInit()'));
            return false;
        }
    );;
}

// Envio de mail via SMTP.
export function MailSendSMTP(
    from: string
    , to: string
    , subject: string
    , body: string
    , htmlBody?: boolean
    , cc?: string
    , bcc?: string
    , attachments?: any
): Promise<any> {

    // Configuracion para el envió de mail
    let mailOptions: MailOptions = {
        from: from,
        to: to,
        subject: subject
    };

    // Segun el flag uso html o texto plano
    if (htmlBody)
        mailOptions.html = body;
    else
        mailOptions.text = body;

    // Si tengo CC o BCC los agrego
    if (cc) mailOptions.cc = cc;
    if (bcc) mailOptions.bcc = bcc;

    // Si tengo adjuntos los agrego
    if (attachments) mailOptions.attachments = attachments;

    // Inicio una promesa Dummy.
    return DummyPromise().then(
        (result: Boolean) => {
            // Descargar
            return mailServer.sendMail(mailOptions)
        }
    ).then(
        (resultInfo: any) => {
            if (!resultInfo) throw Error('la funcion mailServer.sendMail no respondio como esperabamos.');

            console.log('Envío de mail realizado correctamente: \'' + resultInfo + '\'');
            return true;
        }
    ).catch(
        err => {

            // Obtengo mensajes de error
            const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUES_MailSendSMTPT');
            const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST_MailSendSMTP');

            // caso contrario retornamos un error
            throw {
                error: clientMsg,
                message: errorMsg,
            };
        }
    );
}
//----------------[ FUNCIONES ]--------------------------

// Envio de correo de validacion con plantilla html.
export function SendMailHTMLValidate(to: string, name: string, token: string): Promise<boolean> {

    //variable de contenido
    let contentHTML: string = '';

    // Inicio una promesa Dummy.
    return DummyPromise().then(
        result => {

            let objRender = {
                name: name,
                url: 'localhost:3000',
                token: token,
            }

            // Devuelvo el contenido obtenido
            return HbsConvertHtmlRender('suscription.hbs', objRender);
        }
    ).then(
        (renderHtml: string) => {

            if (!renderHtml) throw 'Error al renderizar- revisar HbsConvertHtmlRender().';

            return MailSendSMTP(null, to, 'Correo de confirmación PERFORMANCE  ✔ ✔', renderHtml, true);
        }
    ).then(
        (resultInfo: boolean) => {
            if (!resultInfo) throw 'La funcion MailSendSMTP no funciono como esperabamos.'

            // Hay que validarlo.
            //resultInfo
            return resultInfo;
        }
    ).catch(
        err => {
            // Obtengo mensajes de error
            const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

            // caso contrario retornamos un error
            throw {
                error: clientMsg,
                message: errorMsg,
            };
        }
    );
}


// Envio de correo para recuperar el PSW.
export function SendMailForgotPsw(to: string, name: string, token: string): Promise<boolean> {

    //variable de contenido
    let contentHTML: string = '';

    // Inicio una promesa Dummy.
    return DummyPromise().then(
        result => {

            let objRender = {
                name: name,
                url: 'localhost:4200?token=' + token,
            }

            // Devuelvo el contenido obtenido
            return HbsConvertHtmlRender('mailForgotPsw.hbs', objRender);
        }
    ).then(
        (renderHtml: string) => {

            if (!renderHtml) throw 'Error al renderizar- revisar HbsConvertHtmlRender().';

            return MailSendSMTP(null, to, 'Solicitud de Cambio de contraseña - API SUNAT  ✔ ✔', renderHtml, true);
        }
    ).then(
        (resultInfo: boolean) => {
            if (!resultInfo) throw 'La funcion MailSendSMTP no funciono como esperabamos.'

            // Hay que validarlo.
            //resultInfo
            return resultInfo;
        }
    ).catch(
        err => {
            // Obtengo mensajes de error
            const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

            // caso contrario retornamos un error
            throw {
                error: clientMsg,
                message: errorMsg,
            };
        }
    );
}

export function SendMailArchiveInfoLastVoyage(to: string, name: string, title: string, bufferFile: Buffer, mailLastVoyage: MailLastVoyage): Promise<boolean> {

    //variable de contenido
    let contentHTML: string = '';

    // Inicio una promesa Dummy.
    return DummyPromise().then(
        result => {

            // Corregimos el horario utc
            mailLastVoyage.dateCurrent = ConvertDateUTC_To_FORMAT_UTC(mailLastVoyage.dateCurrent) + ' GMT';

            // CABIamos los consumo
            mailLastVoyage.currentVLSFO = mathRound(mailLastVoyage.currentVLSFO, 2);
            mailLastVoyage.currentMGO = mathRound(mailLastVoyage.currentMGO, 2);
            mailLastVoyage.bunkeringIFO = mathRound(mailLastVoyage.bunkeringIFO, 2);
            mailLastVoyage.bunkeringMGO = mathRound(mailLastVoyage.bunkeringMGO, 2);

            // CONSUMO IFO
            mailLastVoyage.consumptionActivity.ifoResumen.anchored.activityName = translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.anchored.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity, 2);
            mailLastVoyage.consumptionActivity.ifoResumen.anchored.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.anchored.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.ifoResumen.anchored.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.ifoResumen.anchored.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.ifoResumen.anchored.consumption = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.anchored.consumption, 2);


            mailLastVoyage.consumptionActivity.ifoResumen.ballast.activityName = translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.ballast.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity, 2);
            mailLastVoyage.consumptionActivity.ifoResumen.ballast.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.ballast.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.ifoResumen.ballast.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.ifoResumen.ballast.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.ifoResumen.ballast.consumption = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.ballast.consumption, 2);

            mailLastVoyage.consumptionActivity.ifoResumen.discharge.activityName = translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.discharge.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.ifoResumen.discharge.timeActivity = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.discharge.timeActivity, 2);
            mailLastVoyage.consumptionActivity.ifoResumen.discharge.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.discharge.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.ifoResumen.discharge.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.ifoResumen.discharge.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.ifoResumen.discharge.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.discharge.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.ifoResumen.discharge.consumption = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.discharge.consumption, 2);

            mailLastVoyage.consumptionActivity.ifoResumen.economical.activityName = translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.economical.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.ifoResumen.economical.timeActivity = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.economical.timeActivity, 2);
            mailLastVoyage.consumptionActivity.ifoResumen.economical.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.economical.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.ifoResumen.economical.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.ifoResumen.economical.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.ifoResumen.economical.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.economical.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.ifoResumen.economical.consumption = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.economical.consumption, 2);


            mailLastVoyage.consumptionActivity.ifoResumen.laden.activityName = translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.laden.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity, 2);
            mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumption = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumption, 2);
            mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.ifoResumen.laden.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.ifoResumen.laden.consumption = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.laden.consumption, 2);


            mailLastVoyage.consumptionActivity.ifoResumen.loading.activityName = translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.loading.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity, 2);
            mailLastVoyage.consumptionActivity.ifoResumen.loading.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.loading.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.ifoResumen.loading.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.ifoResumen.loading.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.ifoResumen.loading.consumption = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.loading.consumption, 2);

            mailLastVoyage.consumptionActivity.ifoResumen.maneuver.activityName = translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.maneuver.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity, 2);
            mailLastVoyage.consumptionActivity.ifoResumen.maneuver.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.maneuver.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.ifoResumen.maneuver.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.ifoResumen.maneuver.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.ifoResumen.maneuver.consumption = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.maneuver.consumption, 2);

            mailLastVoyage.consumptionActivity.ifoResumen.other_act.activityName = translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.other_act.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.ifoResumen.other_act.timeActivity = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.other_act.timeActivity, 2);
            mailLastVoyage.consumptionActivity.ifoResumen.other_act.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.other_act.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.ifoResumen.other_act.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.ifoResumen.other_act.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.ifoResumen.other_act.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.other_act.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.ifoResumen.other_act.consumption = mathRound(mailLastVoyage.consumptionActivity.ifoResumen.other_act.consumption, 2);


            // CONSUMO MGO 
            mailLastVoyage.consumptionActivity.mgoResumen.anchored.activityName = translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.anchored.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity, 2);
            mailLastVoyage.consumptionActivity.mgoResumen.anchored.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.anchored.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.mgoResumen.anchored.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.mgoResumen.anchored.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.mgoResumen.anchored.consumption = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.anchored.consumption, 2);


            mailLastVoyage.consumptionActivity.mgoResumen.ballast.activityName = translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.ballast.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity, 2);
            mailLastVoyage.consumptionActivity.mgoResumen.ballast.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.ballast.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.mgoResumen.ballast.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.mgoResumen.ballast.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.mgoResumen.ballast.consumption = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.ballast.consumption, 2);

            mailLastVoyage.consumptionActivity.mgoResumen.discharge.activityName = translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.discharge.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.mgoResumen.discharge.timeActivity = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.discharge.timeActivity, 2);
            mailLastVoyage.consumptionActivity.mgoResumen.discharge.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.discharge.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.mgoResumen.discharge.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.mgoResumen.discharge.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.mgoResumen.discharge.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.discharge.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.mgoResumen.discharge.consumption = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.discharge.consumption, 2);


            mailLastVoyage.consumptionActivity.mgoResumen.economical.activityName = translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.economical.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.mgoResumen.economical.timeActivity = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.economical.timeActivity, 2);
            mailLastVoyage.consumptionActivity.mgoResumen.economical.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.economical.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.mgoResumen.economical.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.mgoResumen.economical.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.mgoResumen.economical.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.economical.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.mgoResumen.economical.consumption = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.economical.consumption, 2);

            mailLastVoyage.consumptionActivity.mgoResumen.laden.activityName = translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.laden.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity, 2);
            mailLastVoyage.consumptionActivity.mgoResumen.laden.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.laden.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.mgoResumen.laden.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.mgoResumen.laden.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.mgoResumen.laden.consumption = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.laden.consumption, 2);

            mailLastVoyage.consumptionActivity.mgoResumen.loading.activityName = translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.loading.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity, 2);
            mailLastVoyage.consumptionActivity.mgoResumen.loading.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.loading.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.mgoResumen.loading.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.mgoResumen.loading.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.mgoResumen.loading.consumption = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.loading.consumption, 2);

            mailLastVoyage.consumptionActivity.mgoResumen.maneuver.activityName = translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.maneuver.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity, 2);
            mailLastVoyage.consumptionActivity.mgoResumen.maneuver.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.maneuver.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.mgoResumen.maneuver.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.mgoResumen.maneuver.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.mgoResumen.maneuver.consumption = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.maneuver.consumption, 2);


            mailLastVoyage.consumptionActivity.mgoResumen.other_act.activityName = translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.other_act.activityName).toLocaleUpperCase();
            mailLastVoyage.consumptionActivity.mgoResumen.other_act.timeActivity = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.other_act.timeActivity, 2);
            mailLastVoyage.consumptionActivity.mgoResumen.other_act.dailyConsumptionCharter = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.other_act.dailyConsumptionCharter, 2);
            if (mailLastVoyage.consumptionActivity.mgoResumen.other_act.timeActivity > 1) {
                mailLastVoyage.consumptionActivity.mgoResumen.other_act.dailyConsumption = mathRound((mailLastVoyage.consumptionActivity.mgoResumen.other_act.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.other_act.timeActivity, 2);
            }
            mailLastVoyage.consumptionActivity.mgoResumen.other_act.consumption = mathRound(mailLastVoyage.consumptionActivity.mgoResumen.other_act.consumption, 2);


            // Devuelvo el contenido obtenido
            return HbsConvertHtmlRender('mailSendLastVoyage.hbs', mailLastVoyage);
        }
    ).then(
        (renderHtml: string) => {

            if (!renderHtml) throw 'Error al renderizar- revisar HbsConvertHtmlRender().';

            // Arreglo de archivos a adjuntar
            let attachments = [
                /*
                {
                  filename: 'export.xlsx',
                  content: fs.createReadStream(SQLITE_PATH + "/export0.7551635636276641.xlsx")
                } 
                */
                {
                    filename: title + '.xlsx',
                    content: bufferFile,
                    contentType:
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
            ];

            // Funcion que envia el correo con adjuntos
            return MailSendSMTP(null, to, title, renderHtml, true, '', '', attachments);
        }
    ).then(
        (resultInfo: boolean) => {
            if (!resultInfo) throw 'La funcion MailSendSMTP no funciono como esperabamos.';

            // Hay que validarlo.
            //resultInfo
            return resultInfo;
        }
    ).catch(
        err => {
            // Obtengo mensajes de error
            const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

            // caso contrario retornamos un error
            throw {
                error: clientMsg,
                message: errorMsg,
            };
        }
    );
}

// Envio de correo de validacion con plantilla html.
export function SendMailHTMLOverCosumption(to: string, name: string,dateSend, listConsumptionLubricant:any): Promise<boolean> {

    //variable de contenido
    let contentHTML: string = '';

    // Inicio una promesa Dummy.
    return DummyPromise().then(
        result => {

            let objRender = {
                nameBuque: name,
                dateSend: dateSend,
                listConsumptionLubricant: listConsumptionLubricant
            }

            console.log(JSON.stringify(listConsumptionLubricant));
            // Devuelvo el contenido obtenido
            return HbsConvertHtmlRender('mailOverconsumptionOil.hbs', objRender);
        }
    ).then(
        (renderHtml: string) => {

            if (!renderHtml) throw 'Error al renderizar- revisar HbsConvertHtmlRender().';

            return MailSendSMTP(null, to, `Information on oil lubricant consumption ${name}.`, renderHtml, true);
        }
    ).then(
        (resultInfo: boolean) => {
            if (!resultInfo) throw 'La funcion MailSendSMTP no funciono como esperabamos.'

            // Hay que validarlo.
            //resultInfo
            return resultInfo;
        }
    ).catch(
        err => {
            // Obtengo mensajes de error
            const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

            // caso contrario retornamos un error
            throw {
                error: clientMsg,
                message: errorMsg,
            };
        }
    );
}

