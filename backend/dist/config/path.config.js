"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOLDER_FRONTEND = exports.FOLDER_STATIC = exports.FOLDER_UPLOADS = exports.SQLITE_PATH = void 0;
const path = require("path");
exports.SQLITE_PATH = path.resolve(__dirname, '../..', '');
exports.FOLDER_UPLOADS = path.resolve(__dirname, '../..', 'IMAGE_UPLOADS');
exports.FOLDER_STATIC = path.resolve(__dirname, '../..', 'STATIC');
exports.FOLDER_FRONTEND = path.resolve(__dirname, '../../..', 'frontend', 'dist', 'frontend');
//# sourceMappingURL=path.config.js.map