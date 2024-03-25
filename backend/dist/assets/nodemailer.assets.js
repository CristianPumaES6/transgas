"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMailHTMLOverCosumption = exports.SendMailHTMLLubricante = exports.SendMailArchiveInfoLastVoyage = exports.SendMailForgotPsw = exports.SendMailHTMLValidate = exports.MailSendSMTP = exports.NodemailerInit = void 0;
const nodemailer = require("nodemailer");
const promises_assets_1 = require("./promises.assets");
const hbs_assets_1 = require("./hbs.assets");
const sendMailConfig_1 = require("../models/sendMailConfig");
const moment_assets_1 = require("./moment.assets");
const math_assets_1 = require("./math.assets");
const translate_assets_1 = require("./translate.assets");
let mailServer;
function NodemailerInit() {
    return promises_assets_1.DummyPromise().then((result) => {
        let email = 'transgasshippinglines@gmail.com';
        let password = 'ybtfkfmdswtkansn';
        mailServer = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        });
        return mailServer.verify();
    }).then((resultVerify) => {
        if (!resultVerify)
            throw Error('MailServer.verify() no respondio como esperabamos.');
        return resultVerify;
    }).catch(error => {
        console.log(('NodemailerInit() \'' + error + '\' - revisar NodemailerInit()'));
        return false;
    });
    ;
}
exports.NodemailerInit = NodemailerInit;
function MailSendSMTP(from, to, subject, body, htmlBody, cc, bcc, attachments) {
    let mailOptions = {
        from: from,
        to: to,
        subject: subject
    };
    if (htmlBody)
        mailOptions.html = body;
    else
        mailOptions.text = body;
    if (cc)
        mailOptions.cc = cc;
    if (bcc)
        mailOptions.bcc = bcc;
    if (attachments)
        mailOptions.attachments = attachments;
    return promises_assets_1.DummyPromise().then((result) => {
        return mailServer.sendMail(mailOptions);
    }).then((resultInfo) => {
        if (!resultInfo)
            throw Error('la funcion mailServer.sendMail no respondio como esperabamos.');
        console.log('Envío de mail realizado correctamente: \'' + resultInfo + '\'');
        return true;
    }).catch(err => {
        const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUES_MailSendSMTPT');
        const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST_MailSendSMTP');
        throw {
            error: clientMsg,
            message: errorMsg,
        };
    });
}
exports.MailSendSMTP = MailSendSMTP;
function SendMailHTMLValidate(to, name, token) {
    let contentHTML = '';
    return promises_assets_1.DummyPromise().then(result => {
        let objRender = {
            name: name,
            url: 'localhost:3000',
            token: token,
        };
        return hbs_assets_1.HbsConvertHtmlRender('suscription.hbs', objRender);
    }).then((renderHtml) => {
        if (!renderHtml)
            throw 'Error al renderizar- revisar HbsConvertHtmlRender().';
        return MailSendSMTP(null, to, 'Correo de confirmación PERFORMANCE  ✔ ✔', renderHtml, true);
    }).then((resultInfo) => {
        if (!resultInfo)
            throw 'La funcion MailSendSMTP no funciono como esperabamos.';
        return resultInfo;
    }).catch(err => {
        const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
        const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
        throw {
            error: clientMsg,
            message: errorMsg,
        };
    });
}
exports.SendMailHTMLValidate = SendMailHTMLValidate;
function SendMailForgotPsw(to, name, token) {
    let contentHTML = '';
    return promises_assets_1.DummyPromise().then(result => {
        let objRender = {
            name: name,
            url: 'localhost:4200?token=' + token,
        };
        return hbs_assets_1.HbsConvertHtmlRender('mailForgotPsw.hbs', objRender);
    }).then((renderHtml) => {
        if (!renderHtml)
            throw 'Error al renderizar- revisar HbsConvertHtmlRender().';
        return MailSendSMTP(null, to, 'Solicitud de Cambio de contraseña - API SUNAT  ✔ ✔', renderHtml, true);
    }).then((resultInfo) => {
        if (!resultInfo)
            throw 'La funcion MailSendSMTP no funciono como esperabamos.';
        return resultInfo;
    }).catch(err => {
        const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
        const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
        throw {
            error: clientMsg,
            message: errorMsg,
        };
    });
}
exports.SendMailForgotPsw = SendMailForgotPsw;
function SendMailArchiveInfoLastVoyage(to, name, title, bufferFile, mailLastVoyage) {
    let contentHTML = '';
    return promises_assets_1.DummyPromise().then(result => {
        mailLastVoyage.dateCurrent = moment_assets_1.ConvertDateUTC_To_FORMAT_UTC(mailLastVoyage.dateCurrent) + ' GMT';
        mailLastVoyage.currentVLSFO = math_assets_1.mathRound(mailLastVoyage.currentVLSFO, 2);
        mailLastVoyage.currentMGO = math_assets_1.mathRound(mailLastVoyage.currentMGO, 2);
        mailLastVoyage.bunkeringIFO = math_assets_1.mathRound(mailLastVoyage.bunkeringIFO, 2);
        mailLastVoyage.bunkeringMGO = math_assets_1.mathRound(mailLastVoyage.bunkeringMGO, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.anchored.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.anchored.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.anchored.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.anchored.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.anchored.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.ifoResumen.anchored.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.anchored.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.anchored.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.ballast.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.ballast.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.ballast.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.ballast.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.ballast.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.ifoResumen.ballast.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.ballast.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.ballast.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.discharge.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.discharge.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.discharge.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.discharge.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.discharge.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.discharge.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.discharge.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.discharge.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.ifoResumen.discharge.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.discharge.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.discharge.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.discharge.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.economical.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.economical.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.economical.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.economical.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.economical.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.economical.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.economical.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.economical.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.ifoResumen.economical.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.economical.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.economical.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.economical.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.laden.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.laden.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.ifoResumen.laden.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.laden.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.laden.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.loading.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.loading.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.loading.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.loading.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.loading.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.ifoResumen.loading.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.loading.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.loading.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.maneuver.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.maneuver.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.maneuver.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.maneuver.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.maneuver.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.ifoResumen.maneuver.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.maneuver.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.maneuver.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.other_act.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.ifoResumen.other_act.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.other_act.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.other_act.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.other_act.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.other_act.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.other_act.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.other_act.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.ifoResumen.other_act.consumption * 24) / mailLastVoyage.consumptionActivity.ifoResumen.other_act.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.other_act.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.ifoResumen.other_act.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.anchored.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.anchored.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.anchored.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.anchored.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.anchored.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.mgoResumen.anchored.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.anchored.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.anchored.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.ballast.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.ballast.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.ballast.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.ballast.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.ballast.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.mgoResumen.ballast.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.ballast.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.ballast.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.discharge.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.discharge.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.discharge.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.discharge.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.discharge.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.discharge.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.discharge.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.discharge.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.mgoResumen.discharge.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.discharge.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.discharge.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.discharge.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.economical.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.economical.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.economical.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.economical.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.economical.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.economical.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.economical.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.economical.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.mgoResumen.economical.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.economical.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.economical.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.economical.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.laden.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.laden.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.laden.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.laden.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.laden.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.mgoResumen.laden.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.laden.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.laden.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.loading.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.loading.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.loading.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.loading.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.loading.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.mgoResumen.loading.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.loading.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.loading.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.maneuver.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.maneuver.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.maneuver.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.maneuver.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.maneuver.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.mgoResumen.maneuver.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.maneuver.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.maneuver.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.other_act.activityName = translate_assets_1.translateActivity(mailLastVoyage.consumptionActivity.mgoResumen.other_act.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.other_act.timeActivity = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.other_act.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.other_act.dailyConsumptionCharter = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.other_act.dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.other_act.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.other_act.dailyConsumption = math_assets_1.mathRound((mailLastVoyage.consumptionActivity.mgoResumen.other_act.consumption * 24) / mailLastVoyage.consumptionActivity.mgoResumen.other_act.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.other_act.consumption = math_assets_1.mathRound(mailLastVoyage.consumptionActivity.mgoResumen.other_act.consumption, 2);
        return hbs_assets_1.HbsConvertHtmlRender('mailSendLastVoyage.hbs', mailLastVoyage);
    }).then((renderHtml) => {
        if (!renderHtml)
            throw 'Error al renderizar- revisar HbsConvertHtmlRender().';
        let attachments = [
            {
                filename: title + '.xlsx',
                content: bufferFile,
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        ];
        return MailSendSMTP(null, to, title, renderHtml, true, '', '', attachments);
    }).then((resultInfo) => {
        if (!resultInfo)
            throw 'La funcion MailSendSMTP no funciono como esperabamos.';
        return resultInfo;
    }).catch(err => {
        const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
        const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
        throw {
            error: clientMsg,
            message: errorMsg,
        };
    });
}
exports.SendMailArchiveInfoLastVoyage = SendMailArchiveInfoLastVoyage;
function SendMailHTMLLubricante(to, texto) {
    let contentHTML = '';
    return promises_assets_1.DummyPromise().then(result => {
        return MailSendSMTP(null, to, 'TEST LUBRICANTE' + texto, texto, true);
    }).then((resultInfo) => {
        if (!resultInfo)
            throw 'La funcion MailSendSMTP no funciono como esperabamos.';
        return resultInfo;
    }).catch(err => {
        const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
        const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
        throw {
            error: clientMsg,
            message: errorMsg,
        };
    });
}
exports.SendMailHTMLLubricante = SendMailHTMLLubricante;
function SendMailHTMLOverCosumption(to, name, dateSend, listConsumptionLubricant) {
    let contentHTML = '';
    return promises_assets_1.DummyPromise().then(result => {
        let objRender = {
            nameBuque: name,
            dateSend: dateSend,
            listConsumptionLubricant: listConsumptionLubricant
        };
        return hbs_assets_1.HbsConvertHtmlRender('mailOverconsumptionOil.hbs', objRender);
    }).then((renderHtml) => {
        if (!renderHtml)
            throw 'Error al renderizar- revisar HbsConvertHtmlRender().';
        return MailSendSMTP(null, to, 'Information on lubricant overconsumption.', renderHtml, true);
    }).then((resultInfo) => {
        if (!resultInfo)
            throw 'La funcion MailSendSMTP no funciono como esperabamos.';
        return resultInfo;
    }).catch(err => {
        const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
        const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
        throw {
            error: clientMsg,
            message: errorMsg,
        };
    });
}
exports.SendMailHTMLOverCosumption = SendMailHTMLOverCosumption;
//# sourceMappingURL=nodemailer.assets.js.map