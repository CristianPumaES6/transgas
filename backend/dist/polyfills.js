const util = require('util');
if (typeof util.isNullOrUndefined !== 'function') {
    util.isNullOrUndefined = function (value) {
        return value === null || value === undefined;
    };
}
//# sourceMappingURL=polyfills.js.map