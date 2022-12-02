import * as nodemailer from 'nodemailer';

// modulos de node
import * as path from 'path';

// Modelos
import { UserEntity } from '../models/user.entity';

// Assets || Si es una class lo tego que poner en el constructor y como proverdor del modulo
import { DummyPromise } from './promises.assets';
import { ReadFileContent } from './file-manager.assets';
import { HbsConvertHtmlRender } from './hbs.assets'

//Interface
import { NestExpressApplication } from '@nestjs/platform-express';

// Template config
import { TEMPLATE_MAIL_PATH } from '../config/path.config';
import { MailOptions } from '../models/assets/mailOptions.model';


let mailServer;

// Funcion para inicializar el engine de templating
export function NodemailerInit(): Promise<boolean> {

    // Armo promesa para devolver
    return DummyPromise().then(
        (result: boolean) => {

            let email = 'transgasshippinglines@gmail.com';
            let password = 'ybtfkfmdswtkansn';

            // Create reusable transporter object using the default SMTP transport
            mailServer = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: email, // generated ethereal user
                    pass: password // generated ethereal password
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

            return MailSendSMTP(null, to, 'Correo de confirmación API SUNAT  ✔ ✔', renderHtml, true);
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
                url: 'localhost:4200?token='+token,
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