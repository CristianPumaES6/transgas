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
  public async ExportExcel(selectUserId: number, startDate: string, endDate: string, selectUser: User) {
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

            this.ReportVoyage(workbook, title, listGetReportVoyagePortDaily, selectUser)
            for (const getReportVoyagePortDaily of listGetReportVoyagePortDaily) {

            }

            // Escribimos el excel
            workbook.xlsx.writeBuffer().then((data) => {
              let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              fs.saveAs(blob, 'Report.xlsx');
            });

          }
        )
  }

  private ReportVoyage(workbook: Workbook, title: string, listGetReportVoyagePortDaily: GetReportVoyagePortDaily[], selectUser: User): Workbook {

    let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';

    // Creamos la hoja de trabajo.
    let worksheet = workbook.addWorksheet('Voyage ' + 2);
    //  let titleRow = worksheet.addRow(['Voyage','Date','Hour','Time','Activity Performed','Observation' ]);

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

    // Variables de colores-
    let blueHard = '091556'
    let blueMedium = '09155694'
    let blueLow = 'b6c2ff94';

    let greenHard = '091556'
    let greenMedium = '09155694'
    let greenLow = 'b6c2ff94';

    let black = '000'
    let white = 'ffffff';

    let grisSuave = 'f3f3f3';
    worksheet.getCell('AR' + position).value = textIFOorVLSFOorLSFO + " CONSUMPTION IN MT";
    worksheet.getCell('AR' + position).style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      font: {
        size: 20,
        bold: true,
        color: { argb:greenLow  },
      },
      fill: {
        type: 'pattern',
        pattern: 'lightGray',
        bgColor: {
          argb: blueHard
        }
      },

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
        color: { argb:greenLow  },
      },
      fill: {
        type: 'pattern',
        pattern: 'lightGray',
        bgColor: {
          argb: blueMedium
        }
      },

    }
    worksheet.mergeCells('BH' + position, 'CA' + position);

    position += 1;
    worksheet.getCell('AJ' + position).value = "NAVIGATION DATA";
    worksheet.mergeCells('AJ' + position, 'AQ' + position);

    worksheet.getCell('AR' + position).value = "PREVIOUS VOYAGE";
    worksheet.mergeCells('AR' + position, 'BD' + position);
    worksheet.getCell('BE' + position).value = 200;
    worksheet.mergeCells('BE' + position, 'BG' + position);

    worksheet.getCell('BH' + position).value = "PREVIOUS VOYAGE";
    worksheet.mergeCells('BH' + position, 'BX' + position);
    worksheet.getCell('BY' + position).value = 200;
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
          getReportVoyagePortDaily.date, '', '',
          getReportVoyagePortDaily.hour, '',
          getReportVoyagePortDaily.steamingTime, '',
          getReportVoyagePortDaily.activityPerformed, '', '', '',


          getReportVoyagePortDaily.speedStraction, '',

          getReportVoyagePortDaily.observation, '', '', '', '', '', '',

          getReportVoyagePortDaily.distance, '',
          // Solo si es de la actividad de navegacion deberia de agregarse.
          getReportVoyagePortDaily.steamingTime, '',
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
          worksheet.getCell('BF' + position).value = <any>{ formula: 'BE' + (position - 2) + '-AZ' + position + '+BD' + position };
          worksheet.getCell('BZ' + position).value = <any>{ formula: 'BY' + (position - 2) + '-BT' + position + '+BX' + position };

          this.addFormatting(worksheet, position)
        } else {
          this.addFormatting(worksheet, position)
        }



      }

    );

    console.log('Fin');

    return workbook;
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
          priority: 13,
          operator: 'equal',
          formulae: [0],
          style: {
            border: {},
            font: { color: { argb: grisMedio } },
            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: grisSuave } },
          },
        },
        // Menor que 
        {
          type: 'expression',
          priority: 3,
          formulae: ['AND( AN' + position + ' <12, AN' + position + ' > 0 )'],
          style: {
            font: { color: { argb: redHard } },
            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
          },
        },
        // Mayor que 
        {
          type: 'expression',
          priority: 3,
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
}
