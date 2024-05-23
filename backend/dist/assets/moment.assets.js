"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHours = exports.ObtenerHoraDeDosStringUTC = exports.ConvertMomentUTC = exports.FormatDateSumDays = exports.ConvertDateUTC_masUnaCantidadDeHoras = exports.ObtenerlasHorasDeUnaFecaUTC = exports.DateDayMonthYear = exports.ConvertDDMMYYHHMM5HorasLOCAL = exports.ConvertDateUTC_To_FORMAT_UTC_Menos5HorasLOCAL = exports.Convert_YYYYMMD_To_YYYYMMDD = exports.ConvertDateUTC_To_FORMAT_UTC = exports.FormatDateUTCToDate = exports.FormatDateUTCToDateHour = exports.ConvertMMDDYYYToYYYYMMDD = exports.GetDate = void 0;
const moment = require("moment");
const momentTimezone = require("moment-timezone");
moment.locale();
momentTimezone().tz("America/Los_Angeles").format();
function GetDate() {
    return moment().format();
}
exports.GetDate = GetDate;
function ConvertMMDDYYYToYYYYMMDD(dateMMDDYYY) {
    let date = moment(dateMMDDYYY, "MM/DD/YYYY");
    return new Date(date.format("YYYY/MM/DD"));
}
exports.ConvertMMDDYYYToYYYYMMDD = ConvertMMDDYYYToYYYYMMDD;
function FormatDateUTCToDateHour(dateUTC) {
    let momentDate = moment.utc(dateUTC);
    let local = momentDate.local();
    let format = local.format('MM/DD/YYYY HH:mm');
    return format;
}
exports.FormatDateUTCToDateHour = FormatDateUTCToDateHour;
function FormatDateUTCToDate(dateUTC) {
    let momentDate = moment.utc(dateUTC);
    let local = momentDate.local();
    let format = local.format('MM/DD/YYYY');
    return format;
}
exports.FormatDateUTCToDate = FormatDateUTCToDate;
function ConvertDateUTC_To_FORMAT_UTC(dateUTC) {
    let momentDate = moment.utc(dateUTC);
    return momentDate.format('YYYY-MM-DD HH:mm:ss');
}
exports.ConvertDateUTC_To_FORMAT_UTC = ConvertDateUTC_To_FORMAT_UTC;
function Convert_YYYYMMD_To_YYYYMMDD(date) {
    let text = moment(date, ['YYYY-M-D', 'YYYY-MM-DD']).format('YYYY-MM-DD');
    return text;
}
exports.Convert_YYYYMMD_To_YYYYMMDD = Convert_YYYYMMD_To_YYYYMMDD;
function ConvertDateUTC_To_FORMAT_UTC_Menos5HorasLOCAL(dateUTC) {
    let momentDate = moment.utc(dateUTC).subtract(5, 'hours');
    return momentDate.format('YYYY-MM-DD HH:mm:ss');
}
exports.ConvertDateUTC_To_FORMAT_UTC_Menos5HorasLOCAL = ConvertDateUTC_To_FORMAT_UTC_Menos5HorasLOCAL;
function ConvertDDMMYYHHMM5HorasLOCAL(dateUTC, addHour) {
    let mommentTemporal = moment.utc(dateUTC, "DD/MM/YY HH:mm");
    let momentDate = mommentTemporal.subtract(addHour, 'hours');
    return momentDate.format('YYYY-MM-DD HH:mm:ss');
}
exports.ConvertDDMMYYHHMM5HorasLOCAL = ConvertDDMMYYHHMM5HorasLOCAL;
function DateDayMonthYear(dateDDMMYYYY) {
    console.log(dateDDMMYYYY);
    let date = moment.utc(dateDDMMYYYY, "DD/MM/YYYY");
    console.log(date);
    let formatDate = date.format('YYYY-MM-DD');
    console.log(formatDate);
    return formatDate;
}
exports.DateDayMonthYear = DateDayMonthYear;
function ObtenerlasHorasDeUnaFecaUTC(dateUTC) {
    let hour = dateUTC.substr(11, 5);
    return hour;
}
exports.ObtenerlasHorasDeUnaFecaUTC = ObtenerlasHorasDeUnaFecaUTC;
function ConvertDateUTC_masUnaCantidadDeHoras(dateUTC, horas) {
    let momentDate = moment.utc(dateUTC, "DD/MM/YYYY").add(horas, 'h');
    return momentDate.format('YYYY-MM-DD HH:mm:ss');
}
exports.ConvertDateUTC_masUnaCantidadDeHoras = ConvertDateUTC_masUnaCantidadDeHoras;
function FormatDateSumDays(dateUTC, subtractDays) {
    let momentDate = moment.utc(dateUTC);
    let subtract = momentDate.subtract(subtractDays, 'days');
    return subtract.format('YYYY-MM-DD HH:mm:ss') + 'Z';
}
exports.FormatDateSumDays = FormatDateSumDays;
function ConvertMomentUTC(dateUTC) {
    return moment.utc(dateUTC);
}
exports.ConvertMomentUTC = ConvertMomentUTC;
function ObtenerHoraDeDosStringUTC(fechaUTC, fechaUTC2) {
    let result = 0;
    let fecha1 = moment.utc(fechaUTC);
    let fecha2 = moment.utc(fechaUTC2);
    var duration = moment.duration(fecha1.diff(fecha2));
    result = duration.asHours();
    return result;
}
exports.ObtenerHoraDeDosStringUTC = ObtenerHoraDeDosStringUTC;
function GetHours() {
    return moment().format('HH mm ss');
}
exports.GetHours = GetHours;
//# sourceMappingURL=moment.assets.js.map