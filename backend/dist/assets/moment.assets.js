"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertDDMMYYYToYYYYMMDD = exports.getDate = void 0;
const moment = require("moment");
const momentTimezone = require("moment-timezone");
moment.locale();
momentTimezone().tz("America/Los_Angeles").format();
function getDate() {
    return moment().format();
}
exports.getDate = getDate;
function ConvertDDMMYYYToYYYYMMDD(dateDDMMYYY) {
    let date = moment(dateDDMMYYY, "DD/MM/YYYY");
    return new Date(date.format("YYYY/MM/DD"));
}
exports.ConvertDDMMYYYToYYYYMMDD = ConvertDDMMYYYToYYYYMMDD;
//# sourceMappingURL=moment.assets.js.map