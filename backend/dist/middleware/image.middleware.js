"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditFileName = exports.ImageFileFilter = void 0;
const path_1 = require("path");
const ImageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};
exports.ImageFileFilter = ImageFileFilter;
const EditFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = (0, path_1.extname)(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};
exports.EditFileName = EditFileName;
//# sourceMappingURL=image.middleware.js.map