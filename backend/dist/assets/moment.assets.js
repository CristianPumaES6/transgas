"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDate = GetDate;
exports.ConvertMMDDYYYToYYYYMMDD = ConvertMMDDYYYToYYYYMMDD;
exports.FormatDateUTCToDateHour = FormatDateUTCToDateHour;
exports.FormatDateUTCToDate = FormatDateUTCToDate;
exports.FormatDateUTCToDateYYYYMM = FormatDateUTCToDateYYYYMM;
exports.ConvertDateUTC_To_FORMAT_UTC = ConvertDateUTC_To_FORMAT_UTC;
exports.Convert_YYYYMMD_To_YYYYMMDD = Convert_YYYYMMD_To_YYYYMMDD;
exports.ConvertDateUTC_To_FORMAT_UTC_Menos5HorasLOCAL = ConvertDateUTC_To_FORMAT_UTC_Menos5HorasLOCAL;
exports.ConvertYYYYMMHH_5HorasLOCAL = ConvertYYYYMMHH_5HorasLOCAL;
exports.ConvertDDMMYYHHMM5HorasLOCAL = ConvertDDMMYYHHMM5HorasLOCAL;
exports.DateDayMonthYear = DateDayMonthYear;
exports.ObtenerlasHorasDeUnaFecaUTC = ObtenerlasHorasDeUnaFecaUTC;
exports.ConvertDateUTC_masUnaCantidadDeHoras = ConvertDateUTC_masUnaCantidadDeHoras;
exports.FormatDateSumDays = FormatDateSumDays;
exports.ConvertMomentUTC = ConvertMomentUTC;
exports.ObtenerHoraDeDosStringUTC = ObtenerHoraDeDosStringUTC;
exports.GetHours = GetHours;
exports.ConvertDDMMYYYYToUTC = ConvertDDMMYYYYToUTC;
exports.ConvertMMDDYYYYToUTC = ConvertMMDDYYYYToUTC;
const moment = require("moment");
const momentTimezone = require("moment-timezone");
moment.locale();
momentTimezone()
    .tz('America/Los_Angeles')
    .format();
function GetDate() {
    return moment().format();
}
function ConvertMMDDYYYToYYYYMMDD(dateMMDDYYY) {
    let date = moment(dateMMDDYYY, 'MM/DD/YYYY');
    return new Date(date.format('YYYY/MM/DD'));
}
function FormatDateUTCToDateHour(dateUTC) {
    let momentDate = moment.utc(dateUTC);
    let local = momentDate.local();
    let format = local.format('MM/DD/YYYY HH:mm');
    return format;
}
function FormatDateUTCToDate(dateUTC) {
    let momentDate = moment.utc(dateUTC);
    let local = momentDate.local();
    let format = local.format('MM/DD/YYYY');
    return format;
}
function FormatDateUTCToDateYYYYMM(dateUTC) {
    let momentDate = moment.utc(dateUTC);
    let local = momentDate.local();
    let format = local.format('YYYY-MM');
    return format;
}
function ConvertDateUTC_To_FORMAT_UTC(dateUTC) {
    let momentDate = moment.utc(dateUTC);
    return momentDate.format('YYYY-MM-DD HH:mm:ss');
}
function Convert_YYYYMMD_To_YYYYMMDD(date) {
    let text = moment(date, ['YYYY-M-D', 'YYYY-MM-DD']).format('YYYY-MM-DD');
    return text;
}
function ConvertDateUTC_To_FORMAT_UTC_Menos5HorasLOCAL(dateUTC) {
    let momentDate = moment.utc(dateUTC).subtract(5, 'hours');
    return momentDate.format('YYYY-MM-DD HH:mm:ss');
}
function ConvertYYYYMMHH_5HorasLOCAL(dateUTC, addHour) {
    let mommentTemporal = moment.utc(dateUTC, 'YYYY-MM-DD HH:mm');
    let momentDate = mommentTemporal.subtract(addHour, 'hours');
    return momentDate.format('YYYY-MM-DD HH:mm:ss').replace(" ", "T") + "Z";
    ;
}
function ConvertDDMMYYHHMM5HorasLOCAL(dateUTC, addHour) {
    let mommentTemporal = moment.utc(dateUTC, 'DD/MM/YY HH:mm');
    let momentDate = mommentTemporal.subtract(addHour, 'hours');
    return momentDate.format('YYYY-MM-DD HH:mm:ss');
}
function DateDayMonthYear(dateDDMMYYYY) {
    console.log(dateDDMMYYYY);
    let date = moment.utc(dateDDMMYYYY, 'DD/MM/YYYY');
    console.log(date);
    let formatDate = date.format('YYYY-MM-DD');
    console.log(formatDate);
    return formatDate;
}
function ObtenerlasHorasDeUnaFecaUTC(dateUTC) {
    let hour = dateUTC.substr(11, 5);
    return hour;
}
function ConvertDateUTC_masUnaCantidadDeHoras(dateUTC, horas) {
    let momentDate = moment.utc(dateUTC, 'DD/MM/YYYY').add(horas, 'h');
    return momentDate.format('YYYY-MM-DD HH:mm:ss');
}
function FormatDateSumDays(dateUTC, subtractDays) {
    let momentDate = moment.utc(dateUTC);
    let subtract = momentDate.subtract(subtractDays, 'days');
    return subtract.format('YYYY-MM-DD HH:mm:ss') + 'Z';
}
function ConvertMomentUTC(dateUTC) {
    return moment.utc(dateUTC);
}
function ObtenerHoraDeDosStringUTC(fechaUTC, fechaUTC2) {
    let result = 0;
    let fecha1 = moment.utc(fechaUTC);
    let fecha2 = moment.utc(fechaUTC2);
    var duration = moment.duration(fecha1.diff(fecha2));
    result = duration.asHours();
    return result;
}
function GetHours() {
    return moment().format('HH mm ss');
}
function ConvertDDMMYYYYToUTC(dateDDMMYYYY) {
    let momentDate = moment(dateDDMMYYYY, 'DD/MM/YYYY');
    return moment(momentDate, 'YYYY-MM-DD HH:mm')
        .utc()
        .format('YYYY-MM-DDTHH:mm:ssZ');
}
function ConvertMMDDYYYYToUTC(dateDDMMYYYY) {
    let momentDate = moment(dateDDMMYYYY, 'MM/DD/YYYY');
    return moment(momentDate, 'YYYY-MM-DD HH:mm')
        .utc()
        .format('YYYY-MM-DDTHH:mm:ssZ');
}
//# sourceMappingURL=moment.assets.js.map