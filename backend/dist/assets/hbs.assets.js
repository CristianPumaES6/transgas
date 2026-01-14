"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHbsHtml = GetHbsHtml;
exports.HbsInit = HbsInit;
exports.HbsConvertHtmlRender = HbsConvertHtmlRender;
const hbs = require("hbs");
const path = require("path");
const path_config_1 = require("../config/path.config");
const promises_assets_1 = require("./promises.assets");
const file_manager_assets_1 = require("./file-manager.assets");
let hbsHtml;
function GetHbsHtml() {
    return hbsHtml;
}
function HbsInit(app) {
    return (0, promises_assets_1.DummyPromise)().then((result) => {
        hbsHtml = hbs.create();
        app.engine('html', hbsHtml.__express);
        return true;
    });
}
function HbsConvertHtmlRender(fileHbs, objRender) {
    let contentHTML = '';
    return (0, promises_assets_1.DummyPromise)().then((result) => {
        let originalFileFullPath = path.join(path_config_1.TEMPLATE_MAIL_PATH, fileHbs);
        return (0, file_manager_assets_1.ReadFileContent)(originalFileFullPath, 'utf8');
    }).then((resultContent) => {
        if (!resultContent)
            throw Error('revisar la funcion ReadFileContent.');
        contentHTML = resultContent;
        return GetHbsHtml();
    }).then((resultHbsHtml) => {
        if (!resultHbsHtml)
            throw 'No se pudo inicializar engine para generación de HTML';
        let theme = resultHbsHtml.compile(contentHTML);
        let renderHtml = theme(objRender);
        return renderHtml;
    });
}
//# sourceMappingURL=hbs.assets.js.map