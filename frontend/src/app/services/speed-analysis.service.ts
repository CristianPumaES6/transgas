import { Injectable } from '@angular/core';
import { DailyReportService } from './daily-report.service';
import { LanguageService } from './language.service';
import { CellFormulaValue, TableProperties, Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import { GetReportVoyagePortDaily } from '../models/dialog-export-excel';

@Injectable({
  providedIn: 'root'
})
export class SpeedAnalysisService {

  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'speedAnalysis';

  constructor(
    private languageService: LanguageService
  ) { }


  public async DowloadExcelDataLocal(BuqueName: string, listReportVPD: GetReportVoyagePortDaily[]): Promise<boolean> {

    // Creamos una nueva hoja de trabajo
    let workbook = new Workbook();
    workbook.creator = 'codev.site';


    let textHoja = 'Data local ' + BuqueName;
    let textDocDownload = 'Data local ' + BuqueName;
    return await Promise.resolve(true)
      .then(
        result => {

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

          listReportVPD.forEach(
            iReportVPD => {

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
            }
          )




          // Escribimos el excel
          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, textDocDownload + '.xlsx');
          });

        }
      ).then(
        result => {

          return true;
        }
      ).catch(
        err => {
          console.log('ERROR ar Generar el excel', err)
          return false;
        }
      )


  }

  public async DowloadFullDbExport(
    users: any[],
    voyages: any[],
    ports: any[],
    dailyReports: any[]
  ): Promise<boolean> {

    // Helper to sanitize object values for Excel
    const sanitizeForExcel = (item: any): any => {
      let newItem: any = {};
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          let value = item[key];
          // If value is array or object (and not null/date), stringify it
          if (value && typeof value === 'object' && !(value instanceof Date)) {
            try {
              newItem[key] = JSON.stringify(value);
            } catch (e) {
              newItem[key] = '[Complex Object]';
            }
          } else {
            newItem[key] = value;
          }
        }
      }
      return newItem;
    };

    // Creamos una nueva hoja de trabajo
    let workbook = new Workbook();
    workbook.creator = 'codev.site';
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let textDocDownload = 'Full_Export_Local_DB_' + timestamp;

    return await Promise.resolve(true)
      .then(result => {

        // ==========================================
        // SHEET 1: USERS
        // ==========================================
        let sheetUsers = workbook.addWorksheet('Users');
        if (users.length > 0) {
          let keys = Object.keys(users[0]);
          sheetUsers.columns = keys.map(key => ({ header: key, key: key }));
          users.forEach(u => sheetUsers.addRow(sanitizeForExcel(u)));
        } else {
          sheetUsers.columns = [{ header: 'No Data', key: 'nodata' }];
        }

        // ==========================================
        // SHEET 2: VOYAGES
        // ==========================================
        let sheetVoyages = workbook.addWorksheet('Voyages');
        if (voyages.length > 0) {
          let keys = Object.keys(voyages[0]);
          sheetVoyages.columns = keys.map(key => ({ header: key, key: key }));
          voyages.forEach(v => sheetVoyages.addRow(sanitizeForExcel(v)));
        } else {
          sheetVoyages.columns = [{ header: 'No Data', key: 'nodata' }];
        }

        // ==========================================
        // SHEET 3: PORTS
        // ==========================================
        let sheetPorts = workbook.addWorksheet('Ports');
        if (ports.length > 0) {
          let keys = Object.keys(ports[0]);
          sheetPorts.columns = keys.map(key => ({ header: key, key: key }));
          ports.forEach(p => sheetPorts.addRow(sanitizeForExcel(p)));
        } else {
          sheetPorts.columns = [{ header: 'No Data', key: 'nodata' }];
        }

        // ==========================================
        // SHEET 4: DAILY REPORTS
        // ==========================================
        let sheetDaily = workbook.addWorksheet('DailyReports');
        if (dailyReports.length > 0) {
          let keys = Object.keys(dailyReports[0]);
          sheetDaily.columns = keys.map(key => ({ header: key, key: key }));
          dailyReports.forEach(d => sheetDaily.addRow(sanitizeForExcel(d)));
        } else {
          sheetDaily.columns = [{ header: 'No Data', key: 'nodata' }];
        }

        // Write Buffer
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, textDocDownload + '.xlsx');
        });

      })
      .then(result => {
        return true;
      })
      .catch(err => {
        console.error('ERROR Generating Full DB Excel', err);
        return false;
      });
  }

}
