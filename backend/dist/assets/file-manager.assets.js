"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadFileContent = ReadFileContent;
const fs = require("fs");
function ReadFileContent(fileName, encode, safe) {
    return new Promise(function (resolve, reject) {
        try {
            fs.readFile(fileName, encode, function (err, data) {
                if (err) {
                    if (safe)
                        return resolve(null);
                    else
                        return reject(err);
                }
                else {
                    return resolve(data);
                }
            });
        }
        catch (e) {
            if (safe)
                resolve(null);
            else
                reject(e);
        }
    });
}
//# sourceMappingURL=file-manager.assets.js.map