"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertDDMMYYYToYYYYMMDD = exports.GetDate = void 0;
const moment = require("moment");
const momentTimezone = require("moment-timezone");
moment.locale();
momentTimezone().tz("America/Los_Angeles").format();
function GetDate() {
    return moment().format();
}
exports.GetDate = GetDate;
function ConvertDDMMYYYToYYYYMMDD(dateDDMMYYY) {
    let date = moment(dateDDMMYYY, "MM/DD/YYYY");
    return new Date(date.format("YYYY/MM/DD"));
}
exports.ConvertDDMMYYYToYYYYMMDD = ConvertDDMMYYYToYYYYMMDD;
//# sourceMappingURL=moment.assets.js.map