"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerInit = NodemailerInit;
exports.MailSendSMTP = MailSendSMTP;
exports.SendMailHTMLValidate = SendMailHTMLValidate;
exports.SendMailForgotPsw = SendMailForgotPsw;
exports.SendMailArchiveInfoLastVoyage = SendMailArchiveInfoLastVoyage;
exports.SendMailHTMLOverCosumption = SendMailHTMLOverCosumption;
const nodemailer = require("nodemailer");
const promises_assets_1 = require("./promises.assets");
const hbs_assets_1 = require("./hbs.assets");
const moment_assets_1 = require("./moment.assets");
const math_assets_1 = require("./math.assets");
const translate_assets_1 = require("./translate.assets");
const server_config_1 = require("../config/server.config");
let mailServer;
function NodemailerInit() {
    return (0, promises_assets_1.DummyPromise)()
        .then((result) => {
        let email = 'transgasshippinglines@gmail.com';
        let password = 'getlsmyuiluiwktq';
        mailServer = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: server_config_1.URL_Server.emailNotification,
                pass: server_config_1.URL_Server.passwordNotification,
            },
        });
        return mailServer.verify();
    })
        .then((resultVerify) => {
        if (!resultVerify)
            throw Error('MailServer.verify() no respondio como esperabamos.');
        return resultVerify;
    })
        .catch(error => {
        console.log("NodemailerInit() '" + error + "' - revisar NodemailerInit()");
        return false;
    });
}
function MailSendSMTP(from, to, subject, body, htmlBody, cc, bcc, attachments) {
    let mailOptions = {
        from: from,
        to: to,
        subject: subject,
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
    return (0, promises_assets_1.DummyPromise)()
        .then((result) => {
        return mailServer.sendMail(mailOptions);
    })
        .then((resultInfo) => {
        if (!resultInfo)
            throw Error('la funcion mailServer.sendMail no respondio como esperabamos.');
        console.log("Envío de mail realizado correctamente: '" + resultInfo + "'");
        return true;
    })
        .catch(err => {
        const clientMsg = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUES_MailSendSMTPT';
        const errorMsg = typeof err === 'string'
            ? err
            : err.message || err.description || 'ERROR_EXEC_REQUEST_MailSendSMTP';
        throw {
            error: clientMsg,
            message: errorMsg,
        };
    });
}
function SendMailHTMLValidate(to, name, token) {
    let contentHTML = '';
    return (0, promises_assets_1.DummyPromise)()
        .then(result => {
        let objRender = {
            name: name,
            url: 'localhost:3000',
            token: token,
        };
        return (0, hbs_assets_1.HbsConvertHtmlRender)('suscription.hbs', objRender);
    })
        .then((renderHtml) => {
        if (!renderHtml)
            throw 'Error al renderizar- revisar HbsConvertHtmlRender().';
        return MailSendSMTP(null, to, 'Correo de confirmación PERFORMANCE  ✔ ✔', renderHtml, true);
    })
        .then((resultInfo) => {
        if (!resultInfo)
            throw 'La funcion MailSendSMTP no funciono como esperabamos.';
        return resultInfo;
    })
        .catch(err => {
        const clientMsg = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
        const errorMsg = typeof err === 'string'
            ? err
            : err.message || err.description || 'ERROR_EXEC_REQUEST';
        throw {
            error: clientMsg,
            message: errorMsg,
        };
    });
}
function SendMailForgotPsw(to, name, token) {
    let contentHTML = '';
    return (0, promises_assets_1.DummyPromise)()
        .then(result => {
        let objRender = {
            name: name,
            url: 'localhost:4200?token=' + token,
        };
        return (0, hbs_assets_1.HbsConvertHtmlRender)('mailForgotPsw.hbs', objRender);
    })
        .then((renderHtml) => {
        if (!renderHtml)
            throw 'Error al renderizar- revisar HbsConvertHtmlRender().';
        return MailSendSMTP(null, to, 'Solicitud de Cambio de contraseña - API SUNAT  ✔ ✔', renderHtml, true);
    })
        .then((resultInfo) => {
        if (!resultInfo)
            throw 'La funcion MailSendSMTP no funciono como esperabamos.';
        return resultInfo;
    })
        .catch(err => {
        const clientMsg = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
        const errorMsg = typeof err === 'string'
            ? err
            : err.message || err.description || 'ERROR_EXEC_REQUEST';
        throw {
            error: clientMsg,
            message: errorMsg,
        };
    });
}
function SendMailArchiveInfoLastVoyage(to, name, title, bufferFile, mailLastVoyage) {
    let contentHTML = '';
    return (0, promises_assets_1.DummyPromise)()
        .then(result => {
        mailLastVoyage.dateCurrent =
            (0, moment_assets_1.ConvertDateUTC_To_FORMAT_UTC)(mailLastVoyage.dateCurrent) + ' GMT';
        mailLastVoyage.currentVLSFO = (0, math_assets_1.mathRound)(mailLastVoyage.currentVLSFO, 2);
        mailLastVoyage.currentMGO = (0, math_assets_1.mathRound)(mailLastVoyage.currentMGO, 2);
        mailLastVoyage.bunkeringIFO = (0, math_assets_1.mathRound)(mailLastVoyage.bunkeringIFO, 2);
        mailLastVoyage.bunkeringMGO = (0, math_assets_1.mathRound)(mailLastVoyage.bunkeringMGO, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.anchored.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.ifoResumen.anchored.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.anchored.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.anchored
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.anchored.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.ifoResumen.anchored.consumption *
                24) /
                mailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.anchored.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.anchored.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.ballast.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.ifoResumen.ballast.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.ballast.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.ballast
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.ballast.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.ifoResumen.ballast.consumption *
                24) /
                mailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.ballast.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.ballast.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.discharge.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.ifoResumen.discharge.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.discharge.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.discharge.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.discharge.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.discharge
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.discharge.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.discharge.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.ifoResumen.discharge.consumption *
                24) /
                mailLastVoyage.consumptionActivity.ifoResumen.discharge
                    .timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.discharge.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.discharge.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.economical.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.ifoResumen.economical.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.economical.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.economical.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.economical.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.economical
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.economical.timeActivity >
            1) {
            mailLastVoyage.consumptionActivity.ifoResumen.economical.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.ifoResumen.economical
                .consumption *
                24) /
                mailLastVoyage.consumptionActivity.ifoResumen.economical
                    .timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.economical.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.economical.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.laden.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.ifoResumen.laden.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.laden
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.ifoResumen.laden.consumption *
                24) /
                mailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.laden.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.laden.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.loading.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.ifoResumen.loading.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.loading.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.loading
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.loading.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.ifoResumen.loading.consumption *
                24) /
                mailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.loading.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.loading.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.maneuver.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.ifoResumen.maneuver.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.maneuver.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.maneuver
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.maneuver.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.ifoResumen.maneuver.consumption *
                24) /
                mailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.maneuver.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.maneuver.consumption, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.other_act.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.ifoResumen.other_act.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.ifoResumen.other_act.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.other_act.timeActivity, 2);
        mailLastVoyage.consumptionActivity.ifoResumen.other_act.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.other_act
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.ifoResumen.other_act.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.ifoResumen.other_act.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.ifoResumen.other_act.consumption *
                24) /
                mailLastVoyage.consumptionActivity.ifoResumen.other_act
                    .timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.ifoResumen.other_act.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.ifoResumen.other_act.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.anchored.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.mgoResumen.anchored.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.anchored.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.anchored
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.anchored.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.mgoResumen.anchored.consumption *
                24) /
                mailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.anchored.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.anchored.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.ballast.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.mgoResumen.ballast.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.ballast.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.ballast
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.ballast.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.mgoResumen.ballast.consumption *
                24) /
                mailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.ballast.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.ballast.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.discharge.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.mgoResumen.discharge.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.discharge.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.discharge.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.discharge.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.discharge
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.discharge.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.discharge.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.mgoResumen.discharge.consumption *
                24) /
                mailLastVoyage.consumptionActivity.mgoResumen.discharge
                    .timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.discharge.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.discharge.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.economical.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.mgoResumen.economical.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.economical.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.economical.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.economical.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.economical
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.economical.timeActivity >
            1) {
            mailLastVoyage.consumptionActivity.mgoResumen.economical.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.mgoResumen.economical
                .consumption *
                24) /
                mailLastVoyage.consumptionActivity.mgoResumen.economical
                    .timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.economical.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.economical.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.laden.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.mgoResumen.laden.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.laden.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.laden
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.laden.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.mgoResumen.laden.consumption *
                24) /
                mailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.laden.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.laden.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.loading.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.mgoResumen.loading.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.loading.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.loading
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.loading.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.mgoResumen.loading.consumption *
                24) /
                mailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.loading.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.loading.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.maneuver.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.mgoResumen.maneuver.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.maneuver.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.maneuver
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.maneuver.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.mgoResumen.maneuver.consumption *
                24) /
                mailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.maneuver.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.maneuver.consumption, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.other_act.activityName = (0, translate_assets_1.translateActivity)(mailLastVoyage.consumptionActivity.mgoResumen.other_act.activityName).toLocaleUpperCase();
        mailLastVoyage.consumptionActivity.mgoResumen.other_act.timeActivity = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.other_act.timeActivity, 2);
        mailLastVoyage.consumptionActivity.mgoResumen.other_act.dailyConsumptionCharter = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.other_act
            .dailyConsumptionCharter, 2);
        if (mailLastVoyage.consumptionActivity.mgoResumen.other_act.timeActivity > 1) {
            mailLastVoyage.consumptionActivity.mgoResumen.other_act.dailyConsumption = (0, math_assets_1.mathRound)((mailLastVoyage.consumptionActivity.mgoResumen.other_act.consumption *
                24) /
                mailLastVoyage.consumptionActivity.mgoResumen.other_act
                    .timeActivity, 2);
        }
        mailLastVoyage.consumptionActivity.mgoResumen.other_act.consumption = (0, math_assets_1.mathRound)(mailLastVoyage.consumptionActivity.mgoResumen.other_act.consumption, 2);
        return (0, hbs_assets_1.HbsConvertHtmlRender)('mailSendLastVoyage.hbs', mailLastVoyage);
    })
        .then((renderHtml) => {
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
    })
        .then((resultInfo) => {
        if (!resultInfo)
            throw 'La funcion MailSendSMTP no funciono como esperabamos.';
        return resultInfo;
    })
        .catch(err => {
        const clientMsg = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
        const errorMsg = typeof err === 'string'
            ? err
            : err.message || err.description || 'ERROR_EXEC_REQUEST';
        throw {
            error: clientMsg,
            message: errorMsg,
        };
    });
}
function SendMailHTMLOverCosumption(to, name, dateSend, listConsumptionLubricant) {
    let contentHTML = '';
    return (0, promises_assets_1.DummyPromise)()
        .then(result => {
        let objRender = {
            nameBuque: name,
            dateSend: dateSend,
            listConsumptionLubricant: listConsumptionLubricant,
        };
        console.log(JSON.stringify(listConsumptionLubricant));
        return (0, hbs_assets_1.HbsConvertHtmlRender)('mailOverconsumptionOil.hbs', objRender);
    })
        .then((renderHtml) => {
        if (!renderHtml)
            throw 'Error al renderizar- revisar HbsConvertHtmlRender().';
        return MailSendSMTP(null, to, `Information on oil lubricant consumption ${name}.`, renderHtml, true);
    })
        .then((resultInfo) => {
        if (!resultInfo)
            throw 'La funcion MailSendSMTP no funciono como esperabamos.';
        return resultInfo;
    })
        .catch(err => {
        const clientMsg = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
        const errorMsg = typeof err === 'string'
            ? err
            : err.message || err.description || 'ERROR_EXEC_REQUEST';
        throw {
            error: clientMsg,
            message: errorMsg,
        };
    });
}
//# sourceMappingURL=nodemailer.assets.js.map