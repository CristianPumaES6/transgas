
import { Injectable } from '@angular/core';
import { CellFormulaValue, TableProperties, Workbook, Worksheet } from 'exceljs';

import * as fs from 'file-saver';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { mathRound } from '../../../assets/math/math.assets';
import { ConvertMMDDYYYYHHmmToMomment, ConvertMomentUTC, FormatDate, FormatDateUTCToDateHour } from '../../../assets/moment/moment.assets';
import { GetROBByUser, InfoFuelStartEndForDate } from '../../models/daily-report';
import { ActivityPerformed } from '../../models/dashboard';
import { GetReportVoyagePortDaily, GetReportVoyagePortDaily2 } from '../../models/dialog-export-excel';
import { User } from '../../models/user';
import { Voyage } from '../../models/voyage';
import { DailyReportService } from '../daily-report.service';
import { LanguageService } from '../language.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelFormatVesselDataRegisterService {

  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'exportExcel';

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

  // Opcion que exporta el excel.
  public async ExportExcel(selectUserId: number, startDate: string, endDate: string, selectUser: User): Promise<boolean> {

    // Creamos una nueva hoja de trabajo
    let workbook = new Workbook();
    workbook.creator = 'transgas.web.app';


    let listGetReportVoyagePortDaily: GetReportVoyagePortDaily2[] = [];
    let getInfoFuelStartEndByFilterDate: InfoFuelStartEndForDate;

    return await Promise.resolve(true)
      .then(
        result => {
          // Buscamos los  reportes registrados por filtro de usuario y fecha
          return this.GetReportVoyagePortDaily(selectUserId, startDate, endDate).pipe().toPromise();
        }).then(
          result => {
            // validamos
            if (!result) throw 'ERROR GER REPORT FOR USER';
            // guardamos los datos en una variable.
            listGetReportVoyagePortDaily = result;


            // Buscamos la informacion del combustible de inicio y fin segun la fecha.
            return this.GetInfoFuelStartEndByFilterDate(selectUserId, startDate, endDate).pipe().toPromise();
          }).then(
            result => {

              // Validamos
              if (!result) { throw 'ERROR GER REPORT' };
              
              
              // Guardamos los datos en una variable.
              getInfoFuelStartEndByFilterDate = result;

              // Armamos el reporte.
              this.GenerateExportReportVessel(workbook, listGetReportVoyagePortDaily, getInfoFuelStartEndByFilterDate, selectUser)

              // Escribimos el excel
              workbook.xlsx.writeBuffer().then(
                (data) => {
                  let blob = new Blob(
                    [data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
                  );
                  fs.saveAs(blob, 'DATA REGISTER ' + selectUser.name.toUpperCase() + '.xlsx');
                }
              );

              return true;
            }
          );
  }


  // Agrega el reporte.
  private GenerateExportReportVessel(workbook: Workbook, listGetReportVoyagePortDaily: GetReportVoyagePortDaily[], getInfoFuelStartEndByFilterDate: InfoFuelStartEndForDate, selectUser: User): Workbook {

    // tipo de combustible.
    let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';

    // Creamos la hoja de trabajo.
    let worksheet = workbook.addWorksheet('Report register');
    //  let titleRow = worksheet.addRow(['Voyage','Date','Hour','Time','Activity Performed','Observation' ]);


    let totalBunkeringIfo = 0;
    // Hasta la E las columnas son invisibles para guardar algo.
    // apartir de la F todas las columnas tienen el mismo tamanio
    worksheet.columns = [
      { width: 4 }, // A   voyageId
      { width: 4 }, // B   portId 
      { width: 4 }, // C   dailyReportId
      { width: 4 }, // D   userId
      { width: 4 }, // E   year
      { width: 8 }, // F Numero Viaje
      { width: 16 }, // G Departure
      { width: 16 }, // H Arrival
      { width: 16 }, // I DATE UTC
      { width: 8 }, // J   Hour
      { width: 14 }, // k    steamingTime2
      { width: 10 }, //  L  ACTIVITY
      { width: 8 }, //  M     Tipo de velocidad
      { width: 24 }, // N     Observacione
      { width: 8 }, // Distance
      { width: 8 }, // P   steamingTime2
      { width: 8 }, //Q    SPEED
      { width: 8 },  //R   BEFOUR
      { width: 8 },  //S    MPLA
      { width: 8 },  //T AUX
      { width: 8 },  // U Boiler ifo
      { width: 8 }, // V other
      { width: 8 }, // Total Consumop
      { width: 8 }, // COnsumo diario
      { width: 8 }, // BUNKERING
      { width: 8 }, // Z  ROB
      { width: 8 }, // AA     mplaMGO
      { width: 8 }, // AB auxMGO 
      { width: 8 }, // AC Boilker
      { width: 8 }, // AD 
      { width: 8 }, // AE
      { width: 8 }, //AF
      { width: 8 }, // AG
      { width: 8 }, // AH
      { width: 8 }, // AI
      { width: 8 }, //AK
      { width: 8 }, /// AL
      { width: 8 }, // AM
      { width: 8 }, // AN
      { width: 8 }, // AO
      { width: 8 }, // AP
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
      { width: 8 },
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

    // La posicion inicio en la fila 3
    let position = 3;

    // Nos ubicamos en una posicion para empezar a poner los row
    // this.mergeCellReport(worksheet, position);

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


    let positionColumn = 7
    let positionRow = position;


    let tamanioTableReport = this.AddReportTable(worksheet, positionRow, positionColumn, selectUser, textIFOorVLSFOorLSFO,getInfoFuelStartEndByFilterDate);

    positionRow = tamanioTableReport;


    listGetReportVoyagePortDaily.forEach(
      (getReportVoyagePortDaily, index) => {



        positionRow += 1;
        let dataRow = [
          getReportVoyagePortDaily.voyageId,
          getReportVoyagePortDaily.portId,
          getReportVoyagePortDaily.dailyReportId,
          getReportVoyagePortDaily.year,
          getReportVoyagePortDaily.voyageNumber,
          getReportVoyagePortDaily.portNumber,
          getReportVoyagePortDaily.departurePort,
          getReportVoyagePortDaily.arrivalPort,
          getReportVoyagePortDaily.date,
          getReportVoyagePortDaily.hour,
          getReportVoyagePortDaily.steamingTime,
          //{ formula: 'IFERROR((I' + positionRow + ' - I' + (positionRow - 1) + ')*24,0)' },
          //this.languageService.GetMessage(this.translateCategory, getReportVoyagePortDaily.activityPerformed), // REVISAR ERROR REVISAR
          getReportVoyagePortDaily.activityPerformed,
          this.languageService.GetMessage(this.translateCategory, getReportVoyagePortDaily.speedStraction), // REVISAR ERROR REVISAR
          getReportVoyagePortDaily.observation,
          getReportVoyagePortDaily.distance,
          // Solo si es de la actividad de navegacion deberia de agregarse.
          { formula: 'IFERROR((I' + positionRow + ' - I' + (positionRow - 1) + ')*24,0)' },
          // Velocidad formula.
          { formula: 'IF(ISERROR(O' + positionRow + '/P' + positionRow + '),0,O' + positionRow + '/P' + positionRow + ')' },
          getReportVoyagePortDaily.beaufour,
          //IFO
          getReportVoyagePortDaily.mplaIfo,
          getReportVoyagePortDaily.auxIfo,
          getReportVoyagePortDaily.boilerIfo,
          getReportVoyagePortDaily.otherIfo,
          // Total
          { formula: 'SUM(S' + positionRow + ':V' + positionRow + ')' },
          // dailyConsumption
          { formula: 'IF(ISERROR(' + 'W' + positionRow + '*24/' + 'P' + positionRow + '),0,' + 'W' + positionRow + '*24/' + 'P' + positionRow + ')' },
          getReportVoyagePortDaily.bunkeringIfo,
          // RobIFO
          { formula: 'Z' + (positionRow - 1) + '-W' + positionRow + '+Y' + positionRow },

          getReportVoyagePortDaily.mplaMgo,
          getReportVoyagePortDaily.auxMgo,
          getReportVoyagePortDaily.boilerMgo,
          getReportVoyagePortDaily.ppMgo,
          getReportVoyagePortDaily.giMgo,
          getReportVoyagePortDaily.otherMgo,
          // Total
          { formula: 'SUM(AA' + positionRow + ':AF' + positionRow + ')' },
          // dailyConsumption
          { formula: 'IF(ISERROR(' + 'AG' + positionRow + '*24/' + 'P' + positionRow + '),0,' + 'AG' + positionRow + '*24/' + 'P' + positionRow + ')' },
          getReportVoyagePortDaily.bunkeringMgo,
          // RobIFO
          { formula: 'AJ' + (positionRow - 1) + '-AG' + positionRow + '+AI' + positionRow },

          getReportVoyagePortDaily.north_degree,
          getReportVoyagePortDaily.north_minutes,
          getReportVoyagePortDaily.north_north_south,

          getReportVoyagePortDaily.east_degree,
          getReportVoyagePortDaily.east_minutes,
          getReportVoyagePortDaily.east_east_west,
          getReportVoyagePortDaily.typeActivityPerformed,
          getReportVoyagePortDaily.userId,
        ];

        worksheet.addRow(dataRow);

        if (index == 0) {

          // Revisar stimitime no debria estar aqui. deberia apuntar a la leyenda
          


          worksheet.getCell('Z' + positionRow).value = <any>{ formula: 'Z' + (positionRow - 2) + '-W' + positionRow + '+Y' + positionRow };
          worksheet.getCell('AJ' + positionRow).value = <any>{ formula: 'AJ' + (positionRow - 2) + '-AG' + positionRow + '+AI' + positionRow };

          // Agregamos el formadate
        }

      }

    );

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
  public PositByCell(positionColum: number): string {
    let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
      'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ',
      'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ'];

    return letras[positionColum];
  }
  // Busca la letra y devuelve el numero.
  public SearchPositByCell(letraColum: string): any {
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
  public GetReportVoyagePortDaily(userId: number, startDate: string, endDate: string): Observable<GetReportVoyagePortDaily[]> {
    // Obtenemos el rob de inicio y el consumo hecho en el filtro.
    // Obtenemos todos los usuarios
    return this.dailyReportService.GetReportVoyagePortDailyByUserIdAndDate(userId, startDate, endDate).pipe(map(
      (resultGetROBByUser: GetReportVoyagePortDaily[]) => {

        if (!resultGetROBByUser && resultGetROBByUser.length > 0) throw 'ERROR_GET_ROB_BY_USER';


        return resultGetROBByUser;
      }
    ));

  }




  // Obtenemos la info de todos los viajes agregado.
  public GetReportDNVByUser(userId: number, startDate: string, endDate: string): Observable<GetReportVoyagePortDaily[]> {
    // Obtenemos el rob de inicio y el consumo hecho en el filtro.
    // Obtenemos todos los usuarios
    return this.dailyReportService.GetReportDNVByUser(userId, startDate, endDate).pipe(map(
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

  private AddReportTable(worksheet, posit, colum, selectUser: User, textIFOorVLSFOorLSFO: string, getInfoFuelStartEndByFilterDate:any): number {
    // Nos ubicamos en una posicion para empezar a poner los row
    // this.mergeCellReport(worksheet, position);

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

    // Posicion real del buque.
    let positionRow = posit;

    let positionRows = [positionRow, positionRow];
    let positionColumns = [colum, colum + 53];

    worksheet.getCell('S' + positionRow).value = textIFOorVLSFOorLSFO + " CONSUMPTION IN MT";
    worksheet.getCell('S' + positionRow).style = {
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
    worksheet.mergeCells('S' + positionRow, 'Z' + positionRow);

    worksheet.getCell('AA' + positionRow).value = "MGO CONSUMPTION IN MT";
    worksheet.getCell('AA' + positionRow).style = {
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
    worksheet.mergeCells('AA' + positionRow, 'AJ' + positionRow);

    // Salto de linea
    positionRow += 1;
    worksheet.getCell('O' + positionRow).value = "NAVIGATION DATA";
    worksheet.getCell('O' + positionRow).style = {
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
    worksheet.mergeCells('O' + positionRow, 'R' + positionRow);

    worksheet.getCell('S' + positionRow).value = "PREVIOUS VOYAGE";
    worksheet.getCell('S' + positionRow).style = {
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
    worksheet.mergeCells('S' + positionRow, 'W' + positionRow);
    console.log('ok')
    console.log(getInfoFuelStartEndByFilterDate.ifo_start)
    worksheet.getCell('X' + positionRow).value = getInfoFuelStartEndByFilterDate.ifo_start;
    worksheet.getCell('X' + positionRow).style = {
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

    worksheet.mergeCells('X' + positionRow, 'Z' + positionRow);


    worksheet.getCell('AA' + positionRow).value = "PREVIOUS VOYAGE";
    worksheet.getCell('AA' + positionRow).style = {
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
    worksheet.mergeCells('AA' + positionRow, 'AG' + positionRow);

    console.log('MGO :'+getInfoFuelStartEndByFilterDate.mgo_start)
    worksheet.getCell('AH' + positionRow).value = getInfoFuelStartEndByFilterDate.mgo_start;
    worksheet.getCell('AH' + positionRow).style = {
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
    worksheet.mergeCells('AH' + positionRow, 'AJ' + positionRow);


    positionRow += 1;
    worksheet.addRow([
      'voyageId', 'portId', 'dailyReportId', 'year',//E

      'voyageNumber',
      'portNumber',
      'departurePort',
      'arrivalPort',
      'date',
      'hour',
      'steamingTime',
      'activityPerformed',
      'speedStraction',
      'observation',

      'distance',
      'steamingTime2',
      'SPEED22',
      'beaufour',

      'mplaIfo',
      'auxIfo',
      'boilerIfo',
      'otherIfo',
      'TOTAL',
      'DAILY COSUMTION',
      'bunkeringIfo',
      'ROB',


      'mplaMgo',
      'auxMgo',
      'boilerMgo',
      'ppMgo',
      'giMgo',
      'otherMgo',
      'TOTAL',
      'DAILY COSUMTION',
      'bunkeringMgo',
      'ROB',

      'north_degree',
      'north_minutes',
      'north_north_south',

      'east_degree',
      'east_minutes',
      'east_east_west',
      'typeActivityPerformed',
      'userId',
      'updatePort',
      'delete_report'

    ]);
    worksheet.getCell('F' + positionRow).style = {
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

    worksheet.getCell('G' + positionRow).style = {
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
    worksheet.getCell('H' + positionRow).style = {
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

    worksheet.getCell('I' + positionRow).style = {
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
    worksheet.getCell('S' + positionRow).style = {
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
    worksheet.getCell('K' + positionRow).style = {
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
    worksheet.getCell('L' + positionRow).style = {
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
    worksheet.getCell('N' + positionRow).style = {
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
    worksheet.getCell('AC' + positionRow).style = {
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
    worksheet.getCell('I' + positionRow).style = {
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
    worksheet.getCell('L' + positionRow).style = {
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
    worksheet.getCell('AN' + positionRow).style = {
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
    worksheet.getCell('AP' + positionRow).style = {
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
    worksheet.getCell('J' + positionRow).style = {
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
    worksheet.getCell('AT' + positionRow).style = {
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
    worksheet.getCell('AV' + positionRow).style = {
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
    worksheet.getCell('AX' + positionRow).style = {
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
    worksheet.getCell('AZ' + positionRow).style = {
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
    worksheet.getCell('BB' + positionRow).style = {
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
    worksheet.getCell('BD' + positionRow).style = {
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
    worksheet.getCell('BF' + positionRow).style = {
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
    worksheet.getCell('BH' + positionRow).style = {
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
    worksheet.getCell('BJ' + positionRow).style = {
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
    worksheet.getCell('BL' + positionRow).style = {
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
    worksheet.getCell('BN' + positionRow).style = {
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
    worksheet.getCell('BP' + positionRow).style = {
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
    worksheet.getCell('BR' + positionRow).style = {
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
    worksheet.getCell('BT' + positionRow).style = {
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
    worksheet.getCell('BV' + positionRow).style = {
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
    worksheet.getCell('BX' + positionRow).style = {
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
    worksheet.getCell('BZ' + positionRow).style = {
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




    console.log('Fin');

    return positionRow;
  }


  private StyleDashInfoVessel(worksheet, posit, colum, selectUser: User, infoVessel: InfoVessel): number {

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


    let positionRow = posit;

    let positionRows = [positionRow, positionRow];
    let positionColumns = [colum, colum + 53];

    this.addStyleByColums(worksheet, positionRows, positionColumns, 'INFO VESSEL', 20, colorYellowTransgas, blueHard3, '')
    this.addBorder(worksheet, positionRow, colum, 'thick', blueHard3, '');
    positionRow += 1;
    // disminuimos las filas registradas
    positionRows = [positionRow, positionRow + 11];
    this.addStyleBorder(worksheet, positionRows, positionColumns, 'thick', blueHard3)


    positionRow += 1;

    //Espacio de separacion
    positionRow += 1;

    positionRows = positionRow;
    let positionColumn = colum;
    let tamanioBuque = this.StyleDashBuque(worksheet, positionRows, positionColumn, selectUser, infoVessel);
    positionColumn = colum + 19;



    return positionRow - posit;
  }



  private StyleDashBuque(worksheet, posit, colum, selectUser: User, infoVessel: InfoVessel): number {
    let date_start = FormatDateUTCToDateHour(infoVessel.date_start);
    let hour_start = infoVessel.hour_start;
    let ifo_start = infoVessel.ifo_start;
    let mgo_start = infoVessel.mgo_start;
    let date_end = FormatDateUTCToDateHour(infoVessel.date_end);
    let hour_end = infoVessel.hour_end;
    let ifo_end = infoVessel.ifo_end;
    let mgo_end = infoVessel.mgo_end;
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
    positionColumns = [colum + 5, colum + 9];
    this.addStyleByColums(worksheet, positionRows, positionColumns, date_start, 8, black, white, '');

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
    this.addStyleByColums(worksheet, positionRows, positionColumns,
      { formula: 'SUM(BD34:BD4000)' },
      8, black, white, '');
    //MGO Start
    positionColumns = [colum + 12, colum + 13];
    this.addStyleByColums(worksheet, positionRows, positionColumns,

      { formula: 'SUM(BX34:BX4000)' }
      , 8, black, white, '');


    posit += 1;
    // Start date
    positionRows = [posit, posit];
    positionColumns = [colum + 6, colum + 9];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'Total Consumption', 8, black, white, '');
    // IFO start
    positionColumns = [colum + 10, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns,
      { formula: 'SUM(AR34:AY4000)' },
      8, black, white, '');
    //MGO Start
    positionColumns = [colum + 12, colum + 13];
    this.addStyleByColums(worksheet, positionRows, positionColumns,
      { formula: 'SUM(BH34:BS4000)' },
      8, black, white, '');


    posit += 1;
    // Start date
    positionRows = [posit, posit];
    positionColumns = [colum, colum + 4];
    this.addStyleByColums(worksheet, positionRows, positionColumns, 'END DATE', 8, black, white, '');
    // date start
    positionColumns = [colum + 5, colum + 9];
    this.addStyleByColums(worksheet, positionRows, positionColumns, date_end, 8, black, white, '');
    // IFO start
    positionColumns = [colum + 10, colum + 11];
    this.addStyleByColums(worksheet, positionRows, positionColumns,

      { formula: this.PositByCell(positionColumns[0]) + (posit - 3) + '-' + this.PositByCell(positionColumns[0]) + (posit - 1) + '+' + this.PositByCell(positionColumns[0]) + (posit - 2) },
      8, black, white, '');
    //MGO Start
    positionColumns = [colum + 12, colum + 13];
    this.addStyleByColums(worksheet, positionRows, positionColumns,
      { formula: this.PositByCell(positionColumns[0]) + (posit - 3) + '-' + this.PositByCell(positionColumns[0]) + (posit - 1) + '+' + this.PositByCell(positionColumns[0]) + (posit - 2) },
      8, black, white, '');


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


  // Obtenemos la info del combustible inicio fin
  public GetInfoFuelStartEndByFilterDate(userId: number, startDate: string, endDate: string): Observable<InfoFuelStartEndForDate> {
    // Obtenemos el rob de inicio y el consumo hecho en el filtro.
    // Obtenemos todos los usuarios
    return this.dailyReportService.GetStartEndROByFilterDate(userId, startDate, endDate).pipe(map(
      (resultGetROBByUser: GetROBByUser[]) => {

        if (!resultGetROBByUser && resultGetROBByUser.length > 0) throw 'ERROR_GET_ROB_BY_USER';

        // Trabajaremos con las siguientes variables.
        let startDataROB: GetROBByUser = new GetROBByUser();
        let endDataROB: GetROBByUser = new GetROBByUser()

        // IFO
        startDataROB.total_ifo = this.MathRoundDecimal(resultGetROBByUser[0].total_bunkering_ifo - resultGetROBByUser[0].total_ifo, 2);
        startDataROB.total_mgo = this.MathRoundDecimal(resultGetROBByUser[0].total_bunkering_mgo - resultGetROBByUser[0].total_mgo, 2);
        startDataROB.total_bunkering_ifo = this.MathRoundDecimal(resultGetROBByUser[0].total_bunkering_ifo, 2);
        startDataROB.total_bunkering_mgo = this.MathRoundDecimal(resultGetROBByUser[0].total_bunkering_mgo, 2);

        // MGO
        endDataROB.total_ifo = this.MathRoundDecimal(startDataROB.total_ifo + (resultGetROBByUser[1].total_bunkering_ifo - resultGetROBByUser[1].total_ifo), 2);
        endDataROB.total_mgo = this.MathRoundDecimal(startDataROB.total_mgo + (resultGetROBByUser[1].total_bunkering_mgo - resultGetROBByUser[1].total_mgo), 2);
        endDataROB.total_bunkering_ifo = this.MathRoundDecimal(resultGetROBByUser[1].total_bunkering_ifo, 2);
        endDataROB.total_bunkering_mgo = this.MathRoundDecimal(resultGetROBByUser[1].total_bunkering_mgo, 2);

        return new InfoFuelStartEndForDate(
          startDataROB,
          endDataROB
        );
      }
    ));

  }

  public MathRoundDecimal(valor, cantDecimales: number) {

    if (!valor) { return 0; }

    let result = mathRound(valor, cantDecimales || 0)

    return result;
  }






  // Obtenemos la info de todos los viajes agregado.
  private GetReporteEntryForUser(userId: number): Observable<GetReportVoyagePortDaily[]> {
    // Obtenemos el rob de inicio y el consumo hecho en el filtro.
    // Obtenemos todos los usuarios
    return this.dailyReportService.GetReportVoyagePortDailyByUserId(userId).pipe(map(
      (resultGetROBByUser: GetReportVoyagePortDaily[]) => {

        if (!resultGetROBByUser && resultGetROBByUser.length > 0) throw 'ERROR_GET_ROB_BY_USER';


        return resultGetROBByUser;
      }
    ));

  }
}


export class InfoVessel {
  constructor(
    public date_start?: string,
    public hour_start?: string,
    public ifo_start?: number,
    public mgo_start?: number,
    public date_end?: string,
    public hour_end?: string,
    public ifo_end?: number,
    public mgo_end?: number,
    public totalBunkeringIFO?: number,
    public totalBunkeringMGO?: number,
    public totalConsumptIFO?: number,
    public totalConsumptMGO?: number,
  ) {
    this.date_start = date_start || '';
    this.hour_start = hour_start || '';
    this.ifo_start = ifo_start || 0;
    this.mgo_start = mgo_start || 0;

    this.date_end = date_end || '';
    this.hour_end = hour_end || '';
    this.ifo_end = ifo_end || 0;
    this.mgo_end = mgo_end || 0;

    this.totalBunkeringIFO = totalBunkeringIFO || 0;
    this.totalBunkeringMGO = totalBunkeringMGO || 0;
    this.totalConsumptIFO = totalConsumptIFO || 0;
    this.totalConsumptMGO = totalConsumptMGO || 0;
  }
}