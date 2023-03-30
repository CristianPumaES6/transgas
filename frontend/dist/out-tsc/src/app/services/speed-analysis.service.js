import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { LanguageService } from './language.service';
import { Workbook } from "exceljs";
import * as fs from 'file-saver';
let SpeedAnalysisService = class SpeedAnalysisService {
    constructor(languageService) {
        this.languageService = languageService;
        this.userLanguage = this.languageService.GetCurrentLanguage();
        this.translateCategory = 'speedAnalysis';
    }
    async DowloadExcelDataLocal(BuqueName, listReportVPD) {
        // Creamos una nueva hoja de trabajo
        let workbook = new Workbook();
        workbook.creator = 'codev.site';
        let textHoja = 'Data local ' + BuqueName;
        let textDocDownload = 'Data local ' + BuqueName;
        return await Promise.resolve(true)
            .then(result => {
            // Agregamos la hoja de trabajo.
            let worksheet = workbook.addWorksheet(textHoja);
            // Agregamos las columnas que tendra nuestro excel
            worksheet.columns = [
                { header: 'userId', key: 'userId' },
                { header: 'year', key: 'year' },
                // Data Viaje.
                { header: 'voyageId', key: 'voyageId' },
                { header: 'voyageNumber', key: 'voyageNumber' },
                { header: 'statusVoyage', key: 'statusVoyage' },
                { header: 'syncStatusVoyage', key: 'syncStatusVoyage' },
                // Datos del puerto
                { header: 'portId', key: 'portId' },
                { header: 'portNumber', key: 'portNumber' },
                { header: 'departurePort', key: 'departurePort' },
                { header: 'arrivalPort', key: 'arrivalPort' },
                { header: 'statusPort', key: 'statusPort' },
                { header: 'syncStatusPort', key: 'syncStatusPort' },
                // DailyReport Identify
                { header: 'dailyReportId', key: 'dailyReportId' },
                { header: 'activityPerformed', key: 'activityPerformed' },
                { header: 'speedStraction', key: 'speedStraction' },
                { header: 'date', key: 'date' },
                { header: 'hour', key: 'hour' },
                { header: 'bunkeringIfo', key: 'bunkeringIfo' },
                { header: 'bunkeringMgo', key: 'bunkeringMgo' },
                { header: 'mplaIfo', key: 'mplaIfo' },
                { header: 'auxIfo', key: 'auxIfo' },
                { header: 'boilerIfo', key: 'boilerIfo' },
                { header: 'otherIfo', key: 'otherIfo' },
                { header: 'mplaMgo', key: 'MplaMgo' },
                { header: 'auxMgo', key: 'auxMgo' },
                { header: 'boilerMgo', key: 'boilerMgo' },
                { header: 'ppMgo', key: 'ppMgo' },
                { header: 'giMgo', key: 'giMgo' },
                { header: 'otherMgo', key: 'otherMgo' },
                { header: 'steamingTime', key: 'steamingTime' },
                { header: 'distance', key: 'distance' },
                { header: 'beaufour', key: 'beaufour' },
                { header: 'observation', key: 'observation' },
                { header: 'statusDaily', key: 'statusDaily' },
                { header: 'syncStatusDaily', key: 'syncStatusDaily' },
            ];
            let positionRow = 0;
            listReportVPD.forEach(iReportVPD => {
                positionRow += 1;
                worksheet.addRow({
                    userId: iReportVPD.userId,
                    year: iReportVPD.year,
                    // Data Viaje.
                    voyageId: iReportVPD.voyageId,
                    voyageNumber: iReportVPD.voyageNumber,
                    statusVoyage: iReportVPD.statusVoyage,
                    syncStatusVoyage: iReportVPD.syncStatusVoyage,
                    // Datos del puerto
                    portId: iReportVPD.portId,
                    portNumber: iReportVPD.portNumber,
                    departurePort: iReportVPD.departurePort,
                    arrivalPort: iReportVPD.arrivalPort,
                    statusPort: iReportVPD.statusPort,
                    syncStatusPort: iReportVPD.syncStatusPort,
                    dailyReportId: iReportVPD.dailyReportId,
                    activityPerformed: iReportVPD.activityPerformed,
                    speedStraction: iReportVPD.speedStraction,
                    date: iReportVPD.date,
                    hour: iReportVPD.hour,
                    bunkeringIfo: iReportVPD.bunkeringIfo,
                    bunkeringMgo: iReportVPD.bunkeringMgo,
                    mplaIfo: iReportVPD.mplaIfo,
                    auxIfo: iReportVPD.auxIfo,
                    boilerIfo: iReportVPD.boilerIfo,
                    otherIfo: iReportVPD.otherIfo,
                    mplaMgo: iReportVPD.mplaMgo,
                    auxMgo: iReportVPD.auxMgo,
                    boilerMgo: iReportVPD.boilerMgo,
                    ppMgo: iReportVPD.ppMgo,
                    giMgo: iReportVPD.giMgo,
                    otherMgo: iReportVPD.otherMgo,
                    steamingTime: iReportVPD.steamingTime,
                    distance: iReportVPD.distance,
                    beaufour: iReportVPD.beaufour,
                    observation: iReportVPD.observation,
                    statusDaily: iReportVPD.statusDaily,
                    syncStatusDaily: iReportVPD.syncStatusDaily
                });
            });
            // Escribimos el excel
            workbook.xlsx.writeBuffer().then((data) => {
                let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                fs.saveAs(blob, textDocDownload + '.xlsx');
            });
        }).then(result => {
            return true;
        }).catch(err => {
            console.log('ERROR ar Generar el excel', err);
            return false;
        });
    }
};
SpeedAnalysisService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [LanguageService])
], SpeedAnalysisService);
export { SpeedAnalysisService };
//# sourceMappingURL=speed-analysis.service.js.map