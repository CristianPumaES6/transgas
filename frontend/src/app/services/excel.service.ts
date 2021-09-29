import { Injectable } from '@angular/core';
import { CellFormulaValue, TableProperties, Workbook, Worksheet } from 'exceljs';

import * as fs from 'file-saver';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { mathRound } from '../../assets/math/math.assets';
import { FormatDate } from '../../assets/moment/moment.assets';
import { ActivityPerformed } from '../models/dashboard';
import { GetReportVoyagePortDaily } from '../models/dialog-export-excel';
import { User } from '../models/user';
import { Voyage } from '../models/voyage';
import { DailyReportService } from './daily-report.service';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'dashboard';

  constructor(
    private languageService: LanguageService,
    private dailyReportService: DailyReportService,
  ) { }

  public GenerateExcel() {

    // Generamos la data 
    const title = 'Car Sell Report';

    const header = ["Year", "Month", "Make", "Model", "Quantity", "Pct"];

    const data = [
      [2007, 1, "Volkswagen ", "Volkswagen Passat", 1267, 10],
      [2007, 1, "Toyota ", "Toyota Rav4", 819, 6.5],
      [2007, 1, "Toyota ", "Toyota Avensis", 787, 6.2],
      [2007, 1, "Volkswagen ", "Volkswagen Golf", 720, 5.7],
      [2007, 1, "Toyota ", "Toyota Corolla", 691, 5.4]
    ];



    // Creamos una nueva hoja de trabajo
    let workbook = new Workbook();
    workbook.creator = 'Transgas Sailing Analisis';
    workbook.lastModifiedBy = 'Transgas Sailing Analisis';
    workbook.created = new Date(1985, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2016, 9, 27);

    let worksheet = workbook.addWorksheet('Car Data');


    // agregamos los formatos de la fila.
    let titleRow = worksheet.addRow([title]);
    // Set font, size and style in title row.
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };

    // Blank Row
    worksheet.addRow([]);

    // Add row with current date
    let subTitleRow = worksheet.addRow(['Date : ' + new Date()]);




    // Add image.
    /*
    let logo = workbook.addImage({
      base64: logoFile.logoBase64,
      extension: 'png',
    });
    worksheet.addImage(logo, 'E1:F3');
    */



    // unir celdas
    worksheet.mergeCells('A1:D1');


    // Agregar cabecera a la fila
    let headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });


    // Add Data and Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);
      let qty = row.getCell(5);
      let color = 'FF99FF99';
      if (+qty.value < 500) {
        color = 'FF9999'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    });



    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CarData.xlsx');
    });


  };


  public async ExportReportDaily(Voyages: Voyage[]): Promise<boolean> {

    const title = 'CONSUMPTION FORMAT';
    const header = ['PORT N°', 'DEPARTURE', 'ARRIVAL', 'DATE', 'HOUR', 'ACTIVITY PERFORMEND', 'OBSERVATIONS', 'DISTANCE', 'TIME', 'SPEED', 'BEFOURT', 'M.E', 'A.E', 'BOILER', 'TOTAL', 'M.E', 'A.E', 'BOILER', 'P.P', 'G.I', 'TOTAL'];


    // Creamos una nueva hoja de trabajo
    let workbook = new Workbook();
    workbook.creator = 'Transgas Sailing Analisis';


    // recorremos todos los viajes
    for await (const voyage of Voyages) {

      // Creamos la hoja de trabajo.
      let worksheet = workbook.addWorksheet('Voyage ' + voyage.voyageNumber);



      worksheet.columns = [
        { width: 10 },
        { width: 30 },
        { width: 30 },
        { width: 18 },
        { width: 10 },
        { width: 25 },// Activity
        { width: 30 },// Observaciones
        { width: 10 },// Distance
        { width: 10 },// Time
        { width: 10 },// Speed
        { width: 15 },// Befourt
        { width: 7 },// M.E
        { width: 7 },// A.E
        { width: 7 },// Boiler
        { width: 10 },// Total
        { width: 7 },// M.E
        { width: 7 },// A.E
        { width: 7 },// Boiler
        { width: 7 },// P.P
        { width: 7 },// G.I
        { width: 10 },// Total
      ];

      // Agregamos una fila con el titulo
      let titleRow = worksheet.addRow([title]);
      // Le agregamos un font
      titleRow.font = { name: 'Arial Black', family: 2, size: 16, underline: 'double', bold: true };
      // unir celdas
      worksheet.mergeCells('A1:F1');


      worksheet.addRow([]);

      worksheet.addRow([
        '', '', '', '', '', '', '',
        'NAVIGATION DATA', '', '', '',
        'VLSFO CONSUMPTION IN MT', '', '', '',
        'MGO CONSUMPTION IN MT'
      ]);

      // Fila vacia
      worksheet.mergeCells('H3:K3');
      this.StyleCellHeader(worksheet, 'H3', '0040d8');
      worksheet.mergeCells('L3:O3');
      this.StyleCellHeader(worksheet, 'L3', '0040d8');
      worksheet.mergeCells('P3:U3');
      this.StyleCellHeader(worksheet, 'P3', '0040d8');

      // Agregar cabecera a la fila
      let headerRow = worksheet.addRow(header);

      this.StyleCellHeader(worksheet, 'A4', '375f9a');
      this.StyleCellHeader(worksheet, 'B4', '375f9a');
      this.StyleCellHeader(worksheet, 'C4', '375f9a');
      this.StyleCellHeader(worksheet, 'D4', '375f9a');
      this.StyleCellHeader(worksheet, 'E4', '375f9a');
      this.StyleCellHeader(worksheet, 'F4', '375f9a');
      this.StyleCellHeader(worksheet, 'G4', '375f9a');
      this.StyleCellHeader(worksheet, 'H4', '001556');// DISTANCE
      this.StyleCellHeader(worksheet, 'I4', '001556');// TIME
      this.StyleCellHeader(worksheet, 'J4', '0040d8');// SPEED // Color especial
      this.StyleCellHeader(worksheet, 'K4', '375f9a');// BEFOURT


      this.StyleCellHeader(worksheet, 'L4', '001556');// Colores de maquina
      this.StyleCellHeader(worksheet, 'M4', '001556');// Colores de maquina
      this.StyleCellHeader(worksheet, 'N4', '001556');// Colores de maquina
      this.StyleCellHeader(worksheet, 'O4', '0040d8');// Color especial


      this.StyleCellHeader(worksheet, 'P4', '001556');// Colores de maquina
      this.StyleCellHeader(worksheet, 'Q4', '001556');// Colores de maquina
      this.StyleCellHeader(worksheet, 'R4', '001556');// Colores de maquina
      this.StyleCellHeader(worksheet, 'S4', '001556');// Colores de maquina
      this.StyleCellHeader(worksheet, 'T4', '001556');// Colores de maquina
      this.StyleCellHeader(worksheet, 'U4', '0040d8');// Color especial


      let fila = 4;
      let totalTimePerActivityIFO: ActivityPerformed = new ActivityPerformed();
      let totalDistanceMilesByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

      let averageSpeedByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
      let averageSpeedCharterByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

      let voyageConsumptionByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
      let dayliConsumptionByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

      let dayliConsumptionCharterByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
      let timePerNavigationCharterByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
      let voyageConsumptionCharterByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

      let balanceConsumptionByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
      let balanceTimeByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

      for await (const port of voyage.ports) {
        let inicioFila = fila;

        for await (const dailyReport of port.dailyReports) {
          fila++;

          let totalIFO = dailyReport.mplaIfo + dailyReport.auxIfo + dailyReport.boilerIfo;
          let totalMGO = dailyReport.mplaMgo + dailyReport.auxMgo + dailyReport.boilerMgo + dailyReport.ppMgo + dailyReport.giMgo;
          worksheet.addRow([
            port.portNumber,
            port.departurePort, port.arrivalPort,
            FormatDate(dailyReport.date), dailyReport.hour,
            this.languageService.GetMessage(this.translateCategory, dailyReport.activityPerformed),
            dailyReport.observation,
            mathRound(dailyReport.distance, 2),
            mathRound(dailyReport.steamingTime, 2),
            mathRound((dailyReport.distance > 0 && dailyReport.steamingTime > 0 ? dailyReport.distance / dailyReport.steamingTime : 0), 2),
            dailyReport.beaufour,
            mathRound(dailyReport.mplaIfo, 2),
            mathRound(dailyReport.auxIfo, 2),
            mathRound(dailyReport.boilerIfo, 2),
            mathRound(totalIFO, 2),
            mathRound(dailyReport.mplaMgo, 2),
            mathRound(dailyReport.auxMgo, 2),
            mathRound(dailyReport.boilerMgo, 2),
            mathRound(dailyReport.ppMgo, 2),
            mathRound(dailyReport.giMgo, 2),
            mathRound(totalMGO, 2)
          ]);
          this.AllFill(worksheet, fila, 'f1f6ff');
        }

        worksheet.mergeCells('A' + (inicioFila + 1) + ':A' + fila);
        worksheet.mergeCells('B' + (inicioFila + 1) + ':B' + fila);
        worksheet.mergeCells('C' + (inicioFila + 1) + ':C' + fila);
      }

      fila++;
      worksheet.addRow([]);
      fila++;
      worksheet.addRow([]);
      fila++;
      worksheet.addRow([]);


      /* fila++;
       worksheet.addRow(['','','',
                         'ACTIVITY PERFORMED','TOTAL TIME PER ACTIVITY (HRS)','TOTAL DISTANCE (MILES)','AVERAGE SPEED (MILES/HRS)','AVERAGE SPEED (MILES/HRS) (CHARTER)','TOTAL CONSUMPTION (MT)','DAILY CONSUMPTION (MT)','DAILY CONSUMPTION (MT) (CHARTER)','TIME PER NAVIGATION (HRS) (CHARTER)','TOTAL CONSUMPTION (MT) (CHARTER)','BALANCE CONSUMPTION (MT)','BALANCE TIME (HRS)']);
       this.StyleCellHeader(worksheet,'D'+fila,'375f9a');
       this.StyleCellHeader(worksheet,'E'+fila,'375f9a');
       this.StyleCellHeader(worksheet,'F'+fila,'375f9a');
       this.StyleCellHeader(worksheet,'G'+fila,'375f9a');
       this.StyleCellHeader(worksheet,'H'+fila,'375f9a');
       this.StyleCellHeader(worksheet,'I'+fila,'375f9a');
       this.StyleCellHeader(worksheet,'J'+fila,'375f9a');
       this.StyleCellHeader(worksheet,'K'+fila,'375f9a');
       this.StyleCellHeader(worksheet,'L'+fila,'375f9a');
       this.StyleCellHeader(worksheet,'M'+fila,'375f9a');
       this.StyleCellHeader(worksheet,'N'+fila,'375f9a');
       this.StyleCellHeader(worksheet,'O'+fila,'375f9a')
 */

    }


    // Escribimos el excel
    await workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Report.xlsx');
    });


    return true

  };

  // Opcion que exporta el excel.
  public async ExportExcel(selectUserId: number, startDate: string, endDate: string, selectUser: User): Promise<boolean> {
    /*   
    const wb = new Workbook();
    
    
      // Escribimos el excel
      wb.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'Report.xlsx');
      });
     */

    const title = 'CONSUMPTION FORMAT';
    const header = ['PORT N°', 'DEPARTURE', 'ARRIVAL', 'DATE', 'HOUR', 'ACTIVITY PERFORMEND', 'OBSERVATIONS', 'DISTANCE', 'TIME', 'SPEED', 'BEFOURT', 'M.E', 'A.E', 'BOILER', 'TOTAL', 'M.E', 'A.E', 'BOILER', 'P.P', 'G.I', 'TOTAL'];


    // Creamos una nueva hoja de trabajo
    let workbook = new Workbook();
    workbook.creator = 'transgas.web.app';


    let listGetReportVoyagePortDaily: GetReportVoyagePortDaily[] = [];

    return await Promise.resolve(true)
      .then(
        result => {
          // Buscamos la informacion del combustible de inicio y fin segun la fecha.
          return this.GetReportVoyagePortDaily(selectUserId, startDate, endDate).pipe().toPromise();
        }).then(
          result => {
            if (!result) throw 'ERROR GER REPORT';
            listGetReportVoyagePortDaily = result;


            // Armamos el reporte.
            this.ReportVoyage(workbook, title, listGetReportVoyagePortDaily, selectUser)


            // Aqui seria por por viaje y pagina, cada viaje una nueva hoja.
            for (const getReportVoyagePortDaily of listGetReportVoyagePortDaily) {

            }

            // Escribimos el excel
            workbook.xlsx.writeBuffer().then((data) => {
              let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              fs.saveAs(blob, 'Report.xlsx');
            });

            return true;
          }
        );
  }

  private ReportVoyage(workbook: Workbook, title: string, listGetReportVoyagePortDaily: GetReportVoyagePortDaily[], selectUser: User): Workbook {

    let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';

    // Creamos la hoja de trabajo.
    let worksheet = workbook.addWorksheet('Voyage ' + 2);
    //  let titleRow = worksheet.addRow(['Voyage','Date','Hour','Time','Activity Performed','Observation' ]);


    let totalBunkeringIfo = 0;

    worksheet.columns = [
      { width: 0 },
      { width: 0 },
      { width: 0 },
      { width: 0 },
      { width: 0 },
      // D
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
      { width: 4 },
    ];

    let position = 6;

    // nos ubicamos en una posicion para empezar a poner los row
    //this.mergeCellReport(worksheet, position);

    let colorYellowTransgas = 'FFCD06';
    // Variables de colores-
    let blueHard = '001556'
    let blueMedium = '09155694'
    let blueLow = 'b6c2ff94';


    let blueHard1 = '375f9a'
    let blueHard2 = '0040d8'
    let blueHard3 = '001556'

    let greenHard = '091556'
    let greenMedium = '09155694'
    let greenLow = 'b6c2ff94';

    let black = '000'
    let white = 'ffffff';

    // Variables de colores-
    let grisFuerte = 'd4d4d4'
    let grisMedio = 'ebe8e8'
    let grisSuave = 'f3f3f3';

    let redHard = '9a2929';
    let redMedium = 'ffa4a4';
    let redLow = 'ffd6d6';

    let positionColumn = 25;

    // ================= Linea 1
    let posicion = [position, position];
    let positionColumns = [positionColumn, positionColumn + 53];
    this.addStyleByColums(worksheet, posicion, positionColumns, 'INFO VESSEL', 20, colorYellowTransgas, blueHard3, '')
    this.addBorder(worksheet, position, positionColumn, 'thick', blueHard3, '');

    // disminuimos las filas registradas
    posicion = [position + 1, position + 11];
    this.addStyleBorder(worksheet, posicion, positionColumns, 'thick', blueHard3)

    position += 1;

    //Espacio de separacion
    position += 1;



    let positionRow = position;
    let positionColum = 7
    // ================= Linea 2
    let tamanioLegend = this.StyleDashLegend(worksheet, positionRow, positionColum);

    positionColum = 25;
    let tamanioBuque = this.StyleDashBuque(worksheet, positionRow, positionColum, selectUser);



    positionColum = 44;
    let tamanioSpeed = this.StyleDashSpeed(worksheet, positionRow, positionColum, selectUser);

    positionColum = 51;
    let tamanioActivity = this.StyleDashActivity(worksheet, positionRow, positionColum, selectUser);


    // ========== LInea 3


    positionColum = 64;
    let tamanioSpeedMGO = this.StyleDashSpeed(worksheet, positionRow, positionColum, selectUser);


    positionColum = 71;
    let tamanioActivityMGO = this.StyleDashActivity(worksheet, positionRow, positionColum, selectUser);

    position = tamanioActivityMGO + 4;

    positionColum = 7;
    positionRow = position;
    let tamanioCosumption = this.StyleDashCosumption(worksheet, positionRow, positionColum, selectUser);
    /// Filas aprox del cuadro de consumo.
    position += 20;

    position += 1;
    worksheet.getCell('AR' + position).value = textIFOorVLSFOorLSFO + " CONSUMPTION IN MT";
    worksheet.getCell('AR' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 20,
        bold: true,
        color: { argb: colorYellowTransgas },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard
        }
      },
      border: {
        top: { style: 'double', color: { argb: grisSuave } },
        left: { style: 'double', color: { argb: grisSuave } },
        bottom: { style: 'double', color: { argb: grisSuave } },
        right: { style: 'double', color: { argb: grisSuave } }
      }

    }
    worksheet.mergeCells('AR' + position, 'BG' + position);

    worksheet.getCell('BH' + position).value = "MGO CONSUMPTION IN MT";
    worksheet.getCell('BH' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 20,
        bold: true,
        color: { argb: colorYellowTransgas },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard
        }
      },
      border: {
        top: { style: 'double', color: { argb: grisSuave } },
        left: { style: 'double', color: { argb: grisSuave } },
        bottom: { style: 'double', color: { argb: grisSuave } },
        right: { style: 'double', color: { argb: grisSuave } }
      }

    };
    worksheet.mergeCells('BH' + position, 'CA' + position);

    position += 1;
    worksheet.getCell('AJ' + position).value = "NAVIGATION DATA";
    worksheet.getCell('AJ' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 15,
        bold: true,
        color: { argb: colorYellowTransgas },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard
        }
      },
      border: {
        top: { style: 'double', color: { argb: grisSuave } },
        left: { style: 'double', color: { argb: grisSuave } },
        bottom: { style: 'double', color: { argb: grisSuave } },
        right: { style: 'double', color: { argb: grisSuave } }
      }

    }
    worksheet.mergeCells('AJ' + position, 'AQ' + position);

    worksheet.getCell('AR' + position).value = "PREVIOUS VOYAGE";
    worksheet.getCell('AR' + position).style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      font: {
        size: 10,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.mergeCells('AR' + position, 'BD' + position);

    worksheet.getCell('BE' + position).value = 200;
    worksheet.getCell('BE' + position).style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      font: {
        size: 18,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };

    worksheet.mergeCells('BE' + position, 'BG' + position);


    worksheet.getCell('BH' + position).value = "PREVIOUS VOYAGE";
    worksheet.getCell('BH' + position).style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      font: {
        size: 10,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.mergeCells('BH' + position, 'BX' + position);
    worksheet.getCell('BY' + position).value = 200;
    worksheet.getCell('BY' + position).style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      font: {
        size: 18,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.mergeCells('BY' + position, 'CA' + position);

    position += 1;
    worksheet.addRow([
      'voyageId', 'portId', 'dailyReportId', '', '',//E


      'Voyage', '', //G
      'departure', '', '', '', //G
      'arrival', '', '', '', //G
      'date', '', '', //J
      'hours', '',  //L
      'steamingTime', '', //N
      'activityPerformed', '', '', '',//R
      'speedStraction', '',
      'observation', '', '', '', '', '', '',//V

      'distance', '',//X
      'timeNavigation', '',//Z
      'speed', '',//AB
      'Beaufort', '',//AD

      'mplaIfo', '',//AF
      'auxIfo', '',//AH
      'boilerIfo', '',//AJ
      'otherIfo', '',//AL
      'totalIfo', '',//AN
      'dailyCosumtionIFO', '',
      'bunkeringIfo', '',//AP
      'robIfo', '',//AR


      'mplaMgo', '',//AF
      'auxMgo', '',//AH
      'boilerMgo', '',//AJ
      'ppMgo', '',//AJ
      'giMgo', '',//AJ
      'otherMgo', '',//AL
      'totalMgo', '',//AN
      'dailyCosumtionIFO', '',
      'bunkeringMgo', '',//AP
      'robMgo', '',//AR },
    ]);
    worksheet.getCell('F' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard2
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };

    worksheet.getCell('H' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('L' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };

    worksheet.getCell('P' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('S' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('U' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard2
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('W' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('AA' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('AC' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('AJ' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('AL' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('AN' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard2
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('AP' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('AR' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('AT' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('AV' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('AX' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('AZ' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard2
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BB' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard2
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BD' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BF' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard2
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BH' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BJ' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BL' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BN' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BP' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BR' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BT' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard2
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BV' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard2
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BX' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard1
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };
    worksheet.getCell('BZ' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 8,
        bold: true,
        color: { argb: white },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: blueHard2
        }
      },
      border: {
        top: { style: 'thin', color: { argb: grisSuave } },
        left: { style: 'thin', color: { argb: grisSuave } },
        bottom: { style: 'thin', color: { argb: grisSuave } },
        right: { style: 'thin', color: { argb: grisSuave } }
      }
    };

    this.mergeCellReport(worksheet, position);

    listGetReportVoyagePortDaily.forEach(
      (getReportVoyagePortDaily, index) => {



        position += 1;
        let dataRow = [
          getReportVoyagePortDaily.voyageId,
          getReportVoyagePortDaily.portId,
          getReportVoyagePortDaily.dailyReportId,
          '', { formula: 'AND( AI' + position + ' <12, AI' + position + ' > 0 )' },
          'V' + getReportVoyagePortDaily.voyageNumber + '-' + getReportVoyagePortDaily.year, '',
          getReportVoyagePortDaily.departurePort, '', '', '',
          getReportVoyagePortDaily.arrivalPort, '', '', '',
          FormatDate(getReportVoyagePortDaily.date), '', '',
          getReportVoyagePortDaily.hour, '',
          { formula: 'IF(P' + position + '-P' + (position - 1) + '=1,((S' + position + '-S' + (position - 1) + ')*24)+24,(S' + position + '-S' + (position - 1) + ')*24)' }, '',
          getReportVoyagePortDaily.activityPerformed, '', '', '',


          getReportVoyagePortDaily.speedStraction, '',

          getReportVoyagePortDaily.observation, '', '', '', '', '', '',

          getReportVoyagePortDaily.distance, '',
          // Solo si es de la actividad de navegacion deberia de agregarse.
          { formula: 'IF(P' + position + '-P' + (position - 1) + '=1,((S' + position + '-S' + (position - 1) + ')*24)+24,(S' + position + '-S' + (position - 1) + ')*24)' }, '',
          // Velocidad formula.
          { formula: 'IF(ISERROR(AJ' + position + '/AL' + position + '),0,AJ' + position + '/AL' + position + ')' }, '',
          getReportVoyagePortDaily.beaufour, '',

          //IFO
          getReportVoyagePortDaily.mplaIfo, '',
          getReportVoyagePortDaily.auxIfo, '',
          getReportVoyagePortDaily.boilerIfo, '',
          getReportVoyagePortDaily.otherIfo, '',
          // Total
          { formula: 'SUM(AR' + position + ':AX' + position + ')' }, '',
          // dailyConsumption
          { formula: 'IF(ISERROR(' + 'AZ' + position + '*24/' + 'AL' + position + '),0,' + 'AZ' + position + '*24/' + 'AL' + position + ')' }, '',
          getReportVoyagePortDaily.bunkeringIfo, '',
          // RobIFO
          { formula: 'BF' + (position - 1) + '-AZ' + position + '+BD' + position }, '',

          getReportVoyagePortDaily.mplaMgo, '',
          getReportVoyagePortDaily.auxMgo, '',
          getReportVoyagePortDaily.boilerMgo, '',
          getReportVoyagePortDaily.ppMgo, '',
          getReportVoyagePortDaily.giMgo, '',
          getReportVoyagePortDaily.otherMgo, '',

          // Total
          { formula: 'SUM(BH' + position + ':BS' + position + ')' }, '',

          // dailyConsumption
          { formula: 'IF(ISERROR(' + 'BT' + position + '*24/' + 'AL' + position + '),0,' + 'BT' + position + '*24/' + 'AL' + position + ')' }, '',
          getReportVoyagePortDaily.bunkeringMgo, '',

          // RobIFO
          { formula: 'BZ' + (position - 1) + '-BT' + position + '+BX' + position }, '',
        ];

        worksheet.addRow(dataRow);
        this.mergeCellReport(worksheet, position);
        // Si es el primer registro se debe calcular con el rob del viaje anterior
        if (index == 0) {

          // Revisar stimitime no debria estar aqui. deberia apuntar a la leyenda
          worksheet.getCell('U' + position).value = <any>{ formula: 'IF(P' + position + '-P' + (position - 1) + '=1,((S' + position + '-S' + (position - 1) + ')*24)+24,(S' + position + '-S' + (position - 1) + ')*24)' };
          worksheet.getCell('AL' + position).value = <any>{ formula: 'IF(P' + position + '-P' + (position - 1) + '=1,((S' + position + '-S' + (position - 1) + ')*24)+24,(S' + position + '-S' + (position - 1) + ')*24)' };



          worksheet.getCell('BF' + position).value = <any>{ formula: 'BE' + (position - 2) + '-AZ' + position + '+BD' + position };
          worksheet.getCell('BZ' + position).value = <any>{ formula: 'BY' + (position - 2) + '-BT' + position + '+BX' + position };

          this.addFormatting(worksheet, position)
          // Agregamos el formadate
        } else {

          this.addFormatting(worksheet, position)
        }



      }

    );

    console.log('Fin');

    return workbook;
  }

  private addStyleByColums(worksheet: Worksheet, position: number[], column: number[], textorFormule: string | number | any, sizeFont: number, colortText: string, colorBackgraund: string, border) {


    let colorYellowTransgas = 'FFCD06';
    // Variables de colores-
    let blueHard = '001556'
    let blueMedium = '09155694'
    let blueLow = 'b6c2ff94';


    let blueHard1 = '375f9a'
    let blueHard2 = '0040d8'
    let blueHard3 = '001556'

    let greenHard = '091556'
    let greenMedium = '09155694'
    let greenLow = 'b6c2ff94';

    let black = '000'
    let white = 'ffffff';

    let grisSuave = 'f3f3f3';

    // SEparamos las posiciones.
    let positionDesde = position[0];
    let positionHasta = position[1];

    let columnDesde = column[0];
    let columnHasta = column[1];


    let style: any = {

      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      font: {
        size: sizeFont,
        bold: sizeFont <= 7 ? false : true,
        color: { argb: colortText },
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: colorBackgraund
        }
      }

    };


    worksheet.getCell(this.PositByCell(columnDesde) + positionDesde).value = textorFormule;
    worksheet.getCell(this.PositByCell(columnDesde) + positionDesde).style = style;
    worksheet.mergeCells(this.PositByCell(columnDesde) + positionDesde, this.PositByCell(columnHasta) + positionHasta);
  }



  private addStyleBorder(worksheet: Worksheet, position: number[], column: number[], borderStyle, colorborder: string) {

    // SEparamos las posiciones.
    let positionDesde = position[0];
    let positionHasta = position[1];

    let columnDesde = column[0];
    let columnHasta = column[1];



    // nos ayudara a saber en que columna estamos.
    let positionColum = columnDesde;



    //recorremos las celdas del arrededor
    for (let index = positionDesde; index <= positionHasta; index++) {

      if (
        //index == positionDesde
        false
      ) {
        this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'leftUpperRorner');
        this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'righUpperRorner');
      }
      // si es el ultimo para insertar
      else if (index == positionHasta) {
        this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'leftLowRorner');
        this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'righLowRorner');
      } else {
        this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'left');
        this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'right');
      }
    }

    //recorremos las celdas del arrededor
    for (let index = columnDesde + 1; index <= columnHasta - 1; index++) {
      this.addBorder(worksheet, positionHasta, index, borderStyle, colorborder, 'bottom');
    }

  }

  private addStyleToBorders(worksheet: Worksheet, position: number[], column: number[], borderStyle, colorborder: string, top: boolean, right: boolean, bottom: boolean, left: boolean) {

    // SEparamos las posiciones.
    let positionDesde = position[0];
    let positionHasta = position[1];

    let columnDesde = column[0];
    let columnHasta = column[1];



    // nos ayudara a saber en que columna estamos.
    let positionColum = columnDesde;



    //recorremos las celdas del arrededor
    for (let index = positionDesde; index <= positionHasta; index++) {


      if (top || right || bottom || left) {
        if (top) {
          this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'top');
        }
        if (right) {
          this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'right');
        }
        if (bottom) {
          this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'bottom');
        }
        if (left) {
          this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'left');
        }
      } else {

        if (
          index == positionDesde
        ) {
          this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'leftUpperRorner');
          this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'righUpperRorner');
        }
        // si es el ultimo para insertar
        else if (index == positionHasta) {
          this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'leftLowRorner');
          this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'righLowRorner');
        } else {
          this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'left');
          this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'right');
        }
      }
    }






    //recorremos las celdas del arrededor
    for (let index = columnDesde; index <= columnHasta; index++) {
      if (top || right || bottom || left) {
        if (top) {
          this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'top');
        }
        if (right) {
          this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'right');
        }
        if (bottom) {
          this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'bottom');
        }
        if (left) {
          this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'left');
        }
      } else {

        this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'top');
        this.addBorder(worksheet, positionHasta, index, borderStyle, colorborder, 'bottom');
      }
    }

  }
  // Agrega borde a una celda en expeciofica
  //righUpperRorner =
  private addBorder(worksheet: Worksheet, positionRow: number, positionColumn: number, borderStyle, colorborder: string, lugardelBorde: string) {

    borderStyle = borderStyle || 'solid';
    let border: any = worksheet.getCell(this.PositByCell(positionColumn) + positionRow).style.border;

    border = border || {};
    if (lugardelBorde == 'left') {
      border.left = { style: borderStyle, color: { argb: colorborder } };
    } else if (lugardelBorde == 'right') {
      border.right = { style: borderStyle, color: { argb: colorborder } };
    } else if (lugardelBorde == 'bottom') {
      border.bottom = { style: borderStyle, color: { argb: colorborder } };
    } else if (lugardelBorde == 'top') {
      border.top = { style: borderStyle, color: { argb: colorborder } };
    } else if (lugardelBorde == 'righUpperRorner') {
      border.top = { style: borderStyle, color: { argb: colorborder } };
      border.right = { style: borderStyle, color: { argb: colorborder } };
    } else if (lugardelBorde == 'righLowRorner') {
      border.bottom = { style: borderStyle, color: { argb: colorborder } };
      border.right = { style: borderStyle, color: { argb: colorborder } };
    }
    else if (lugardelBorde == 'leftUpperRorner') {
      border.top = { style: borderStyle, color: { argb: colorborder } };
      border.left = { style: borderStyle, color: { argb: colorborder } };
    }
    else if (lugardelBorde == 'leftLowRorner') {
      border.bottom = { style: borderStyle, color: { argb: colorborder } };
      border.left = { style: borderStyle, color: { argb: colorborder } };
    }
    else {

      border.top = { style: borderStyle, color: { argb: colorborder } };
      border.right = { style: borderStyle, color: { argb: colorborder } };
      border.bottom = { style: borderStyle, color: { argb: colorborder } };
      border.left = { style: borderStyle, color: { argb: colorborder } };

    }

    console.log(this.PositByCell(positionColumn) + positionRow);

    worksheet.getCell(this.PositByCell(positionColumn) + positionRow).border = border;


  }
  // ingresas el numero y devuelve la letra
  private PositByCell(positionColum: number): string {
    let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
      'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ',
      'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ'];

    return letras[positionColum];
  }
  // Busca la letra y devuelve el numero.
  private SearchPositByCell(letraColum: string): any {
    let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
      'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ',
      'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ'];


    letras.forEach(
      (letra, index) => {
        if (letra === letraColum) {
          return index;
        }
      }
    );
  }


  private mergeCellReport(worksheet: Worksheet, position) {

    worksheet.mergeCells('F' + position, 'G' + position);
    worksheet.mergeCells('H' + position, 'K' + position);
    worksheet.mergeCells('L' + position, 'O' + position);
    worksheet.mergeCells('P' + position, 'R' + position);
    worksheet.mergeCells('S' + position, 'T' + position);
    worksheet.mergeCells('U' + position, 'V' + position);
    worksheet.mergeCells('W' + position, 'Z' + position);
    worksheet.mergeCells('AA' + position, 'AB' + position);
    worksheet.mergeCells('AC' + position, 'AI' + position);
    worksheet.mergeCells('AJ' + position, 'AK' + position);
    worksheet.mergeCells('AL' + position, 'AM' + position);
    worksheet.mergeCells('AN' + position, 'AO' + position);
    worksheet.mergeCells('AP' + position, 'AQ' + position);
    worksheet.mergeCells('AR' + position, 'AS' + position);
    worksheet.mergeCells('AT' + position, 'AU' + position);
    worksheet.mergeCells('AV' + position, 'AW' + position);
    worksheet.mergeCells('AX' + position, 'AY' + position);
    worksheet.mergeCells('AZ' + position, 'BA' + position);
    worksheet.mergeCells('BB' + position, 'BC' + position);
    worksheet.mergeCells('BD' + position, 'BE' + position);
    worksheet.mergeCells('BF' + position, 'BG' + position);
    worksheet.mergeCells('BH' + position, 'BI' + position);
    worksheet.mergeCells('BJ' + position, 'BK' + position);
    worksheet.mergeCells('BL' + position, 'BM' + position);
    worksheet.mergeCells('BN' + position, 'BO' + position);
    worksheet.mergeCells('BP' + position, 'BQ' + position);
    worksheet.mergeCells('BR' + position, 'BS' + position);
    worksheet.mergeCells('BT' + position, 'BU' + position);
    worksheet.mergeCells('BV' + position, 'BW' + position);
    worksheet.mergeCells('BX' + position, 'BY' + position);
    worksheet.mergeCells('BZ' + position, 'CA' + position);

  }

  private addFormatting(worksheet: Worksheet, position: number) {

    // Variables de colores-
    let grisFuerte = 'd4d4d4'
    let grisMedio = 'ebe8e8'
    let grisSuave = 'f3f3f3';

    let greenHard = '228e30';
    let greenMedium = '0eb924';
    let greenLow = 'c0fdc8';

    let redHard = '9a2929';
    let redMedium = 'ffa4a4';
    let redLow = 'ffd6d6';

    // Agregar formato a una fcelda
    worksheet.getCell('P' + position).numFmt = 'm/d/yyyy';

    // Agrega formato a Actividad
    worksheet.addConditionalFormatting({
      ref: 'W' + position + ':Z' + position,
      rules: [
        // si la actividad es navegando deberia tener una distancia.    
        {
          type: 'expression',
          priority: 2,
          formulae: ['AND( OR(EXACT(W' + position + ',"SAILING_WITH_LADEN"), EXACT(W' + position + ',"SAILING_IN_BALLAST"), EXACT(W' + position + ',"ECONOMICAL_NAVIGATION") ), (0=AJ' + position + ') )'],
          style: {
            border: {
              top: { style: 'double', color: { argb: redHard } },
              left: { style: 'double', color: { argb: redHard } },
              bottom: { style: 'double', color: { argb: redHard } },
              right: { style: 'double', color: { argb: redHard } }
            }
          },
        },

      ],
    });


    // Agrega formato a distancia
    worksheet.addConditionalFormatting({
      ref: 'AJ' + position + ':AK' + position,
      rules: [
        // si la actividad es navegando deberia tener una distancia.    
        {
          type: 'expression',
          priority: 2,
          formulae: ['AND( OR(EXACT(W' + position + ',"SAILING_WITH_LADEN"), EXACT(W' + position + ',"SAILING_IN_BALLAST"), EXACT(W' + position + ',"ECONOMICAL_NAVIGATION") ), (0=AJ' + position + ') )'],
          style: {
            border: {
              top: { style: 'double', color: { argb: redHard } },
              left: { style: 'double', color: { argb: redHard } },
              bottom: { style: 'double', color: { argb: redHard } },
              right: { style: 'double', color: { argb: redHard } }
            }
          },
        },

      ],
    });

    // Agrega el formato a speed
    worksheet.addConditionalFormatting({
      ref: 'AN' + position + ':AO' + position,
      rules: [

        {
          type: 'cellIs',
          priority: 1,
          operator: 'equal',
          formulae: [0],
          style: {
            border: {},
            font: { color: { argb: grisMedio } },
          },
        },
        // Menor que 
        {
          type: 'expression',
          priority: 1,
          formulae: ['AND( AN' + position + ' <12, AN' + position + ' > 0 )'],
          style: {
            font: { color: { argb: redHard } },
            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
          },
        },
        // Mayor que 
        {
          type: 'expression',
          priority: 1,
          formulae: ['AN' + position + ' >=12'],
          style: {
            font: { color: { argb: greenHard } },
            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenLow } },
          },
        },
        // si la actividad es navegando deberia tener una velocidad.       
        {
          type: 'expression',
          priority: 2,
          formulae: ['AND( OR(EXACT(W' + position + ',"SAILING_WITH_LADEN"), EXACT(W' + position + ',"SAILING_IN_BALLAST"), EXACT(W' + position + ',"ECONOMICAL_NAVIGATION") ), (0=AN' + position + ') )'],
          style: {
            border: {
              top: { style: 'double', color: { argb: redHard } },
              left: { style: 'double', color: { argb: redHard } },
              bottom: { style: 'double', color: { argb: redHard } },
              right: { style: 'double', color: { argb: redHard } }
            }
          },
        },

      ],
    });

    // Agrega formato a Tiempo
    worksheet.addConditionalFormatting({
      ref: 'AL' + position + ':AM' + position,
      rules: [
        // si la actividad es navegando deberia tener una distancia.    
        {
          type: 'expression',
          priority: 2,
          formulae: ['AND(  (0=AL' + position + ') )'],
          style: {
            border: {
              top: { style: 'double', color: { argb: redHard } },
              left: { style: 'double', color: { argb: redHard } },
              bottom: { style: 'double', color: { argb: redHard } },
              right: { style: 'double', color: { argb: redHard } }
            }
          },
        },

      ],
    });

    if (position % 2 === 0) {
      // Agrega formato a Actividad
      worksheet.addConditionalFormatting({
        ref: 'F' + position + ':CA' + position,
        rules: [
          // si la actividad es navegando deberia tener una distancia.    
          {
            type: 'expression',
            priority: 20,
            formulae: [true],
            style: {
              fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: grisSuave } },

            },
          },

        ],
      });
    } else {

    }

  }


  // Agrega el reporte al excel.
  public async ReportDaily(selectUser: User, startDate: Date, endDate: Date): Promise<boolean> {

    return await Promise.resolve(true).then(
      result => {

        // Seleccionamos al usuairo segun el selectUserId
        return true;
      }
    )
  }

  // Obtenemos la info de todos los viajes agregado.
  private GetReportVoyagePortDaily(userId: number, startDate: string, endDate: string): Observable<GetReportVoyagePortDaily[]> {
    // Obtenemos el rob de inicio y el consumo hecho en el filtro.
    // Obtenemos todos los usuarios
    return this.dailyReportService.GetReportVoyagePortDailyByUserIdAndDate(userId, startDate, endDate).pipe(map(
      (resultGetROBByUser: GetReportVoyagePortDaily[]) => {

        if (!resultGetROBByUser && resultGetROBByUser.length > 0) throw 'ERROR_GET_ROB_BY_USER';


        return resultGetROBByUser;
      }
    ));

  }

  private StyleCellHeader(worksheet: any, cell: string, bg: string) {
    // Border
    worksheet.getCell(cell).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bg },
    };
    // font
    worksheet.getCell(cell).font = {
      color: { argb: "FFFFFF" },
      size: 11,
      bold: true
    };
    // Border
    worksheet.getCell(cell).border = {
      top: { style: 'medium', color: { argb: '155af5' } },
      left: { style: 'medium', color: { argb: '155af5' } },
      bottom: { style: 'medium', color: { argb: '155af5' } },
      right: { style: 'medium', color: { argb: '155af5' } }
    }
    // Alinear
    worksheet.getCell(cell).alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true
    };
  };

  private AllFill(worksheet: any, numberCell, bg: string) {

    this.StyleCellBodyTable(worksheet, 'A' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'B' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'C' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'D' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'E' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'F' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'G' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'H' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'I' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'J' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'K' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'L' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'M' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'N' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'O' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'P' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'Q' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'R' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'S' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'T' + numberCell, bg);
    this.StyleCellBodyTable(worksheet, 'U' + numberCell, bg);
  }
  //
  private StyleCellBodyTable(worksheet: any, cell: string, bg: string) {
    // Border
    worksheet.getCell(cell).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bg },
    };
    // font
    worksheet.getCell(cell).font = {
      color: { argb: "000f3e" },
      size: 11,
      bold: false
    };
    // Border
    worksheet.getCell(cell).border = {
      top: { style: 'hair', color: { argb: '155af5' } },
      left: { style: 'hair', color: { argb: '155af5' } },
      bottom: { style: 'hair', color: { argb: '155af5' } },
      right: { style: 'hair', color: { argb: '155af5' } }
    }
    // Alinear
    worksheet.getCell(cell).alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
  };


  // 3119898 *225

  // Esta funcion permite poner un cuadro de leyenda.
  private StyleDashLegend(worksheet, posit, colum): number {

    let colorYellowTransgas = 'FFCD06';
    // Variables de colores-
    let blueHard = '001556'
    let blueMedium = '09155694'
    let blueLow = 'b6c2ff94';


    let blueHard1 = '375f9a'
    let blueHard2 = '0040d8'
    let blueHard3 = '001556'

    let greenHard = '091556'
    let greenMedium = ''
    let greenLow = 'b6c2ff94';

    let black = '000'
    let white = 'ffffff';

    // Variables de colores-
    let grisFuerte = 'd4d4d4'
    let grisMedio = 'ebe8e8'
    let grisSuave = 'f3f3f3';

    let redHard = '9a2929';
    let redMedium = 'ffa4a4';
    let redLow = 'ffd6d6';


    //Agregamos la leyenda
    // segimos en la misma linea.
    let position = [posit, posit];
    // le sumo 7 celdas por que la logitud de la leyenda es 7celdas
    let positionColumn = [colum, colum + 11];
    let posititonRow = posit;
    this.addStyleByColums(worksheet, position, positionColumn, 'LEGEND', 10, colorYellowTransgas, blueHard3, '')
    this.addBorder(worksheet, posit, colum, 'thick', blueHard3, '');

    //ITEM
    // Le damos un salto vacio.
    posititonRow = posititonRow + 2;
    // Item de la leyenda
    position = [posititonRow, posititonRow];
    positionColumn = [colum + 1, colum + 1];
    this.addStyleByColums(worksheet, position, positionColumn, '', 10, null, blueHard3, '')
    // texto.
    positionColumn = [colum + 3, colum + 10];
    this.addStyleByColums(worksheet, position, positionColumn, 'Data recorded by the captain', 8, black, white, '')

    //ITEM
    // bajamos
    posititonRow = posititonRow + 1;
    // Item de la leyenda
    position = [posititonRow, posititonRow];
    positionColumn = [colum + 1, colum + 1];
    this.addStyleByColums(worksheet, position, positionColumn, '', 10, null, blueHard2, '')
    // texto.
    positionColumn = [colum + 3, colum + 10];
    this.addStyleByColums(worksheet, position, positionColumn, 'Value obtained by a formula.', 8, black, white, '')


    //ITEM
    // bajamos
    posititonRow = posititonRow + 1;
    // Item de la leyenda
    position = [posititonRow, posititonRow];
    positionColumn = [colum + 1, colum + 1];
    this.addStyleByColums(worksheet, position, positionColumn, '0', 10, grisSuave, null, '')
    // texto.
    positionColumn = [colum + 3, colum + 10];
    this.addStyleByColums(worksheet, position, positionColumn, 'Null value', 8, black, white, '')


    //ITEM
    // bajamos
    posititonRow = posititonRow + 1;
    // Item de la leyenda
    position = [posititonRow, posititonRow];
    positionColumn = [colum + 1, colum + 1];
    this.addStyleByColums(worksheet, position, positionColumn, '', 10, null, greenLow, '')
    // texto.
    positionColumn = [colum + 3, colum + 10];
    this.addStyleByColums(worksheet, position, positionColumn, 'Positive value', 8, black, white, '')


    //ITEM
    // bajamos
    posititonRow = posititonRow + 1;
    // Item de la leyenda
    position = [posititonRow, posititonRow];
    positionColumn = [colum + 1, colum + 1];
    this.addStyleByColums(worksheet, position, positionColumn, '', 10, null, redLow, '')
    // texto.
    positionColumn = [colum + 3, colum + 10];
    this.addStyleByColums(worksheet, position, positionColumn, 'Negative value', 8, black, white, '')


    // disminuimos las filas registradas
    position = [posititonRow - 5, posititonRow = posititonRow + 1];
    positionColumn = [colum, colum + 11];
    this.addStyleBorder(worksheet, position, positionColumn, 'thick', blueHard3)

    return posititonRow;
  }
  private StyleDashBuque(worksheet, posit, colum, selectUser: User): number {
    let date_start = '22/22/22'
    let hour_start = '20:20'
    let ifo_start = 200;
    let mgo_start = 300;
    let date_end = '22/22/22'
    let hour_end = '22:21'
    let ifo_end = 222;
    let mgo_end = 440;
    let totalBunkeringIFO = 0;
    let totalBunkeringMGO = 0;

    let totalConsumptIFO = 0;
    let totalConsumptMGO = 0;



    let colorYellowTransgas = 'FFCD06';
    // Variables de colores-
    let blueHard = '001556'
    let blueMedium = '09155694'
    let blueLow = 'b6c2ff94';


    let blueHard1 = '375f9a'
    let blueHard2 = '0040d8'
    let blueHard3 = '001556'

    let greenHard = '091556'
    let greenMedium = ''
    let greenLow = 'b6c2ff94';

    let black = '000000'
    let white = 'ffffff';

    // Variables de colores-
    let grisFuerte = 'd4d4d4'
    let grisMedio = 'ebe8e8'
    let grisSuave = 'f3f3f3';

    let redHard = '9a2929';
    let redMedium = 'ffa4a4';
    let redLow = 'ffd6d6';

    let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';


    //Agregamos la leyenda
    // segimos en la misma linea.
    let positionRows = [posit, posit];
    colum += 1;
    positionRows = [posit, posit];
    let positionColumns = [colum, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.name, 15, blueHard3, white, '')
    this.addBorder(worksheet, posit, colum, 'thick', blueHard3, '');

    positionColumns = [colum + 10, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, textIFOorVLSFOorLSFO, 8, white, blueHard3, '')

    positionColumns = [colum + 12, colum + 13];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'MGO', 8, white, blueHard3, '')


    posit += 1;
    // Start date
    positionRows = [posit, posit];
    positionColumns = [colum, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'START DATE', 8, black, white, '');
    // date start
    positionColumns = [colum + 5, colum + 7];
    this.addStyleByColums(worksheet, positionRows, positionColumns, date_start, 8, black, white, '');
    // date start
    positionColumns = [colum + 8, colum + 9];
    this.addStyleByColums(worksheet, positionRows, positionColumns, hour_start, 8, black, white, '');
    // IFO start
    positionColumns = [colum + 10, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, ifo_start, 8, black, white, '');
    //MGO Start
    positionColumns = [colum + 12, colum + 13];
    this.addStyleByColums(worksheet, positionRows, positionColumns, mgo_start, 8, black, white, '');


    posit += 1;
    // Start date
    positionRows = [posit, posit];
    positionColumns = [colum + 6, colum + 9];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'Total Bunkering', 8, black, white, '');
    // IFO start
    positionColumns = [colum + 10, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, totalBunkeringIFO, 8, black, white, '');
    //MGO Start
    positionColumns = [colum + 12, colum + 13];
    this.addStyleByColums(worksheet, positionRows, positionColumns, totalBunkeringMGO, 8, black, white, '');


    posit += 1;
    // Start date
    positionRows = [posit, posit];
    positionColumns = [colum + 6, colum + 9];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'Total Consumption', 8, black, white, '');
    // IFO start
    positionColumns = [colum + 10, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, totalConsumptIFO, 8, black, white, '');
    //MGO Start
    positionColumns = [colum + 12, colum + 13];
    this.addStyleByColums(worksheet, positionRows, positionColumns, totalConsumptMGO, 8, black, white, '');


    posit += 1;
    // Start date
    positionRows = [posit, posit];
    positionColumns = [colum, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'END DATE', 8, black, white, '');
    // date start
    positionColumns = [colum + 5, colum + 7];
    this.addStyleByColums(worksheet, positionRows, positionColumns, date_end, 8, black, white, '');
    // date start
    positionColumns = [colum + 8, colum + 9];
    this.addStyleByColums(worksheet, positionRows, positionColumns, hour_end, 8, black, white, '');
    // IFO start
    positionColumns = [colum + 10, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, ifo_end, 8, black, white, '');
    //MGO Start
    positionColumns = [colum + 12, colum + 13];
    this.addStyleByColums(worksheet, positionRows, positionColumns, mgo_end, 8, black, white, '');


    positionColumns = [colum, colum + 13];
    // Lineas suabes internas
    positionRows = [posit - 3, posit - 3];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, false, true, true)

    positionRows = [posit - 2, posit - 2];
    positionColumns = [colum + 6, colum + 13];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, false, true, true)
    positionRows = [posit - 1, posit - 1];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, false, true, true)

    positionRows = [posit, posit];
    positionColumns = [colum, colum + 13];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, false, true, true)

    // BOrde alrededor.
    positionRows = [posit - 3, posit];
    positionColumns = [colum, colum + 13];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false)


    positionRows = [posit - 4, posit - 4];
    positionColumns = [colum + 10, colum + 13];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false)


    return posit;
  }
  private StyleDashSpeed(worksheet, posit, colum, selectUser: User): number {
    let date_start = '22/22/22'
    let hour_start = '20:20'
    let ifo_start = 200;
    let mgo_start = 300;
    let date_end = '22/22/22'
    let hour_end = '22:21'
    let ifo_end = 222;
    let mgo_end = 440;
    let totalBunkeringIFO = 0;
    let totalBunkeringMGO = 0;

    let totalConsumptIFO = 0;
    let totalConsumptMGO = 0;



    let colorYellowTransgas = 'FFCD06';
    // Variables de colores-
    let blueHard = '001556'
    let blueMedium = '09155694'
    let blueLow = 'b6c2ff94';


    let blueHard1 = '375f9a'
    let blueHard2 = '0040d8'
    let blueHard3 = '001556'

    let greenHard = '091556'
    let greenMedium = ''
    let greenLow = 'b6c2ff94';

    let black = '000'
    let white = 'ffffff';

    // Variables de colores-
    let grisFuerte = 'd4d4d4'
    let grisMedio = 'ebe8e8'
    let grisSuave = 'f3f3f3';

    let redHard = '9a2929';
    let redMedium = 'ffa4a4';
    let redLow = 'ffd6d6';

    let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';
    //44
    /* 
       let positionRows = [posit, posit];
        colum += 1;
        positionRows = [posit, posit];
        let positionColumns = [colum, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.name, 15, blueHard3, white, '')
        this.addBorder(worksheet, posit, colum, '', blueHard3, '');
    */

    let positionRows = [posit, posit + 1];
    let positionColumns = [colum, colum + 1];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'SPEED', 10, colorYellowTransgas, blueHard3, '')

    positionRows = [posit, posit];
    positionColumns = [colum + 2, colum + 3];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'CHARTER', 8, white, blueHard3, '')

    positionColumns = [colum + 4, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'PERFORMEND', 5, white, blueHard2, '')

    posit += 1;
    positionRows = [posit, posit];

    // FULL Y ECO Charter SPEED
    positionColumns = [colum + 2, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'FULL', 8, white, blueHard3, '')
    positionColumns = [colum + 3, colum + 3];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'ECO', 8, white, blueHard3, '')

    // FULL Y ECO Performan SPEED
    positionColumns = [colum + 4, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'FULL', 8, white, blueHard2, '')
    positionColumns = [colum + 5, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'ECO', 8, white, blueHard2, '')


    posit += 1;
    positionRows = [posit, posit];


    // FULL Y ECO Charter SPEED IFO
    positionColumns = [colum, colum + 1];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'Ballast', 8, black, white, '');
    positionColumns = [colum + 2, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.sailingBallastConsumptionIFO, 8, black, white, '');
    positionColumns = [colum + 3, colum + 3];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.sailingEconomicConsumptionIFO, 8, black, white, '');

    // FULL Y ECO Performan SPEED
    positionColumns = [colum + 4, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'E4', 8, black, white, '');
    positionColumns = [colum + 5, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'E5', 8, black, white, '')




    posit += 1;
    positionRows = [posit, posit];


    // FULL Y ECO Charter SPEED IFO
    positionColumns = [colum, colum + 1];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'Laden', 8, black, white, '');
    positionColumns = [colum + 2, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.contractSpeedSailingLadenIFO, 8, black, white, '');
    positionColumns = [colum + 3, colum + 3];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.sailingEconomicConsumptionIFO, 8, black, white, '');

    // FULL Y ECO Performan SPEED
    positionColumns = [colum + 4, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'E4', 8, black, white, '');
    positionColumns = [colum + 5, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'E5', 8, black, white, '')












    // Linea abajo
    positionRows = [posit - 1, posit - 1];
    positionColumns = [colum, colum + 3];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, true)

    positionColumns = [colum + 4, colum + 5];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard2, false, false, true, true)

    positionRows = [posit, posit];
    positionColumns = [colum, colum + 3];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, true)
    positionColumns = [colum + 4, colum + 5];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard2, false, false, true, true)







    // BOrde final alrededor
    positionColumns = [colum, colum + 3];
    // Lineas suabes internas
    positionRows = [posit - 3, posit];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false)

    positionColumns = [colum + 4, colum + 5];
    // Lineas suabes internas
    positionRows = [posit - 3, posit];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard2, false, false, false, false)


    return posit;
  }
  private StyleDashActivity(worksheet, posit, colum, selectUser: User): number {
    let date_start = '22/22/22'
    let hour_start = '20:20'
    let ifo_start = 200;
    let mgo_start = 300;
    let date_end = '22/22/22'
    let hour_end = '22:21'
    let ifo_end = 222;
    let mgo_end = 440;
    let totalBunkeringIFO = 0;
    let totalBunkeringMGO = 0;

    let totalConsumptIFO = 0;
    let totalConsumptMGO = 0;



    let colorYellowTransgas = 'FFCD06';
    // Variables de colores-
    let blueHard = '001556'
    let blueMedium = '09155694'
    let blueLow = 'b6c2ff94';


    let blueHard1 = '375f9a'
    let blueHard2 = '0040d8'
    let blueHard3 = '001556'

    let greenHard = '091556'
    let greenMedium = ''
    let greenLow = 'b6c2ff94';

    let black = '000'
    let white = 'ffffff';

    // Variables de colores-
    let grisFuerte = 'd4d4d4'
    let grisMedio = 'ebe8e8'
    let grisSuave = 'f3f3f3';

    let redHard = '9a2929';
    let redMedium = 'ffa4a4';
    let redLow = 'ffd6d6';

    let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';


    let positionRows = [posit, posit];
    let positionColumns = [colum, colum + 6];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'DAILY CONSUMPTION', 10, colorYellowTransgas, blueHard3, '')


    // 51
    posit += 1;

    // Actividades. dailyconsumption
    positionRows = [posit, posit];
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'LOADING', 7, black, white, '')
    positionColumns = [colum + 3, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.loadingConsumptionIFO, 10, black, white, '')
    positionColumns = [colum + 5, colum + 6];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 666, 10, black, white, '')

    posit += 1;
    positionRows = [posit, posit];

    // Actividades. dailyconsumption
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'DOWNLOADING', 7, black, white, '')

    positionColumns = [colum + 3, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.dischargeConsumptionIFO, 10, black, white, '')
    positionColumns = [colum + 5, colum + 6];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 666, 10, black, white, '')


    posit += 1;
    positionRows = [posit, posit];

    // Actividades. dailyconsumption
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'BALLAST', 7, black, white, '')

    positionColumns = [colum + 3, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.sailingBallastConsumptionIFO, 10, black, white, '')
    positionColumns = [colum + 5, colum + 6];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 888, 10, black, white, '')


    posit += 1;
    positionRows = [posit, posit];

    // Actividades. dailyconsumption
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'LADEN', 7, black, white, '')

    positionColumns = [colum + 3, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.contractSpeedSailingLadenIFO, 10, black, white, '')
    positionColumns = [colum + 5, colum + 6];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 888, 10, black, white, '')

    posit += 1;
    positionRows = [posit, posit];

    // Actividades. dailyconsumption
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'ECONOMICAL', 7, black, white, '')

    positionColumns = [colum + 3, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.sailingEconomicConsumptionIFO, 10, black, white, '')
    positionColumns = [colum + 5, colum + 6];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 888, 10, black, white, '')




    posit += 1;
    positionRows = [posit, posit];

    // Actividades. dailyconsumption
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'ANCHORED', 7, black, white, '')

    positionColumns = [colum + 3, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.anchoredConsumptionIFO, 10, black, white, '')
    positionColumns = [colum + 5, colum + 6];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 888, 10, black, white, '')



    posit += 1;
    positionRows = [posit, posit];

    // Actividades. dailyconsumption
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'MANEUVER', 7, black, white, '')

    positionColumns = [colum + 3, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.maneuverConsumptionIFO, 10, black, white, '')
    positionColumns = [colum + 5, colum + 6];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 888, 10, black, white, '')



    posit += 1;
    positionRows = [posit, posit];

    // Actividades. dailyconsumption
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'OTHER', 7, black, white, '')

    positionColumns = [colum + 3, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.otherConsumptionIFO, 10, black, white, '')
    positionColumns = [colum + 5, colum + 6];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 888, 10, black, white, '')



    // Lineas suabes internas
    positionRows = [posit - 8, posit];
    positionColumns = [colum, colum];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
    positionColumns = [colum + 3, colum + 3];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
    positionColumns = [colum + 5, colum + 5];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)


    // BOrde final alrededor
    positionColumns = [colum, colum + 6];
    this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false)


    /* 
      let positionRows = [posit, posit + 1];
      let positionColumns = [colum, colum + 1];
      this.addStyleByColums(worksheet, positionRows, positionColumns, 'SPEED', 10, colorYellowTransgas, blueHard3, '') */

    /* 
        this.addBorder(worksheet, posit, colum, '', blueHard3, 'leftLowRorner');
        this.addBorder(worksheet, posit, colum + 13, '', blueHard3, 'righLowRorner')
        this.addBorder(worksheet, posit - 3, colum + 5, '', blueHard3, 'top')
        this.addBorder(worksheet, posit - 3, colum + 8, '', blueHard3, 'top')
     */
    return posit;
  }
  private StyleDashCosumption(worksheet, posit, colum, selectUser: User): number {
    let date_start = '22/22/22'
    let hour_start = '20:20'
    let ifo_start = 200;
    let mgo_start = 300;
    let date_end = '22/22/22'
    let hour_end = '22:21'
    let ifo_end = 222;
    let mgo_end = 440;
    let totalBunkeringIFO = 0;
    let totalBunkeringMGO = 0;

    let totalConsumptIFO = 0;
    let totalConsumptMGO = 0;



    let colorYellowTransgas = 'FFCD06';
    // Variables de colores-
    let blueHard = '001556'
    let blueMedium = '09155694'
    let blueLow = 'b6c2ff94';


    let blueHard1 = '375f9a'
    let blueHard2 = '0040d8'
    let blueHard3 = '001556'

    let greenHard = '091556'
    let greenMedium = ''
    let greenLow = 'b6c2ff94';

    let black = '000'
    let white = 'ffffff';

    // Variables de colores-
    let grisFuerte = 'd4d4d4'
    let grisMedio = 'ebe8e8'
    let grisSuave = 'f3f3f3';

    let redHard = '9a2929';
    let redMedium = 'ffa4a4';
    let redLow = 'ffd6d6';

    let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';

    // Primer titulo
    let positionRows = [posit, posit];
    let positionColumns = [colum, colum + 35];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'VESSEL PERFORMANCE ' + textIFOorVLSFOorLSFO, 10, colorYellowTransgas, blueHard3, '')

    let startRowReport = posit + 24;

    //================AGREGAMOS LA CEBECERA=========
    // TItulo 
    posit += 1;
    positionRows = [posit, posit + 1];
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'ACTIVITY\nPERFORMED', 8, white, blueHard1, '')
    positionColumns = [colum + 3, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'TOTAL TIME\nPER ACTIVITY\n(HRS)', 8, white, blueHard1, '')
    positionColumns = [colum + 6, colum + 8];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'TOTAL DISTANCE (MILES)', 8, white, blueHard1, '')
    positionColumns = [colum + 9, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'AVERAGE SPEED\n(MILES/HRS)', 8, white, blueHard2, '')
    positionColumns = [colum + 12, colum + 14];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'AVERAGE SPEED\n(MILES/HRS)\n(CHARTER)', 8, white, blueHard3, '')
    positionColumns = [colum + 15, colum + 17];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'TOTAL CONSUMPTION\n(MT)', 8, white, blueHard1, '')
    positionColumns = [colum + 18, colum + 20];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'DAILY CONSUMPTION\n(MT)', 8, white, blueHard2, '')
    positionColumns = [colum + 21, colum + 23];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'DAILY CONSUMPTION\n(MT) (CHARTER)', 8, white, blueHard3, '')
    positionColumns = [colum + 24, colum + 26];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'SAILING TIME\n(HRS) (CHARTER)', 8, white, blueHard3, '')
    positionColumns = [colum + 27, colum + 29];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'TOTAL CONSUMPTION\n(MT) (CHARTER)', 8, white, blueHard3, '')
    positionColumns = [colum + 30, colum + 32];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'BALANCE CONSUMPTION\n(MT)', 8, white, blueHard2, '')
    positionColumns = [colum + 33, colum + 35];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'BALANCE TIME\n(HRS)', 8, white, blueHard2, '')

    //================= Primera actividad Loading
    posit += 2;
    positionRows = [posit, posit];
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'LOADING', 10, blueHard3, white, '')
    positionColumns = [colum + 3, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")  ', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 6, colum + 8];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 9, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/K' + posit + '),0,N' + posit + '/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 12, colum + 14];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
    positionColumns = [colum + 15, colum + 17];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 18, colum + 20];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(W' + posit + '*24/K' + posit + '),0,W' + posit + '*24/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 21, colum + 23];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.loadingConsumptionIFO, 8, blueHard3, white, '')
    positionColumns = [colum + 24, colum + 26];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/T' + posit + '),0,N' + posit + '/T' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 27, colum + 29];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(AF' + posit + '=0, AC' + posit + '*K' + posit + '/24,AC' + posit + '*AF' + posit + '/24)', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 30, colum + 32];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'W' + posit + '-AI' + posit, result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 33, colum + 35];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')

    //================= Primera actividad Discharge
    posit += 1;
    positionRows = [posit, posit];
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'DOWNLOADING', 10, blueHard3, white, '')
    positionColumns = [colum + 3, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")  ', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 6, colum + 8];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 9, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/K' + posit + '),0,N' + posit + '/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 12, colum + 14];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
    positionColumns = [colum + 15, colum + 17];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 18, colum + 20];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(W' + posit + '*24/K' + posit + '),0,W' + posit + '*24/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 21, colum + 23];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.dischargeConsumptionIFO, 8, blueHard3, white, '')
    positionColumns = [colum + 24, colum + 26];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/T' + posit + '),0,N' + posit + '/T' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 27, colum + 29];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(AF' + posit + '=0, AC' + posit + '*K' + posit + '/24,AC' + posit + '*AF' + posit + '/24)', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 30, colum + 32];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'W' + posit + '-AI' + posit, result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 33, colum + 35];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')



    //================= Primera actividad Ballasst
    posit += 1;
    positionRows = [posit, posit];
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'SAILING_IN_BALLAST', 10, blueHard3, white, '')
    positionColumns = [colum + 3, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")  ', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 6, colum + 8];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 9, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/K' + posit + '),0,N' + posit + '/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 12, colum + 14];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.contractSpeedSailingBallastIFO, 8, blueHard3, white, '')
    positionColumns = [colum + 15, colum + 17];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 18, colum + 20];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(W' + posit + '*24/K' + posit + '),0,W' + posit + '*24/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 21, colum + 23];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.sailingBallastConsumptionIFO, 8, blueHard3, white, '')
    positionColumns = [colum + 24, colum + 26];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/T' + posit + '),0,N' + posit + '/T' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 27, colum + 29];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(AF' + posit + '=0, AC' + posit + '*K' + posit + '/24,AC' + posit + '*AF' + posit + '/24)', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 30, colum + 32];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'W' + posit + '-AI' + posit, result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 33, colum + 35];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'K' + posit + '-AF' + posit, result: 0.14 }, 8, blueHard3, white, '')


    //================= Primera actividad Laden
    posit += 1;
    positionRows = [posit, posit];
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'SAILING_WITH_LADEN', 10, blueHard3, white, '')
    positionColumns = [colum + 3, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")  ', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 6, colum + 8];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 9, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/K' + posit + '),0,N' + posit + '/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 12, colum + 14];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.contractSpeedSailingLadenIFO, 8, blueHard3, white, '')
    positionColumns = [colum + 15, colum + 17];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 18, colum + 20];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(W' + posit + '*24/K' + posit + '),0,W' + posit + '*24/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 21, colum + 23];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.sailingLoadConsumptionIFO, 8, blueHard3, white, '')
    positionColumns = [colum + 24, colum + 26];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/T' + posit + '),0,N' + posit + '/T' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 27, colum + 29];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(AF' + posit + '=0, AC' + posit + '*K' + posit + '/24,AC' + posit + '*AF' + posit + '/24)', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 30, colum + 32];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'W' + posit + '-AI' + posit, result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 33, colum + 35];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'K' + posit + '-AF' + posit, result: 0.14 }, 8, blueHard3, white, '')



    //================= Primera actividad ECO
    posit += 1;
    positionRows = [posit, posit];
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'SAILING_WITH_ECONOMICAL', 10, blueHard3, white, '')
    positionColumns = [colum + 3, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")  ', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 6, colum + 8];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 9, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/K' + posit + '),0,N' + posit + '/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 12, colum + 14];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.contractSpeedSailingEconomicalIFO, 8, blueHard3, white, '')
    positionColumns = [colum + 15, colum + 17];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 18, colum + 20];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(W' + posit + '*24/K' + posit + '),0,W' + posit + '*24/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 21, colum + 23];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.sailingEconomicConsumptionIFO, 8, blueHard3, white, '')
    positionColumns = [colum + 24, colum + 26];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/T' + posit + '),0,N' + posit + '/T' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 27, colum + 29];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(AF' + posit + '=0, AC' + posit + '*K' + posit + '/24,AC' + posit + '*AF' + posit + '/24)', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 30, colum + 32];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'W' + posit + '-AI' + posit, result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 33, colum + 35];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'K' + posit + '-AF' + posit, result: 0.14 }, 8, blueHard3, white, '')


    //================= Primera actividad ANCHORED
    posit += 1;
    positionRows = [posit, posit];
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'ANCHORED', 10, blueHard3, white, '')
    positionColumns = [colum + 3, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")  ', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 6, colum + 8];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 9, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/K' + posit + '),0,N' + posit + '/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 12, colum + 14];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
    positionColumns = [colum + 15, colum + 17];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 18, colum + 20];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(W' + posit + '*24/K' + posit + '),0,W' + posit + '*24/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 21, colum + 23];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.anchoredConsumptionIFO, 8, blueHard3, white, '')
    positionColumns = [colum + 24, colum + 26];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/T' + posit + '),0,N' + posit + '/T' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 27, colum + 29];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(AF' + posit + '=0, AC' + posit + '*K' + posit + '/24,AC' + posit + '*AF' + posit + '/24)', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 30, colum + 32];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'W' + posit + '-AI' + posit, result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 33, colum + 35];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')

    //================= Primera actividad ANCHORED
    posit += 1;
    positionRows = [posit, posit];
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'MANEUVER', 10, blueHard3, white, '')
    positionColumns = [colum + 3, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")  ', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 6, colum + 8];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 9, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/K' + posit + '),0,N' + posit + '/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 12, colum + 14];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
    positionColumns = [colum + 15, colum + 17];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 18, colum + 20];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(W' + posit + '*24/K' + posit + '),0,W' + posit + '*24/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 21, colum + 23];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.maneuverConsumptionIFO, 8, blueHard3, white, '')
    positionColumns = [colum + 24, colum + 26];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/T' + posit + '),0,N' + posit + '/T' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 27, colum + 29];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(AF' + posit + '=0, AC' + posit + '*K' + posit + '/24,AC' + posit + '*AF' + posit + '/24)', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 30, colum + 32];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'W' + posit + '-AI' + posit, result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 33, colum + 35];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')

    //================= Primera actividad OTHER
    posit += 1;
    positionRows = [posit, posit];
    positionColumns = [colum, colum + 2];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'OTHER_ACT', 10, blueHard3, white, '')
    positionColumns = [colum + 3, colum + 5];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")  ', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 6, colum + 8];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 9, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/K' + posit + '),0,N' + posit + '/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 12, colum + 14];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
    positionColumns = [colum + 15, colum + 17];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$163,$W$' + startRowReport + ':$W$163,H' + posit + ',$AZ$' + startRowReport + ':$AZ$163,">0")', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 18, colum + 20];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(W' + posit + '*24/K' + posit + '),0,W' + posit + '*24/K' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 21, colum + 23];
    this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.otherConsumptionIFO, 8, blueHard3, white, '')
    positionColumns = [colum + 24, colum + 26];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(N' + posit + '/T' + posit + '),0,N' + posit + '/T' + posit + ')', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 27, colum + 29];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(AF' + posit + '=0, AC' + posit + '*K' + posit + '/24,AC' + posit + '*AF' + posit + '/24)', result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 30, colum + 32];
    this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'W' + posit + '-AI' + posit, result: 0.14 }, 8, blueHard3, white, '')
    positionColumns = [colum + 33, colum + 35];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')

    // { formula: 'AND( AI' + position + ' <12, AI' + position + ' > 0 )' }
    /* 
        // 51
        posit += 1;
    
        // Actividades. dailyconsumption
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'LOADING', 7, black, white, '')
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.loadingConsumptionIFO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 666, 10, black, white, '')
    
        posit += 1;
        positionRows = [posit, posit];
    
        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'DOWNLOADING', 7, black, white, '')
    
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.dischargeConsumptionIFO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 666, 10, black, white, '')
    
    
        posit += 1;
        positionRows = [posit, posit];
    
        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'BALLAST', 7, black, white, '')
    
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.sailingBallastConsumptionIFO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 888, 10, black, white, '')
    
    
        posit += 1;
        positionRows = [posit, posit];
    
        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'LADEN', 7, black, white, '')
    
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.contractSpeedSailingLadenIFO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 888, 10, black, white, '')
    
        posit += 1;
        positionRows = [posit, posit];
    
        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'ECONOMICAL', 7, black, white, '')
    
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.sailingEconomicConsumptionIFO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 888, 10, black, white, '')
    
    
    
    
        posit += 1;
        positionRows = [posit, posit];
    
        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'ANCHORED', 7, black, white, '')
    
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.anchoredConsumptionIFO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 888, 10, black, white, '')
    
    
    
        posit += 1;
        positionRows = [posit, posit];
    
        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'MANEUVER', 7, black, white, '')
    
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.maneuverConsumptionIFO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 888, 10, black, white, '')
    
    
    
        posit += 1;
        positionRows = [posit, posit];
    
        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'OTHER', 7, black, white, '')
    
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.otherConsumptionIFO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 888, 10, black, white, '')
    
    
    
        // Lineas suabes internas
        positionRows = [posit - 8, posit];
        positionColumns = [colum, colum];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionColumns = [colum + 3, colum + 3];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionColumns = [colum + 5, colum + 5];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
    
    
        // BOrde final alrededor
        positionColumns = [colum, colum + 6];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false)
    
    
        /* 
          let positionRows = [posit, posit + 1];
          let positionColumns = [colum, colum + 1];
          this.addStyleByColums(worksheet, positionRows, positionColumns, 'SPEED', 10, colorYellowTransgas, blueHard3, '') */

    /* 
        this.addBorder(worksheet, posit, colum, '', blueHard3, 'leftLowRorner');
        this.addBorder(worksheet, posit, colum + 13, '', blueHard3, 'righLowRorner')
        this.addBorder(worksheet, posit - 3, colum + 5, '', blueHard3, 'top')
        this.addBorder(worksheet, posit - 3, colum + 8, '', blueHard3, 'top')
     */
    return posit;
  }


}
