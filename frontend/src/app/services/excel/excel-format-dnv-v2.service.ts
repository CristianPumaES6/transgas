import { Injectable } from '@angular/core';
import { CellFormulaValue, TableProperties, Workbook, Worksheet } from 'exceljs';

import * as fs from 'file-saver';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { mathRound } from '../../../assets/math/math.assets';
import { ConvertMMDDYYYYHHmmToMomment, ConvertMomentUTC, FormatDate, FormatDateUTCToDateHour, FormatDateUTCToDateHourUTC, FormatYYYYMMDDToHOURS, FormatYYYYMMDDToSTRING, FormatYYYYMMDDUTCToSTRING } from '../../../assets/moment/moment.assets';
import { DailyReport, GetFormatDNV, GetROBByUser, InfoFuelStartEndForDate } from '../../models/daily-report';
import { ActivityPerformed } from '../../models/dashboard';
import { GetReportVoyagePortDaily, GetReportVoyagePortDaily2 } from '../../models/dialog-export-excel';
import { User } from '../../models/user';
import { Voyage } from '../../models/voyage';
import { DailyReportService } from '../daily-report.service';
import { LanguageService } from '../language.service';
import * as html2canvas from 'html2canvas';
import * as logoFile from '../../../assets/image-base64/logo-base64';
import { ExcelService } from './excel.service';
import { FormuleService } from '../formule.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelFormatDNVV2Service {

  // Translate
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'exportExcel';
  public selectUser: User = new User();


  constructor(
    private languageService: LanguageService,
    private dailyReportService: DailyReportService,
    private excelService: ExcelService,
    private formuleService: FormuleService
  ) { }


  // Opcion que exporta el excel.
  public async ExportReporteEntryForUser(selectUserId: number, startDate: string, endDate: string, selectUser: User): Promise<boolean> {


    // Creamos una nueva hoja de trabajo
    let workbook = new Workbook();
    workbook.creator = 'lowcodetool.com';

    // aGREGAMOS LA HOJA DE TRABAJO
    let worksheet = workbook.addWorksheet("Log abstract - DCS noon - min");

    let rowCursor = 1;
    return await Promise.resolve(true).then(
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


        return this.AddDashInfoBuque(worksheet, workbook, selectUser, rowCursor, 0)
      }
    )
      // Agregamos la cabecera al formato excel
      .then(
        resultRowFinal => {

          rowCursor = resultRowFinal + 2;

          return this.AddHeaderTableDNV(worksheet, rowCursor, 0)
        }
      ).then(
        resultRowFinal => {
          rowCursor = resultRowFinal;

          // Buscamos la informacion del combustible de inicio y fin segun la fecha.
          return this.ArmamosElObjetoParaELFORMATODNV(selectUserId, startDate, endDate, selectUser);
        }).then(
          resultGetFormat => {
            return this.AddValueTableDNV(worksheet, rowCursor, 0, resultGetFormat)
          }).then(
            resultGetFormat => {

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
          this.addStyleByColums(worksheet, positionRow, positionColumn, selectUser.imo, 11, "", "", true, false);

          row = row + 1;
          column = positCol;
          positionRow = [row, row];
          positionColumn = [column, column + 1];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Vessel Name:', 11, "", "", true, true);
          // Esto empieza en la columna 3
          column = positCol + 2;
          positionColumn = [column, column + 1];
          this.addStyleByColums(worksheet, positionRow, positionColumn, selectUser.name, 11, "", "", true, false);


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
  private AddHeaderTableDNV(worksheet, positRow: number, positCol: number): Promise<number> {

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
      ).then(
        resultRow => {
          // HEADER 3
          row = resultRow + 1;
          // UTC
          column = positCol;
          positionRow = [row, row];
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "UTC\n yyyy-mm-dd", 11, "", "ffffcc", true, false, "bottom", "left");


          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "UTC\nhh:mm", 11, "", "ffffcc", true, false, "bottom", "left");

          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "[°]", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "[']", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "", 11, "", "ffffcc", true, false, "bottom", "left");



          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "[°]", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "[']", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "", 11, "", "ffffcc", true, false, "bottom", "left");




          column = column + 2;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "h", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "h", 11, "", "ffffcc", true, false, "bottom", "left");



          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "nm", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "(txt)", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "(nr)", 11, "", "ffffcc", true, false, "bottom", "left");


          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "(txt)", 11, "", "ffffcc", true, false, "bottom", "left");


          let getRow = worksheet.getRow(row);
          getRow.height = 42;


          return row;
        }
      ).then(

        result => {
          // aqui recorrer los reportes
          return row;
        }
      );
  }


  private async ArmamosElObjetoParaELFORMATODNV(selectUserId: number, startDate: string, endDate: string, selectUser: User): Promise<GetFormatDNV[]> {

    let ListGetFormatDNV: GetFormatDNV[] = [];

    let listGetReportVoyagePortDaily: GetReportVoyagePortDaily[] = [];
    let getInfoFuelStartEndByFilterDate: InfoFuelStartEndForDate;

    let ignoreElPrimerDia = false;
    return await Promise.resolve(true).then(
      result => {
        // Buscamos la informacion del combustible de inicio y fin segun la fecha.

        // DNV
        return this.excelService.GetReportVoyagePortDaily(selectUserId, startDate, endDate).pipe().toPromise();
      }
    ).then(
      result => {



        if (!result) throw 'ERROR GER REPORT';
        listGetReportVoyagePortDaily = result;
        // Buscamos la informacion del combustible de inicio y fin segun la fecha.
        return this.excelService.GetInfoFuelStartEndByFilterDate(selectUserId, startDate, endDate).pipe().toPromise();
      }
    ).then(
      getInfoFuelStartEndByFilterDate => {

        // FALTA CALCULAR EL ROB ACTUAL
        let ROB_IFO = getInfoFuelStartEndByFilterDate.infoFuelStart.total_ifo;
        let ROB_MGO = getInfoFuelStartEndByFilterDate.infoFuelStart.total_mgo;

        let dia_anterior = new GetReportVoyagePortDaily();
        let dia_actual = new GetReportVoyagePortDaily();

        listGetReportVoyagePortDaily.forEach(
          (item: GetReportVoyagePortDaily) => {
            let getFormatDNV: GetFormatDNV = new GetFormatDNV();

            // validamos si estamos en el mismo dia.
            if (String(dia_actual.date).slice(0, 10) == String(item.date).slice(0, 10)) {


              dia_actual.userId = item.userId;
              dia_actual.year = item.year;
              dia_actual.voyageId = item.voyageId;
              dia_actual.voyageNumber = item.voyageNumber;

              dia_actual.portId = item.portId;
              dia_actual.portNumber = item.portNumber;
              dia_actual.departurePort = item.departurePort;
              dia_actual.arrivalPort = item.arrivalPort;
              dia_actual.startDate = item.startDate;
              dia_actual.startIFO = item.startIFO;
              dia_actual.startMGO = item.startMGO;
              // valoras del reporte
              dia_actual.dailyReportId = item.dailyReportId;
              dia_actual.date = item.date;
              dia_actual.hour = item.hour;

              dia_actual.activityPerformed = item.activityPerformed;
              dia_actual.typeActivityPerformed = item.typeActivityPerformed;
              dia_actual.speedStraction = item.speedStraction || dia_actual.speedStraction;
              dia_actual.observation = item.observation;

              // ULTIMOS CAMPOS
              dia_actual.north_degree = item.north_degree || dia_actual.north_degree;
              dia_actual.north_minutes = item.north_minutes || dia_actual.north_minutes;
              dia_actual.north_north_south = item.north_north_south || dia_actual.north_north_south;
              dia_actual.east_degree = item.east_degree || dia_actual.east_degree;
              dia_actual.east_minutes = item.east_minutes || dia_actual.east_minutes;
              dia_actual.east_east_west = item.east_east_west || dia_actual.east_east_west;

              // Validamos que la suma de los resultados no superaran las 24 horas
              if ( (dia_actual.steamingTime + item.steamingTime) >= 23.5) {
                // actualizamos el dia anterior
                dia_anterior = JSON.parse(JSON.stringify(dia_actual));

                // El resumen del dia anterior es 
                let reportTemporal = new GetReportVoyagePortDaily();

                // Horas que faltan para 24 horas
                reportTemporal.steamingTime = 24 - dia_actual.steamingTime;
                console.log( "TIEMPO que sobra para las 24h : " + reportTemporal.steamingTime )
                // cuanto es el cosnumo total por horas
                reportTemporal.mplaIfo = (item.mplaIfo > 0) ? item.mplaIfo / item.steamingTime : 0;
                reportTemporal.auxIfo = (item.auxIfo > 0) ? item.auxIfo / item.steamingTime : 0;
                reportTemporal.boilerIfo = (item.boilerIfo > 0) ? item.boilerIfo / item.steamingTime : 0;
                reportTemporal.otherIfo = (item.otherIfo > 0) ? item.otherIfo / item.steamingTime : 0;

                reportTemporal.mplaMgo = (item.mplaMgo > 0) ? item.mplaMgo / item.steamingTime : 0;
                reportTemporal.auxMgo = (item.auxMgo > 0) ? item.auxMgo / item.steamingTime : 0;
                reportTemporal.boilerMgo = (item.boilerMgo > 0) ? item.boilerMgo / item.steamingTime : 0;
                reportTemporal.ppMgo = (item.ppMgo > 0) ? item.ppMgo / item.steamingTime : 0;
                reportTemporal.giMgo = (item.giMgo > 0) ? item.giMgo / item.steamingTime : 0;
                reportTemporal.otherMgo = (item.otherMgo > 0) ? item.otherMgo / item.steamingTime : 0;

                reportTemporal.bunkeringIfo = (item.bunkeringIfo > 0 || item.bunkeringIfo < 0) ? item.bunkeringIfo / item.steamingTime : 0;
                reportTemporal.bunkeringMgo = (item.bunkeringMgo > 0 || item.bunkeringMgo < 0) ? item.bunkeringMgo / item.steamingTime : 0;


                // AHORA VAMOS A OBTENER EL CONSUMO TOTAL ASIGNADO AL VIAJE ANTERIRO
                reportTemporal.mplaIfo = reportTemporal.mplaIfo > 0 ? reportTemporal.mplaIfo * reportTemporal.steamingTime : 0;
                reportTemporal.auxIfo = reportTemporal.auxIfo > 0 ? reportTemporal.auxIfo * reportTemporal.steamingTime : 0;
                reportTemporal.boilerIfo = reportTemporal.boilerIfo > 0 ? reportTemporal.boilerIfo * reportTemporal.steamingTime : 0;
                reportTemporal.otherIfo = reportTemporal.otherIfo > 0 ? reportTemporal.otherIfo * reportTemporal.steamingTime : 0;

                reportTemporal.mplaMgo = reportTemporal.mplaMgo > 0 ? reportTemporal.mplaMgo * reportTemporal.steamingTime : 0;
                reportTemporal.auxMgo = reportTemporal.auxMgo > 0 ? reportTemporal.auxMgo * reportTemporal.steamingTime : 0;
                reportTemporal.boilerMgo = reportTemporal.boilerMgo > 0 ? reportTemporal.boilerMgo * reportTemporal.steamingTime : 0;
                reportTemporal.ppMgo = reportTemporal.ppMgo > 0 ? reportTemporal.ppMgo * reportTemporal.steamingTime : 0;
                reportTemporal.giMgo = reportTemporal.giMgo > 0 ? reportTemporal.giMgo * reportTemporal.steamingTime : 0;
                reportTemporal.otherMgo = reportTemporal.otherMgo > 0 ? reportTemporal.otherMgo * reportTemporal.steamingTime : 0;

                reportTemporal.bunkeringIfo = (item.bunkeringIfo > 0 || item.bunkeringIfo < 0) ? reportTemporal.bunkeringIfo * reportTemporal.steamingTime : 0;
                reportTemporal.bunkeringMgo = (item.bunkeringMgo > 0 || item.bunkeringMgo < 0) ? reportTemporal.bunkeringMgo * reportTemporal.steamingTime : 0;


                // sumamos el consumo que le falta al dia anterior
                dia_anterior.mplaIfo = dia_anterior.mplaIfo + reportTemporal.mplaIfo;
                dia_anterior.auxIfo = dia_anterior.auxIfo + reportTemporal.auxIfo;
                dia_anterior.boilerIfo = dia_anterior.boilerIfo + reportTemporal.boilerIfo;
                dia_anterior.otherIfo = dia_anterior.otherIfo + reportTemporal.otherIfo;
                dia_anterior.mplaMgo = dia_anterior.mplaMgo + reportTemporal.mplaMgo;
                dia_anterior.auxMgo = dia_anterior.auxMgo + reportTemporal.auxMgo;
                dia_anterior.boilerMgo = dia_anterior.boilerMgo + reportTemporal.boilerMgo;
                dia_anterior.ppMgo = dia_anterior.ppMgo + reportTemporal.ppMgo;
                dia_anterior.giMgo = dia_anterior.giMgo + reportTemporal.giMgo;
                dia_anterior.otherMgo = dia_anterior.otherMgo + reportTemporal.otherMgo;

                dia_anterior.bunkeringIfo = dia_anterior.bunkeringIfo + reportTemporal.bunkeringIfo;
                dia_anterior.bunkeringMgo = dia_anterior.bunkeringMgo + reportTemporal.bunkeringMgo;

                dia_anterior.steamingTime = dia_anterior.steamingTime + reportTemporal.steamingTime;


                let resul:any = this.convertGetReportVoyagePortDailyToGetFormatDNV(dia_anterior, ROB_IFO, ROB_MGO);
                ROB_IFO = resul.ROB_IFO;
                ROB_MGO = resul.ROB_MGO;
                // aqui registramos al dia anterior
                ListGetFormatDNV.push(resul.FormatDNV)

                // Ahora ponnerle el valor correcto al dia.
                dia_actual.steamingTime = item.steamingTime - reportTemporal.steamingTime;
                dia_actual.distance = item.distance - reportTemporal.steamingTime;
                // Consumo IFO
                dia_actual.mplaIfo = item.mplaIfo - reportTemporal.mplaIfo;
                dia_actual.auxIfo = item.auxIfo - reportTemporal.auxIfo;
                dia_actual.boilerIfo = item.boilerIfo - reportTemporal.boilerIfo;
                dia_actual.otherIfo = item.otherIfo - reportTemporal.otherIfo;
                dia_actual.bunkeringIfo = item.bunkeringIfo - reportTemporal.bunkeringIfo;
                // Consumo MGO
                dia_actual.mplaMgo = item.mplaMgo - reportTemporal.bunkeringIfo;
                dia_actual.auxMgo = item.auxMgo - reportTemporal.auxMgo;
                dia_actual.boilerMgo = item.boilerMgo - reportTemporal.boilerMgo;
                dia_actual.ppMgo = item.ppMgo - reportTemporal.ppMgo;
                dia_actual.giMgo = item.giMgo - reportTemporal.giMgo;
                dia_actual.otherMgo = item.otherMgo - reportTemporal.otherMgo;
                dia_actual.bunkeringMgo = item.bunkeringMgo - reportTemporal.bunkeringMgo;


              } else {

                dia_actual.steamingTime = dia_actual.steamingTime + item.steamingTime;
                dia_actual.distance = dia_actual.distance + item.distance;

                // Consumo IFO
                dia_actual.mplaIfo = dia_actual.mplaIfo + item.mplaIfo;
                dia_actual.auxIfo = dia_actual.auxIfo + item.auxIfo;
                dia_actual.boilerIfo = dia_actual.boilerIfo + item.boilerIfo;
                dia_actual.otherIfo = dia_actual.otherIfo + item.otherIfo;
                dia_actual.bunkeringIfo = dia_actual.bunkeringIfo + item.bunkeringIfo;

                // Consumo MGO
                dia_actual.mplaMgo = dia_actual.mplaMgo + item.mplaMgo;
                dia_actual.auxMgo = dia_actual.auxMgo + item.auxMgo;
                dia_actual.boilerMgo = dia_actual.boilerMgo + item.boilerMgo;
                dia_actual.ppMgo = dia_actual.ppMgo + item.ppMgo;
                dia_actual.giMgo = dia_actual.giMgo + item.giMgo;
                dia_actual.otherMgo = dia_actual.otherMgo + item.otherMgo;
                dia_actual.bunkeringMgo = dia_actual.bunkeringMgo + item.bunkeringMgo;



              }

            }
            // no es el mismo dia
            else if(dia_actual.date) {


              let getFormatDNV = new GetFormatDNV();
              // actualizamos el dia anterior
              dia_anterior = JSON.parse(JSON.stringify(dia_actual));

              // nueva variable
              dia_actual = new GetReportVoyagePortDaily();
              // Datos del viaje
              dia_actual.userId = item.userId;
              dia_actual.year = item.year;
              dia_actual.voyageId = item.voyageId;
              dia_actual.voyageNumber = item.voyageNumber;
              // Datos del puerto
              dia_actual.portId = item.portId;
              dia_actual.portNumber = item.portNumber;
              dia_actual.departurePort = item.departurePort;
              dia_actual.arrivalPort = item.arrivalPort;
              dia_actual.startDate = item.startDate;
              dia_actual.startIFO = item.startIFO;
              dia_actual.startMGO = item.startMGO;
              // datos del dailkyReport
              dia_actual.dailyReportId = item.dailyReportId;
              dia_actual.date = item.date;
              dia_actual.hour = item.hour;
              // ULTIMOS CAMPOS
              dia_actual.north_degree = item.north_degree;
              dia_actual.north_minutes = item.north_minutes;
              dia_actual.north_north_south = item.north_north_south;
              dia_actual.east_degree = item.east_degree;
              dia_actual.east_minutes = item.east_minutes;
              dia_actual.east_east_west = item.east_east_west;



              // El resumen del dia anterior es 
              if (dia_anterior.steamingTime>0 && dia_anterior.steamingTime <= 23.5) {

                let reportTemporal = new GetReportVoyagePortDaily();

                // Cuanto tiempo le falta al otro registro para tener 24 horas
                reportTemporal.steamingTime = 24-dia_anterior.steamingTime;

                // cuanto es el cosnumo total

                // Consumo por horas
                reportTemporal.mplaIfo = (item.mplaIfo > 0) ? item.mplaIfo / item.steamingTime : 0;
                reportTemporal.auxIfo = (item.auxIfo > 0) ? item.auxIfo / item.steamingTime : 0;
                reportTemporal.boilerIfo = (item.boilerIfo > 0) ? item.boilerIfo / item.steamingTime : 0;
                reportTemporal.otherIfo = (item.otherIfo > 0) ? item.otherIfo / item.steamingTime : 0;

                reportTemporal.mplaMgo = (item.mplaMgo > 0) ? item.mplaMgo / item.steamingTime : 0;
                reportTemporal.auxMgo = (item.auxMgo > 0) ? item.auxMgo / item.steamingTime : 0;
                reportTemporal.boilerMgo = (item.boilerMgo > 0) ? item.boilerMgo / item.steamingTime : 0;
                reportTemporal.ppMgo = (item.ppMgo > 0) ? item.ppMgo / item.steamingTime : 0;
                reportTemporal.giMgo = (item.giMgo > 0) ? item.giMgo / item.steamingTime : 0;
                reportTemporal.otherMgo = (item.otherMgo > 0) ? item.otherMgo / item.steamingTime : 0;

                reportTemporal.bunkeringIfo = (item.bunkeringIfo > 0 || item.bunkeringIfo < 0) ? item.bunkeringIfo / item.steamingTime : 0;
                reportTemporal.bunkeringMgo = (item.bunkeringMgo > 0 || item.bunkeringMgo < 0) ? item.bunkeringMgo / item.steamingTime : 0;


                // AHORA VAMOS A OBTENER EL CONSUMO TOTAL ASIGNADO AL VIAJE ANTERIRO
                reportTemporal.mplaIfo = reportTemporal.mplaIfo > 0 ? reportTemporal.mplaIfo * reportTemporal.steamingTime : 0;
                reportTemporal.auxIfo = reportTemporal.auxIfo > 0 ? reportTemporal.auxIfo * reportTemporal.steamingTime : 0;
                reportTemporal.boilerIfo = reportTemporal.boilerIfo > 0 ? reportTemporal.boilerIfo * reportTemporal.steamingTime : 0;
                reportTemporal.otherIfo = reportTemporal.otherIfo > 0 ? reportTemporal.otherIfo * reportTemporal.steamingTime : 0;

                reportTemporal.mplaMgo = reportTemporal.mplaMgo > 0 ? reportTemporal.mplaMgo * reportTemporal.steamingTime : 0;
                reportTemporal.auxMgo = reportTemporal.auxMgo > 0 ? reportTemporal.auxMgo * reportTemporal.steamingTime : 0;
                reportTemporal.boilerMgo = reportTemporal.boilerMgo > 0 ? reportTemporal.boilerMgo * reportTemporal.steamingTime : 0;
                reportTemporal.ppMgo = reportTemporal.ppMgo > 0 ? reportTemporal.ppMgo * reportTemporal.steamingTime : 0;
                reportTemporal.giMgo = reportTemporal.giMgo > 0 ? reportTemporal.giMgo * reportTemporal.steamingTime : 0;
                reportTemporal.otherMgo = reportTemporal.otherMgo > 0 ? reportTemporal.otherMgo * reportTemporal.steamingTime : 0;

                reportTemporal.bunkeringIfo = (item.bunkeringIfo > 0 || item.bunkeringIfo < 0) ? reportTemporal.bunkeringIfo * reportTemporal.steamingTime : 0;
                reportTemporal.bunkeringMgo = (item.bunkeringMgo > 0 || item.bunkeringMgo < 0) ? reportTemporal.bunkeringMgo * reportTemporal.steamingTime : 0;


                // sumamos el consumo que le falta al dia anterior
                dia_anterior.mplaIfo = dia_anterior.mplaIfo + reportTemporal.mplaIfo;
                dia_anterior.auxIfo = dia_anterior.auxIfo + reportTemporal.auxIfo;
                dia_anterior.boilerIfo = dia_anterior.boilerIfo + reportTemporal.boilerIfo;
                dia_anterior.otherIfo = dia_anterior.otherIfo + reportTemporal.otherIfo;
                dia_anterior.mplaMgo = dia_anterior.mplaMgo + reportTemporal.mplaMgo;
                dia_anterior.auxMgo = dia_anterior.auxMgo + reportTemporal.auxMgo;
                dia_anterior.boilerMgo = dia_anterior.boilerMgo + reportTemporal.boilerMgo;
                dia_anterior.ppMgo = dia_anterior.ppMgo + reportTemporal.ppMgo;
                dia_anterior.giMgo = dia_anterior.giMgo + reportTemporal.giMgo;
                dia_anterior.otherMgo = dia_anterior.otherMgo + reportTemporal.otherMgo;


                dia_anterior.bunkeringIfo = dia_anterior.bunkeringIfo + reportTemporal.bunkeringIfo;
                dia_anterior.bunkeringMgo = dia_anterior.bunkeringMgo + reportTemporal.bunkeringMgo;

                dia_anterior.steamingTime = dia_anterior.steamingTime + reportTemporal.steamingTime;


                
                let resul:any = this.convertGetReportVoyagePortDailyToGetFormatDNV(dia_anterior, ROB_IFO, ROB_MGO);
                ROB_IFO = resul.ROB_IFO;
                ROB_MGO = resul.ROB_MGO;
                // aqui registramos al dia anterior
                ListGetFormatDNV.push(resul.FormatDNV)





                // Ahora ponnerle el valor correcto al dia.
                dia_actual.steamingTime = dia_actual.steamingTime - reportTemporal.steamingTime;
                dia_actual.distance = dia_actual.distance - reportTemporal.steamingTime;
                // Consumo IFO
                dia_actual.mplaIfo = dia_actual.mplaIfo - reportTemporal.mplaIfo;
                dia_actual.auxIfo = dia_actual.auxIfo - reportTemporal.auxIfo;
                dia_actual.boilerIfo = dia_actual.boilerIfo - reportTemporal.boilerIfo;
                dia_actual.otherIfo = dia_actual.otherIfo - reportTemporal.otherIfo;
                dia_actual.bunkeringIfo = dia_actual.bunkeringIfo - reportTemporal.bunkeringIfo;
                // Consumo MGO
                dia_actual.mplaMgo = dia_actual.mplaMgo - reportTemporal.bunkeringIfo;
                dia_actual.auxMgo = dia_actual.auxMgo - reportTemporal.auxMgo;
                dia_actual.boilerMgo = dia_actual.boilerMgo - reportTemporal.boilerMgo;
                dia_actual.ppMgo = dia_actual.ppMgo - reportTemporal.ppMgo;
                dia_actual.giMgo = dia_actual.giMgo - reportTemporal.giMgo;
                dia_actual.otherMgo = dia_actual.otherMgo - reportTemporal.otherMgo;
                dia_actual.bunkeringMgo = dia_actual.bunkeringMgo - reportTemporal.bunkeringMgo;

              } else {

                // ESTOS VALORES CAMBIARAN
                dia_actual.steamingTime = dia_actual.steamingTime;
                dia_actual.distance = dia_actual.distance + item.distance;
                // Consumo IFO
                dia_actual.mplaIfo = dia_actual.mplaIfo;
                dia_actual.auxIfo = dia_actual.auxIfo;
                dia_actual.boilerIfo = dia_actual.boilerIfo;
                dia_actual.otherIfo = dia_actual.otherIfo;
                dia_actual.bunkeringIfo = dia_actual.bunkeringIfo;
                // Consumo MGO
                dia_actual.mplaMgo = dia_actual.mplaMgo;
                dia_actual.auxMgo = dia_actual.auxMgo;
                dia_actual.boilerMgo = dia_actual.boilerMgo;
                dia_actual.ppMgo = dia_actual.ppMgo;
                dia_actual.giMgo = dia_actual.giMgo;
                dia_actual.otherMgo = dia_actual.otherMgo;
                dia_actual.bunkeringMgo = dia_actual.bunkeringMgo;

              }






            }else{
                // nueva variable
                dia_actual = new GetReportVoyagePortDaily();
                // Datos del viaje
                dia_actual.userId = item.userId;
                dia_actual.year = item.year;
                dia_actual.voyageId = item.voyageId;
                dia_actual.voyageNumber = item.voyageNumber;
                // Datos del puerto
                dia_actual.portId = item.portId;
                dia_actual.portNumber = item.portNumber;
                dia_actual.departurePort = item.departurePort;
                dia_actual.arrivalPort = item.arrivalPort;
                dia_actual.startDate = item.startDate;
                dia_actual.startIFO = item.startIFO;
                dia_actual.startMGO = item.startMGO;
                // datos del dailkyReport
                dia_actual.dailyReportId = item.dailyReportId;
                dia_actual.date = item.date;
                dia_actual.hour = item.hour;
                // ULTIMOS CAMPOS
                dia_actual.north_degree = item.north_degree;
                dia_actual.north_minutes = item.north_minutes;
                dia_actual.north_north_south = item.north_north_south;
                dia_actual.east_degree = item.east_degree;
                dia_actual.east_minutes = item.east_minutes;
                dia_actual.east_east_west = item.east_east_west;

                  // ESTOS VALORES CAMBIARAN
                  dia_actual.steamingTime = item.steamingTime;
                  dia_actual.distance = item.distance;
                  // Consumo IFO
                  dia_actual.mplaIfo = item.mplaIfo;
                  dia_actual.auxIfo = item.auxIfo;
                  dia_actual.boilerIfo = item.boilerIfo;
                  dia_actual.otherIfo = item.otherIfo;
                  dia_actual.bunkeringIfo = item.bunkeringIfo;
                  // Consumo MGO
                  dia_actual.mplaMgo = item.mplaMgo;
                  dia_actual.auxMgo = item.auxMgo;
                  dia_actual.boilerMgo = item.boilerMgo;
                  dia_actual.ppMgo = item.ppMgo;
                  dia_actual.giMgo = item.giMgo;
                  dia_actual.otherMgo = item.otherMgo;
                  dia_actual.bunkeringMgo = item.bunkeringMgo;
            }

          }
        )
        return ListGetFormatDNV;
      }
    );



  }

  private convertGetReportVoyagePortDailyToGetFormatDNV(itemGetReportVoyagePortDaily: GetReportVoyagePortDaily, ROB_IFO: number, ROB_MGO: number): any {

    let newGetFormatDNV: GetFormatDNV = new GetFormatDNV();

    newGetFormatDNV.reportId = itemGetReportVoyagePortDaily.dailyReportId || 0;
    newGetFormatDNV.date = String(itemGetReportVoyagePortDaily.date) || '';
    newGetFormatDNV.time = 'E0:00';

    newGetFormatDNV.north_degree = itemGetReportVoyagePortDaily.north_degree || 0;
    newGetFormatDNV.north_minutes = itemGetReportVoyagePortDaily.north_minutes || 0;
    newGetFormatDNV.north_north_south = itemGetReportVoyagePortDaily.north_north_south || '';

    newGetFormatDNV.east_degree = itemGetReportVoyagePortDaily.east_degree || 0;
    newGetFormatDNV.east_minutes = itemGetReportVoyagePortDaily.east_minutes || 0;
    newGetFormatDNV.east_east_west = itemGetReportVoyagePortDaily.east_east_west || '';

    newGetFormatDNV.event = 'noon';

    newGetFormatDNV.event_time_previous = itemGetReportVoyagePortDaily.steamingTime || 0;
    newGetFormatDNV.event_time_sailing = 999 || 0;


    newGetFormatDNV.distance = itemGetReportVoyagePortDaily.distance || 0;

    newGetFormatDNV.machinery_hfo = 0 || 0;
    newGetFormatDNV.machinery_lfo = (
      itemGetReportVoyagePortDaily.mplaIfo +
      itemGetReportVoyagePortDaily.boilerIfo +
      itemGetReportVoyagePortDaily.auxIfo +
      itemGetReportVoyagePortDaily.otherIfo) || 0;
    newGetFormatDNV.machinery_mgo = (
      itemGetReportVoyagePortDaily.mplaMgo +
      itemGetReportVoyagePortDaily.boilerMgo +
      itemGetReportVoyagePortDaily.auxMgo +
      itemGetReportVoyagePortDaily.ppMgo +
      itemGetReportVoyagePortDaily.giMgo +
      itemGetReportVoyagePortDaily.otherMgo) || 0;
    newGetFormatDNV.machinery_mdo = 0;
    newGetFormatDNV.machinery_lpg = 0;
    newGetFormatDNV.machinery_methanol = 0;
    newGetFormatDNV.machinery_ethanol = 0;
    newGetFormatDNV.machinery_other_fuel_consumption = 0;
    newGetFormatDNV.machinery_other_fuel_type = 0;
    newGetFormatDNV.machinery_other_full_emission = 0;

    console.log("consumo de IFO:"+newGetFormatDNV.machinery_lfo+"  MGO:"+newGetFormatDNV.machinery_mgo)
    ROB_IFO = (ROB_IFO + itemGetReportVoyagePortDaily.bunkeringIfo) - newGetFormatDNV.machinery_lfo;
    ROB_MGO = (ROB_MGO + itemGetReportVoyagePortDaily.bunkeringMgo) - newGetFormatDNV.machinery_mgo;

    console.log("IFO : " + ROB_IFO + "  MGO:" + ROB_MGO)
    newGetFormatDNV.rob_hfo = 0 || 0;
    newGetFormatDNV.rob_lfo = ROB_IFO || 0;
    newGetFormatDNV.rob_mgo = ROB_MGO || 0;
    newGetFormatDNV.rob_mdo = 0;
    newGetFormatDNV.rob_lpg = 0;
    newGetFormatDNV.rob_lng = 0;
    newGetFormatDNV.rob_methanol = 0;
    newGetFormatDNV.rob_ethanol = 0;
    newGetFormatDNV.rob_other_fuel = 0;
    newGetFormatDNV.rob_other_fuel_type = 0;

    return <any>{
      FormatDNV:newGetFormatDNV,
      ROB_IFO:ROB_IFO,
      ROB_MGO:ROB_MGO};
  };


  // Agregamos el cuadro de informacion del buque.
  private AddValueTableDNV(worksheet, positRow: number, positCol: number, listGetFormatDNV: GetFormatDNV[]): Promise<number> {

    // Reset
    let row = positRow;
    let column = positCol;

    // Le sumo 7 celdas por que la logitud de la leyenda es 7 celdas
    let positionRow = [row, row];
    let positionColumn = [column, column];
    return Promise.resolve(true)
      .then(
        result => {

          listGetFormatDNV.forEach(
            item => {

              // HEADER 3
              row = row + 1;
              // UTC
              column = positCol;
              positionRow = [row, row];
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.date, 10, "", "ffffff", true, false, "center", "right", "Arial");


              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.time, 10, "", "ffffff", true, false, "center", "right", "Arial");

              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.north_degree, 10, "", "ffffff", true, false, "center", "right", "Arial");
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.north_minutes, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.north_north_south, 10, "", "ffffff", true, false, "bottom", "left", "Arial");



              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.east_degree, 10, "", "ffffff", true, false, "center", "right", "Arial");
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.east_minutes, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.east_east_west, 10, "", "ffffff", true, false, "bottom", "left", "Arial");


              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.event, 10, "", "ffffff", true, false, "bottom", "left", "Arial");



              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.event_time_previous, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.event_time_sailing, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');



              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.distance, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.machinery_hfo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.machinery_lfo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.machinery_mgo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.machinery_mdo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.machinery_lpg, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.machinery_lng, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.machinery_methanol, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.machinery_ethanol, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.machinery_other_fuel_consumption, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.machinery_other_fuel_type, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.machinery_other_full_emission, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');


              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.rob_hfo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.rob_lfo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.rob_mgo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.rob_mdo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.rob_lpg, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.rob_lng, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.rob_methanol, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.rob_ethanol, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.rob_other_fuel, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.rob_other_fuel_type, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');


              let getRow = worksheet.getRow(row);
              getRow.height = 15;
            }
          )


          return row;
        }
      ).then(

        result => {
          // aqui recorrer los reportes
          return row;
        }
      )


  }


  // Cosa que COPIAMOS Y NO DEBERIA SER ASI DEBERIA SER PERSONALIZADO
  private addStyleByColums(worksheet: Worksheet, position: number[], column: number[], textorFormule: string | number | any, sizeFont: number, colortText: string, colorBackgraund: string, isAddBorder: boolean, isbold: boolean, alignmentVertical?: string, alignmentHorizontal?: string, nameFont?: string, numFmt?: string) {

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
        name: nameFont || 'Calibri'
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

    if (numFmt) {
      style.numFmt = numFmt;
    }

    worksheet.getCell(this.excelService.PositByCell(columnDesde) + positionDesde).value = textorFormule;

    worksheet.getCell(this.excelService.PositByCell(columnDesde) + positionDesde).style = style;
    worksheet.mergeCells(this.excelService.PositByCell(columnDesde) + positionDesde, this.excelService.PositByCell(columnHasta) + positionHasta);
  }
  public MathRoundOneDecimal(valor, cantDecimales: number) {

    if (!valor) { return 0; }

    let result = mathRound(valor, cantDecimales)

    return result;
  }


  private SumaIfo(report: DailyReport): number {
    let ifo = report.mplaIfo + report.auxIfo + report.boilerIfo + report.otherIfo;
    return ifo;
  }

  private SumaMgo(report: DailyReport): number {
    let mgo = report.mplaMgo + report.auxMgo + report.boilerMgo + report.ppMgo + report.giMgo + report.otherMgo;
    return mgo;
  }


}
