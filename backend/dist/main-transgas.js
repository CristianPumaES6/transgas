"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express = require("express");
const path_config_1 = require("./config/path.config");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const options = {
        'origin': '*',
        'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'preflightContinue': false,
        'optionsSuccessStatus': 204,
        'credentials': true,
    };
    app.enableCors(options);
    app.use(express.static(path_1.join(path_config_1.FOLDER_UPLOADS)));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main-transgas.js.map