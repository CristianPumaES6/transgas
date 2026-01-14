"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./polyfills");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const bodyParser = require("body-parser");
const express = require("express");
const path_config_1 = require("./config/path.config");
const path_1 = require("path");
const nodemailer_assets_1 = require("./assets/nodemailer.assets");
const hbs_assets_1 = require("./assets/hbs.assets");
const server_config_1 = require("./config/server.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const options = {
        'origin': '*',
        'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'preflightContinue': false,
        'optionsSuccessStatus': 204,
        'credentials': true,
    };
    app.use(bodyParser.json({ limit: '50mb' }));
    app.enableCors(options);
    app.use(express.static((0, path_1.join)(path_config_1.FOLDER_UPLOADS)));
    app.use(express.static((0, path_1.join)(path_config_1.FOLDER_STATIC)));
    app.use(express.static((0, path_1.join)(path_config_1.FOLDER_FRONTEND)));
    (0, hbs_assets_1.HbsInit)(app);
    (0, nodemailer_assets_1.NodemailerInit)();
    await app.listen(server_config_1.URL_Server.puertoBackend);
}
bootstrap();
//# sourceMappingURL=main.js.map