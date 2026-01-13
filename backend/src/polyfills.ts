/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Polyfill for util.isNullOrUndefined which was deprecated and removed in newer Node.js versions.
 * @nestjs/typeorm (v7) relies on this function.
 */
const util = require('util');

if (typeof util.isNullOrUndefined !== 'function') {
    util.isNullOrUndefined = function (value: any) {
        return value === null || value === undefined;
    };
}
