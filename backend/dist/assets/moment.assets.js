"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateUTCToDateHour = exports.ConvertMMDDYYYToYYYYMMDD = exports.GetDate = void 0;
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
//# sourceMappingURL=moment.assets.js.map