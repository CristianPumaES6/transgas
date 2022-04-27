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
import { GetReportVoyagePortDaily } from '../../models/dialog-export-excel';
import { User } from '../../models/user';
import { Voyage } from '../../models/voyage';
import { DailyReportService } from '../daily-report.service';
import { LanguageService } from '../language.service';
import * as html2canvas from 'html2canvas';
import * as logoFile from '../../../assets/image-base64/logo-base64';
import { ExcelService } from './excel.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelFormatDNVService {

  // Translate
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'exportExcel';
  public selectUser: User = new User();


  constructor(
    private languageService: LanguageService,
    private dailyReportService: DailyReportService,
    private excelService: ExcelService,
  ) { }


  // Opcion que exporta el excel.
  public async ExportReporteEntryForUser(selectUser: User): Promise<boolean> {


    // Creamos una nueva hoja de trabajo
    let workbook = new Workbook();
    workbook.creator = 'codev.site';

    // aGREGAMOS LA HOJA DE TRABAJO
    let worksheet = workbook.addWorksheet("Log abstract - DCS noon - min");


    let listGetReport: GetReportVoyagePortDaily[] = [];
    let getInfoFuelStartEndByFilterDate: InfoFuelStartEndForDate;

    let rowCursor = 1;
    return await Promise.resolve(true)
      .then(
        result => {
          if (!result) throw 'ERROR GER REPORT';

          worksheet.columns = [
            { width: 12.6 },
            { width: 7.7 },
            { width: 10 },// C
            { width: 8.3 },
            { width: 9.2 }, // E
            { width: 9.2 }, //F
            { width: 9.2 },
            { width: 9.2 },
            { width: 10.8 }, // I
            { width: 9.2 },
            { width: 19.2 }, // K
            { width: 9.2 },
            { width: 9.2 }, // M 
            { width: 11.2 }, //N
            { width: 9.2 }, // O
            { width: 9.2 }, // P
            { width: 9.2 }, // Q
            { width: 9.2 }, // R
            { width: 9.4 }, // S
            { width: 9.2 }, // T
            { width: 9.8 },//U
            { width: 9.2 }, // V
            { width: 11.4 },//W
            { width: 9.2 },
            { width: 9.2 },
            { width: 9.2 },
            { width: 9.2 },//AA
            { width: 9.2 },
            { width: 9.2 },//AC
            { width: 9.4 },//AD
            { width: 9.2 },
            { width: 9.2 },
            { width: 9.2 },
            { width: 29.2 },//AH E;LIMINAR BORRAR ESTO.
          ];


          return this.AddDashInfoBuque(worksheet, workbook, this.selectUser, rowCursor, 0)
        }
      ).then(
        resultRowFinal => {

          rowCursor = resultRowFinal + 2;

          return this.AddHeaderTableDNV(worksheet, workbook, this.selectUser, rowCursor, 0)
        }
      ).then(
        resultRowFinal => {

          // Escribimos el excel
          workbook.xlsx.writeBuffer().then(
            (data) => {
              let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              fs.saveAs(blob, 'FORMATO DNV-' + selectUser.name + '.xlsx');
            }
          );

          return true;
        }
      );
  }


  // Agregamos el cuadro de informacion del buque.
  private AddDashInfoBuque(worksheet, workbook, selectUser: User, positRow: number, positCol: number): Promise<number> {

    // Reset
    let row = positRow;
    let column = positCol;

    // Le sumo 7 celdas por que la logitud de la leyenda es 7 celdas
    let positionRow = [row, row];
    let positionColumn = [column, column + 50];

    return Promise.resolve(true)
      .then(
        result => {
          // Juntamos la columna
          column = column + 3;
          worksheet.mergeCells(this.excelService.PositByCell(positCol) + row, this.excelService.PositByCell(column) + row);
          worksheet.mergeCells(this.excelService.PositByCell(column + 1) + row, this.excelService.PositByCell(column + 40) + row);

          // Imagen en base a 64
          const myBase64Image = "data:image/png;base64," + logoFile.logoDNVBase64;
          // Agregamos la imagen al workbook
          const logoDnv = workbook.addImage({
            base64: myBase64Image,
            extension: 'png',
          });

          // Insertamos la imagen a la hoja de trabajo
          worksheet.addImage(logoDnv, <any>{
            tl: { col: 0.2, row: 0.2 },
            br: { col: 3.2, row: 1 },
            editAs: 'oneCell'
          });
          // Obtenemos la fila le asignamos el tamaño
          const getRow = worksheet.getRow(1);
          getRow.height = 112.4;

          row = row + 1;
          column = positCol;
          positionRow = [row, row];
          positionColumn = [column, column + 1];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Vessel IMO No:', 11, "", "", true, true);

          // Esto empieza en la columna 3
          column = positCol + 2;
          positionColumn = [column, column + 1];
          this.addStyleByColums(worksheet, positionRow, positionColumn, '9173056', 11, "", "", true, false);

          row = row + 1;
          column = positCol;
          positionRow = [row, row];
          positionColumn = [column, column + 1];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Vessel Name:', 11, "", "", true, true);
          // Esto empieza en la columna 3
          column = positCol + 2;
          positionColumn = [column, column + 1];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'CAMILA B', 11, "", "", true, false);


          row = row + 1;
          column = positCol;
          positionRow = [row, row];
          positionColumn = [column, column + 1];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Reference id:', 11, "", "", true, true);
          // Esto empieza en la columna 3
          column = positCol + 2;
          positionColumn = [column, column + 1];
          this.addStyleByColums(worksheet, positionRow, positionColumn, '20371', 11, "", "", true, false);



          return row;
        }
      );

  }


  // Agregamos el cuadro de informacion del buque.
  private AddHeaderTableDNV(worksheet, workbook, selectUser: User, positRow: number, positCol: number): Promise<number> {

    // Reset
    let row = positRow;
    let column = positCol;

    // Le sumo 7 celdas por que la logitud de la leyenda es 7 celdas
    let positionRow = [row, row];
    let positionColumn = [column, column];

    return Promise.resolve(true)
      .then(
        result => {
          // Header 1
          positionColumn = [column, column + 32];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Mandatory data fields', 11, "", "d6dce4", true, true);

          return row;
        }
      ).then(
        resultRow => {
          // HEADER 2
          row = resultRow + 1;
          positionRow = [row, row];
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Date', 11, "", "ffffcc", true, true, "top");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Time', 11, "", "ffffcc", true, true, "top");
          column = column + 1;
          positionColumn = [column, column + 5];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Position', 11, "", "ffffcc", true, true, "top");
          column = column + 6;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Event', 11, "", "ffffcc", true, true, "top");
          column = column + 1;
          positionColumn = [column, column + 1];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Time elapsed', 11, "", "ffffcc", true, true, "top");
          column = column + 2;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Distance', 11, "", "ffffcc", true, true, "top");
          column = column + 1;
          positionColumn = [column, column + 10];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Machinery', 11, "", "ffffcc", true, true, "top");
          column = column + 11;
          positionColumn = [column, column + 9];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'ROB', 11, "", "ffffcc", true, true, "bottom");

          // Obtenemos la fila le asignamos el tamaño
          let getRow = worksheet.getRow(row);
          getRow.height = 26;

          return row;
        }
      ).then(
        resultRow => {
          // HEADER 2
          row = resultRow + 1;
          // Reset
          column = positCol;
          // Date y Time
          positionRow = [row, row + 1];
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, '', 11, "", "ffffcc", true, false, "");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, '', 11, "", "ffffcc", true, false, "");
          // Position Latitude
          column += 1;
          positionRow = [row, row];
          positionColumn = [column, column + 2];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Latitude', 11, "", "ffffcc", true, false, "top");
          // Longitude
          column += 3;
          positionColumn = [column, column + 2];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Longitude', 11, "", "ffffcc", true, false, "top");
          //noon y daily
          column += 3;
          positionColumn = [column, column];
          positionRow = [row, row + 2];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "-Noon\n-Daily", 11, "", "ffffcc", true, false, "top", "center");
          // Since previous
          column += 1;
          positionColumn = [column, column];
          positionRow = [row, row + 1];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Since previous event report", 11, "", "ffffcc", true, false, "top", "left");
          // Time elapsed sailing
          column += 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Time elapsed sailing", 11, "", "ffffcc", true, false, "top", "left");
          // Distance
          column += 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Distance sailed", 11, "", "ffffcc", true, false, "top", "left");
          // Total Fuel consumption
          column += 1;
          positionRow = [row, row];
          positionColumn = [column, column + 10];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Total Fuel consumption", 11, "", "ffffcc", true, false, "top", "left");
          column += 11;
          positionColumn = [column, column + 9];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Remaining on board", 11, "", "ffffcc", true, false, "top", "left");


          // Obtenemos la fila le asignamos el tamaño
          let getRow = worksheet.getRow(row);
          getRow.height = 29.4;


          return row;
        }
      ).then(
        resultRow => {
          // HEADER 3
          row = resultRow + 1;
          // Reset
          column = positCol;
          // Degree
          column = column + 2;
          positionRow = [row, row];
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Degree", 11, "", "ffffcc", true, false, "top", "left");
          //Minutes
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Minutes", 11, "", "ffffcc", true, false, "top", "left");
          //North / South
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "North / South", 11, "", "ffffcc", true, false, "top", "left");
          // Degree
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Degree", 11, "", "ffffcc", true, false, "top", "left");
          //Minutes
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Minutes", 11, "", "ffffcc", true, false, "top", "left");
          //North / South
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "East / West", 11, "", "ffffcc", true, false, "top", "left");

          //HFO
          column = column + 5;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "HFO", 11, "", "ffffcc", true, false, "top", "left");
          //LFO
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "LFO", 11, "", "ffffcc", true, false, "top", "left");
          //MGO
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "MGO", 11, "", "ffffcc", true, false, "top", "left");
          //MDO
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "MDO", 11, "", "ffffcc", true, false, "top", "left");
          //LPG
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "LPG", 11, "", "ffffcc", true, false, "top", "left");
          //LNG
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "LNG", 11, "", "ffffcc", true, false, "top", "left");
          //Methanol
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Methanol", 11, "", "ffffcc", true, false, "top", "left");
          //Ethanol
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Ethanol", 11, "", "ffffcc", true, false, "top", "left");
          //Other fuel consumption
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel consumption", 11, "", "ffffcc", true, false, "top", "left");
          //Other fuel type
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel type", 11, "", "ffffcc", true, false, "top", "left");
          //Other fuel emission factor
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel emission factor", 11, "", "ffffcc", true, false, "top", "left");



          //HFO
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "HFO", 11, "", "ffffcc", true, false, "top", "left");
          //LFO
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "LFO", 11, "", "ffffcc", true, false, "top", "left");
          //MGO
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "MGO", 11, "", "ffffcc", true, false, "top", "left");
          //MDO
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "MDO", 11, "", "ffffcc", true, false, "top", "left");
          //LPG
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "LPG", 11, "", "ffffcc", true, false, "top", "left");
          //LNG
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "LNG", 11, "", "ffffcc", true, false, "top", "left");
          //Methanol
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Methanol", 11, "", "ffffcc", true, false, "top", "left");
          //Ethanol
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Ethanol", 11, "", "ffffcc", true, false, "top", "left");
          //Other fuel consumption
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel consumption", 11, "", "ffffcc", true, false, "top", "left");
          //Other fuel type
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel type", 11, "", "ffffcc", true, false, "top", "left");


          let getRow = worksheet.getRow(row);
          getRow.height = 35;



          return row;
        }
      )
  }

  // Cosa que COPIAMOS Y NO DEBERIA SER ASI DEBERIA SER PERSONALIZADO
  private addStyleByColums(worksheet: Worksheet, position: number[], column: number[], textorFormule: string | number | any, sizeFont: number, colortText: string, colorBackgraund: string, isAddBorder: boolean, isbold: boolean, alignmentVertical?: string, alignmentHorizontal?: string) {

    // Separamos las posiciones.
    let positionDesde = position[0];
    let positionHasta = position[1];

    let columnDesde = column[0];
    let columnHasta = column[1];


    let style: any = {
      alignment: {
        horizontal: alignmentHorizontal ? alignmentHorizontal : 'left',
        vertical: alignmentVertical ? alignmentVertical : 'bottom',
        wrapText: true
      },
      font: {
        size: sizeFont,
        bold: isbold ? true : false,
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

    if (isAddBorder) {
      style.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }


    worksheet.getCell(this.excelService.PositByCell(columnDesde) + positionDesde).value = textorFormule;
    worksheet.getCell(this.excelService.PositByCell(columnDesde) + positionDesde).style = style;
    worksheet.mergeCells(this.excelService.PositByCell(columnDesde) + positionDesde, this.excelService.PositByCell(columnHasta) + positionHasta);
  }


}
