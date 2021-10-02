"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertMMDDYYYToYYYYMMDD = exports.GetDate = void 0;
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
//# sourceMappingURL=moment.assets.js.map