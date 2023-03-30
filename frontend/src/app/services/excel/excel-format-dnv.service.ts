import { Injectable } from '@angular/core';
import { CellFormulaValue, TableProperties, Workbook, Worksheet } from 'exceljs';

import * as fs from 'file-saver';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { mathRound } from '../../../assets/math/math.assets';
import { ConvertMMDDYYYYHHmmToMomment, ConvertMomentUTC, FormatDate, FormatDateUTCToDateHour, FormatDateUTCToDateHourUTC, FormatYYYYMMDDToHOURS, FormatYYYYMMDDToSTRING, FormatYYYYMMDDUTCToSTRING } from '../../../assets/moment/moment.assets';
import { FormatDNV_Bunker_Report, GetFormatDNV, GetFormatDNV_DCS_NOON_FULL, GetInfoBunkering, GetROBByUser, InfoFuelStartEndForDate, ListExcelFormatDNV } from '../../models/daily-report';
import { ActivityPerformed } from '../../models/dashboard';
import { GetReportVoyagePortDaily } from '../../models/dialog-export-excel';
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
export class ExcelFormatDNVService {

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
    workbook.creator = 'codev.site';

    // aGREGAMOS LA HOJA DE TRABAJO
    let worksheet_DCS_noon_min;

    let worksheet_DCS_noon_full;
    let worksheet_Bunker_report;
    let rowCursor = 1;


    let listExcelFormatDNV = new ListExcelFormatDNV();
    return await Promise.resolve(true).then(
      result => {
        if (!result) throw 'ERROR GER REPORT';


        // Buscamos la informacion del combustible de inicio y fin segun la fecha.
        return this.ArmamosElObjetoParaELFORMATODNV(selectUserId, startDate, endDate, selectUser);
      }).then(
        resultGetFormat => {

          // Guardamos la lista que tenemos
          listExcelFormatDNV = resultGetFormat;
          // Buscamos la informacion del combustible de inicio y fin segun la fecha.
          return true;
        }).then(
          result => {

            worksheet_DCS_noon_min = workbook.addWorksheet("Log abstract - DCS noon - min");

            this.setTamanioColum(worksheet_DCS_noon_min, 'Min')

            return this.AddDashInfoBuque(worksheet_DCS_noon_min, workbook, selectUser, rowCursor, 0)
          }
        )
      // Agregamos la cabecera al formato excel
      .then(
        resultRowFinal => {

          rowCursor = resultRowFinal + 2;

          return this.AddHeaderTableDNV(worksheet_DCS_noon_min, rowCursor, 0, 'Min');
        }
      ).then(
        resultRowFinal => {
          rowCursor = resultRowFinal;


          return this.AddValueTableDNV_MIN(worksheet_DCS_noon_min, rowCursor, 0, listExcelFormatDNV.GetFormatDNV)
        }).then(
          result => {

            // creamos una nueva hoja
            worksheet_DCS_noon_full = workbook.addWorksheet("Log abstract - DCS noon - full");

            this.setTamanioColum(worksheet_DCS_noon_full, 'Full');
            rowCursor = 1;
            return this.AddDashInfoBuque(worksheet_DCS_noon_full, workbook, selectUser, rowCursor, 0)


          }
        ).then(
          resultRowFinal => {
            rowCursor = resultRowFinal + 2;

            return this.AddHeaderTableDNV(worksheet_DCS_noon_full, rowCursor, 0, 'Full')
            //  return this.AddValueTableDNV(worksheet_DCS_noon_full, rowCursor, 0, listExcelFormatDNV.GetFormatDNV_DCS_NOON_FULL)
          }).then(
            resultRowFinal => {
              rowCursor = resultRowFinal;

              return this.AddValueTableDNV_FULL(worksheet_DCS_noon_full, rowCursor, 0, listExcelFormatDNV.GetFormatDNV_DCS_NOON_FULL)

            }).then(
              resultRowFinal => {
                // creamos una nueva hoja
                worksheet_Bunker_report = workbook.addWorksheet("Bunker report");

                // TAMANO DE LA COLUMNA
                this.setTamanioColum(worksheet_Bunker_report, 'Bunker');
                rowCursor = 1;
                return this.AddDashInfoBuque(worksheet_Bunker_report, workbook, selectUser, rowCursor, 0)

              }).then(
                resultRowFinal => {
                  rowCursor = resultRowFinal + 2;

                  return this.AddBunkerTableDNV(worksheet_Bunker_report, rowCursor, 0, 'Bunker')
                  //  return this.AddValueTableDNV(worksheet_DCS_noon_full, rowCursor, 0, listExcelFormatDNV.GetFormatDNV_DCS_NOON_FULL)
                }).then(
                  resultRowFinal => {
                    rowCursor = resultRowFinal;

                    return this.AddValueTableBunkerReport(worksheet_Bunker_report, rowCursor, 0, listExcelFormatDNV.FormatDNV_Bunker_Report)

                  }).then(
                    result => {

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

  // tamanio de las columas
  private setTamanioColum(worksheet: Worksheet, is_Full_Min_Bunker: string) {
    let sizeColumns = [];
    // para los 2 es igual
    if (is_Full_Min_Bunker == 'Full' || is_Full_Min_Bunker == 'Min') {

      sizeColumns = [
        { width: 12.6 },// A
        { width: 7.7 },//B
        { width: 10 },// C
        { width: 8.3 },//D
        { width: 9.2 }, // E
        { width: 9.2 }, //F
        { width: 9.2 }, // G
        { width: 9.2 }, // H
        { width: 10.8 }, // I
        { width: 9.2 }, //J
        { width: 19.2 }, // K
        { width: 9.2 }, //L
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
      ];

    }

    if (is_Full_Min_Bunker == 'Full') {
      // auX
      sizeColumns.push(
        { width: 9.2 },
        { width: 11.2 },
        { width: 9.2 },
        { width: 9.2 },
        { width: 9.2 },
        { width: 9.2 },
        { width: 9.4 },
        { width: 9.2 },
        { width: 9.8 },
        { width: 9.2 },
        { width: 11.4 }
      );
      // boiler
      sizeColumns.push(
        { width: 9.2 },
        { width: 11.2 },
        { width: 9.2 },
        { width: 9.2 },
        { width: 9.2 },
        { width: 9.2 },
        { width: 9.4 },
        { width: 9.2 },
        { width: 9.8 },
        { width: 9.2 },
        { width: 11.4 }
      );

      // GI
      sizeColumns.push(
        { width: 9.2 },
        { width: 11.2 },
        { width: 9.2 },
        { width: 9.2 },
        { width: 9.2 },
        { width: 9.2 },
        { width: 9.4 },
        { width: 9.2 },
        { width: 9.8 },
        { width: 9.2 },
        { width: 11.4 }
      );

    }

    if (is_Full_Min_Bunker == 'Min') {

    }

    if (is_Full_Min_Bunker == 'Full' || is_Full_Min_Bunker == 'Min') {

      sizeColumns.push(
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
        { width: 11.4 },
        { width: 29.2 }//AH E;LIMINAR BORRAR ESTO.
      )
    }

    if (is_Full_Min_Bunker == 'Full') {
      sizeColumns.push(
        { width: 9.2 },
        { width: 9.2 },
        { width: 9.2 },
        { width: 9.2 }
      )
    }

    if (is_Full_Min_Bunker == 'Full' || is_Full_Min_Bunker == 'Min') {
      sizeColumns.push({ width: 9.2 })
    }

    if (is_Full_Min_Bunker == 'Bunker') {
      sizeColumns.push(
        { width: 16.6 },
        { width: 14.3 },
        { width: 22.1 },
        { width: 8.3 },
        { width: 8.3 },
        { width: 8.3 },
        { width: 15 },
        { width: 8.3 },
        { width: 8.3 },
        { width: 8.3 },
        { width: 8.3 },
        { width: 8.3 },
      )
    }


    worksheet.columns = sizeColumns;


  }

  // Agregamos el cuadro de informacion del buque.
  private AddHeaderTableDNV(worksheet, positRow: number, positCol: number, is_Full_Min_Bunker: string): Promise<number> {

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

          console.log('1')
          if (is_Full_Min_Bunker == 'Min' || is_Full_Min_Bunker == 'Full') {
            // Esto por defecto
            this.addStyleByColums(worksheet, positionRow, positionColumn, 'Machinery', 11, "", "ffffcc", true, true, "top");
            column = column + 11;
          }

          console.log('2')
          if (is_Full_Min_Bunker == 'Full') {
            // Boiler
            positionColumn = [column, column + 10];
            this.addStyleByColums(worksheet, positionRow, positionColumn, 'Machinery', 11, "", "ffffcc", true, true, "top");
            column = column + 11;
            // Aux
            positionColumn = [column, column + 10];
            this.addStyleByColums(worksheet, positionRow, positionColumn, 'Machinery', 11, "", "ffffcc", true, true, "top");
            column = column + 11;
            // Caldera
            positionColumn = [column, column + 10];
            this.addStyleByColums(worksheet, positionRow, positionColumn, 'Machinery', 11, "", "ffffcc", true, true, "top");
            column = column + 11;
          }

          console.log('3')
          // el rob va tanto para la hoja min y full
          if (is_Full_Min_Bunker == 'Min' || is_Full_Min_Bunker == 'Full') {
            positionColumn = [column, column + 9];
            this.addStyleByColums(worksheet, positionRow, positionColumn, 'ROB', 11, "", "ffffcc", true, true, "bottom");
          }

          // Obtenemos la fila le asignamos el tamaño
          let getRow = worksheet.getRow(row);
          getRow.height = 26;

          return row;
        }
      ).then(
        resultRow => {


          console.log('4')
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
          column += 1;


          if (is_Full_Min_Bunker == 'Min') {
            // Total Fuel consumption
            positionRow = [row, row];
            positionColumn = [column, column + 10];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Total Fuel consumption", 11, "", "ffffcc", true, false, "top", "left");
            column += 11;

          }

          if (is_Full_Min_Bunker == 'Full') {
            // Total Fuel consumption
            positionRow = [row, row];
            positionColumn = [column, column + 10];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Main engines consumption", 11, "", "ffffcc", true, false, "top", "left");
            column += 11;

            positionRow = [row, row];
            positionColumn = [column, column + 10];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Aux engines consumption", 11, "", "ffffcc", true, false, "top", "left");
            column += 11;

            positionRow = [row, row];
            positionColumn = [column, column + 10];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Boilers consumption", 11, "", "ffffcc", true, false, "top", "left");
            column += 11;

            positionRow = [row, row];
            positionColumn = [column, column + 10];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Inert gas generators consumption", 11, "", "ffffcc", true, false, "top", "left");
            column += 11;
          }

          if (is_Full_Min_Bunker == 'Min' || is_Full_Min_Bunker == 'Full') {
            positionColumn = [column, column + 9];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Remaining on board", 11, "", "ffffcc", true, false, "top", "left");
            column += 10;
          }

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
          column = column + 5;


          console.log('6')
          // maquina principal o motor principar es para ambos
          if (is_Full_Min_Bunker == 'Min' || is_Full_Min_Bunker == 'Full') {

            //HFO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "HFO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LFO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LFO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //MGO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "MGO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //MDO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "MDO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LPG
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LPG", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LNG
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LNG", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Methanol
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Methanol", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Ethanol
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Ethanol", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel consumption
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel consumption", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel type
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel type", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel emission factor
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel emission factor", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;

          }

          console.log('7')
          // auxiliares caldera  gas innerte
          if (is_Full_Min_Bunker == 'Full') {

            //HFO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "HFO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LFO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LFO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //MGO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "MGO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //MDO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "MDO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LPG
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LPG", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LNG
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LNG", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Methanol
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Methanol", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Ethanol
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Ethanol", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel consumption
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel consumption", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel type
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel type", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel emission factor
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel emission factor", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;







            //HFO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "HFO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LFO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LFO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //MGO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "MGO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //MDO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "MDO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LPG
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LPG", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LNG
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LNG", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Methanol
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Methanol", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Ethanol
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Ethanol", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel consumption
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel consumption", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel type
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel type", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel emission factor
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel emission factor", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;





            //HFO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "HFO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LFO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LFO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //MGO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "MGO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //MDO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "MDO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LPG
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LPG", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LNG
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LNG", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Methanol
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Methanol", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Ethanol
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Ethanol", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel consumption
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel consumption", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel type
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel type", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel emission factor
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel emission factor", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;

            console.log('8')
          }

          // consumo por ROB
          if (is_Full_Min_Bunker == 'Min' || is_Full_Min_Bunker == 'Full') {

            console.log('9')
            //HFO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "HFO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LFO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LFO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //MGO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "MGO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //MDO
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "MDO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LPG
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LPG", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //LNG
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "LNG", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Methanol
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Methanol", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Ethanol
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Ethanol", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel consumption
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel consumption", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
            //Other fuel type
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel type", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;

            console.log('10')

          }

          if (is_Full_Min_Bunker == 'Full') {
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel IFO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;

            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "PP fuel MGO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;

            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "Other fuel MGO", 11, "", "ffffcc", true, false, "top", "left");
            column = column + 1;
          }

          if (is_Full_Min_Bunker == 'Bunker') {

          }

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

          if (is_Full_Min_Bunker == 'Min' || is_Full_Min_Bunker == 'Full') {
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
          }


          // auxiliares, caldera , gas iinerte
          if (is_Full_Min_Bunker == 'Full') {
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
            column = column + 1;
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "(nr)", 11, "", "ffffcc", true, false, "bottom", "left");
            column = column + 1;
          }

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

          if (is_Full_Min_Bunker == 'Full') {
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
            column = column + 1;
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
            column = column + 1;
            positionColumn = [column, column];
            this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "bottom", "left");
            column = column + 1;
          }
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
  // Agregamos el cuadro de informacion del buque.
  private AddBunkerTableDNV(worksheet, positRow: number, positCol: number, is_Full_Min_Bunker: string): Promise<number> {

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
          positionColumn = [column, column + 6];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Mandatory data fields', 11, "", "d6dce4", true, true);

          return row;
        }
      ).then(
        resultRow => {
          // HEADER 2
          row = resultRow + 1;
          positionRow = [row, row];
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Bunker Delivery Note Number', 11, "", "ffffcc", true, true, "top");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Bunker Delivery Date', 11, "", "ffffcc", true, true, "top");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Fuel Type', 11, "", "ffffcc", true, true, "top");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Mass', 11, "", "ffffcc", true, true, "top");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Sulphur Content', 11, "", "ffffcc", true, true, "top");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Density @ 15 °C', 11, "", "ffffcc", true, true, "top");
          column = column + 1;
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, 'Lower heating value', 11, "", "ffffcc", true, true, "top");
          column = column + 1;

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

          positionRow = [row, row];
          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "(BDN No.)", 11, "", "ffffcc", true, false, "top", "left");
          column = column + 1;

          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "yyyy-mm-dd", 11, "", "ffffcc", true, false, "top", "left");
          column = column + 1;

          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "HFO,LFO,MGO,MDO,LPG,LNG,Methanol,Ethanol", 11, "", "ffffcc", true, false, "top", "left");
          column = column + 1;

          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt", 11, "", "ffffcc", true, false, "top", "left");
          column = column + 1;

          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "% m/m", 11, "", "ffffcc", true, false, "top", "left");
          column = column + 1;

          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt/m³", 11, "", "ffffcc", true, false, "top", "left");
          column = column + 1;

          positionColumn = [column, column];
          this.addStyleByColums(worksheet, positionRow, positionColumn, "mt/m³", 11, "", "ffffcc", true, false, "top", "left");
          column = column + 1;

          let getRow = worksheet.getRow(row);
          getRow.height = 35;


          console.log('FINALIZA CON EL HEADER')
          return row;
        }
      );
  }


  private async ArmamosElObjetoParaELFORMATODNV(selectUserId: number, startDate: string, endDate: string, selectUser: User): Promise<ListExcelFormatDNV> {

    let ListGetFormatDNV: GetFormatDNV[] = [];
    let ListGetFormatDNV_DCS_NOON_FULL: GetFormatDNV_DCS_NOON_FULL[] = [];

    let listGetReportVoyagePortDaily: GetReportVoyagePortDaily[] = [];
    let listBunker_report: FormatDNV_Bunker_Report[] = [];
    let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';

    return await Promise.resolve(true).then(
      result => {
        // Buscamos la informacion del combustible de inicio y fin segun la fecha.

        // DNV
        return this.excelService.GetReportDNVByUser(selectUserId, startDate, endDate).pipe().toPromise();
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


        listGetReportVoyagePortDaily.forEach(
          (item: GetReportVoyagePortDaily) => {

            let getFormatDNV: GetFormatDNV = new GetFormatDNV();
            let getFormatDNV_DCS_NOON_FULL: GetFormatDNV_DCS_NOON_FULL = new GetFormatDNV_DCS_NOON_FULL();
            let bunker_reportIfo: FormatDNV_Bunker_Report = new FormatDNV_Bunker_Report();
            let bunker_reportMgo: FormatDNV_Bunker_Report = new FormatDNV_Bunker_Report();

            let hora = '';
            if (selectUserId == 10) {
              hora = '13:00'
            }
            // si es el buque camila el cierre en horario utc es a las 17 hrs hora local 12 del medio dia
            if (selectUserId == 13) {
              hora = '15:00'
            }

            // ================= EMPEZAMOS CON ARMAR EL OBJETO =========================
            getFormatDNV.reportId = item.dailyReportId;
            getFormatDNV.date = FormatYYYYMMDDUTCToSTRING(item.date);
            getFormatDNV.time = hora;

            // AGREGAR ESTA INFORMACION REVISAR ELIMINAR CORREGIR 
            getFormatDNV.north_degree = item.north_degree;
            getFormatDNV.north_minutes = item.north_minutes;
            getFormatDNV.north_north_south = item.north_north_south;
            getFormatDNV.east_degree = item.east_degree;
            getFormatDNV.east_minutes = item.east_minutes;
            getFormatDNV.east_east_west = item.east_east_west;


            getFormatDNV.event = 'Daily';

            getFormatDNV.event_time_previous = item.steamingTime;

            getFormatDNV.event_time_sailing = item.navigatedTime || 0;

            getFormatDNV.distance = item.distance;

            getFormatDNV.machinery_hfo = 0;
            getFormatDNV.machinery_lfo = this.formuleService.CalculateTotal_IFO_Or_MGO(item, 'IFO');
            getFormatDNV.machinery_mgo = this.formuleService.CalculateTotal_IFO_Or_MGO(item, 'MGO');
            getFormatDNV.machinery_mdo = 0;
            getFormatDNV.machinery_lpg = 0;
            getFormatDNV.machinery_lng = 0;
            getFormatDNV.machinery_methanol = 0;
            getFormatDNV.machinery_other_fuel_consumption = 0;
            getFormatDNV.machinery_other_fuel_type = 0;
            getFormatDNV.machinery_other_full_emission = 0;

            ROB_IFO = ROB_IFO - getFormatDNV.machinery_lfo + item.bunkeringIfo;
            ROB_MGO = ROB_MGO - getFormatDNV.machinery_mgo + item.bunkeringMgo;

            getFormatDNV.rob_hfo = 0;
            getFormatDNV.rob_lfo = ROB_IFO;
            getFormatDNV.rob_mgo = ROB_MGO;
            getFormatDNV.rob_mdo = 0;
            getFormatDNV.rob_lpg = 0;
            getFormatDNV.rob_lng = 0;
            getFormatDNV.rob_methanol = 0;
            getFormatDNV.rob_other_fuel = 0;
            getFormatDNV.rob_other_fuel_type = 0;


            // Se agrega el objer a la lista del formato DNV
            ListGetFormatDNV.push(getFormatDNV)

            getFormatDNV_DCS_NOON_FULL.reportId = item.dailyReportId;
            getFormatDNV_DCS_NOON_FULL.date = FormatYYYYMMDDUTCToSTRING(item.date);
            getFormatDNV_DCS_NOON_FULL.time = hora;

            // AGREGAR ESTA INFORMACION REVISAR ELIMINAR CORREGIR 
            getFormatDNV_DCS_NOON_FULL.north_degree = item.north_degree;
            getFormatDNV_DCS_NOON_FULL.north_minutes = item.north_minutes;
            getFormatDNV_DCS_NOON_FULL.north_north_south = item.north_north_south;
            getFormatDNV_DCS_NOON_FULL.east_degree = item.east_degree;
            getFormatDNV_DCS_NOON_FULL.east_minutes = item.east_minutes;
            getFormatDNV_DCS_NOON_FULL.east_east_west = item.east_east_west;

            getFormatDNV_DCS_NOON_FULL.event = 'Daily';
            getFormatDNV_DCS_NOON_FULL.event_time_previous = item.steamingTime;
            getFormatDNV_DCS_NOON_FULL.event_time_sailing = item.navigatedTime || 0;
            getFormatDNV_DCS_NOON_FULL.distance = item.distance;

            // ============== DCS NOON FULL ========
            getFormatDNV_DCS_NOON_FULL.me_machinery_lfo = item.mplaIfo;
            getFormatDNV_DCS_NOON_FULL.me_machinery_mgo = item.mplaMgo;

            getFormatDNV_DCS_NOON_FULL.aux_machinery_lfo = item.auxIfo;
            getFormatDNV_DCS_NOON_FULL.aux_machinery_mgo = item.auxMgo;

            getFormatDNV_DCS_NOON_FULL.boiler_machinery_lfo = item.boilerIfo;
            getFormatDNV_DCS_NOON_FULL.boiler_machinery_mgo = item.boilerMgo;


            getFormatDNV_DCS_NOON_FULL.gi_machinery_lfo = 0;
            getFormatDNV_DCS_NOON_FULL.gi_machinery_mgo = item.giMgo;

            getFormatDNV_DCS_NOON_FULL.ifo_other = item.otherIfo;
            getFormatDNV_DCS_NOON_FULL.mgo_pp = item.ppMgo;

            getFormatDNV_DCS_NOON_FULL.mgo_other = item.otherMgo;


            getFormatDNV_DCS_NOON_FULL.rob_lfo = ROB_IFO;
            getFormatDNV_DCS_NOON_FULL.rob_mgo = ROB_MGO;

            // Se agrega el objer a la lista del formato DNV
            ListGetFormatDNV_DCS_NOON_FULL.push(getFormatDNV_DCS_NOON_FULL);


            if (item.bunkeringIfo != 0) {
              bunker_reportIfo.bunker_delivery_date = FormatYYYYMMDDUTCToSTRING(item.date);
              bunker_reportIfo.fuel_type = textIFOorVLSFOorLSFO;
              bunker_reportIfo.mass = item.bunkeringIfo;
              bunker_reportIfo.sulphur_content = 1.00;
              bunker_reportIfo.density = 0.986;
              bunker_reportIfo.lower_heating_value = 40.78;
              listBunker_report.push(bunker_reportIfo)
            }

            if (item.bunkeringMgo != 0) {
              bunker_reportMgo.bunker_delivery_date = FormatYYYYMMDDUTCToSTRING(item.date);
              bunker_reportMgo.fuel_type = 'MGO';
              bunker_reportMgo.mass = item.bunkeringMgo;
              bunker_reportMgo.sulphur_content = 0.10;
              bunker_reportMgo.density = 0.859;
              bunker_reportMgo.lower_heating_value = 42.57;
              listBunker_report.push(bunker_reportMgo)
            }
          }
        )


        return new ListExcelFormatDNV(
          ListGetFormatDNV,
          ListGetFormatDNV_DCS_NOON_FULL,
          listBunker_report
        );
      }
    );



  }


  // Agregamos el cuadro de informacion del buque.
  private AddValueTableDNV_MIN(worksheet, positRow: number, positCol: number, listGetFormatDNV: GetFormatDNV[]): Promise<number> {

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



  // Agregamos el cuadro de informacion del buque.
  private AddValueTableDNV_FULL(worksheet, positRow: number, positCol: number, listGetFormatDNV_DCS_NOON: GetFormatDNV_DCS_NOON_FULL[]): Promise<number> {

    // Reset
    let row = positRow;
    let column = positCol;

    // Le sumo 7 celdas por que la logitud de la leyenda es 7 celdas
    let positionRow = [row, row];
    let positionColumn = [column, column];
    return Promise.resolve(true)
      .then(
        result => {

          listGetFormatDNV_DCS_NOON.forEach(
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



              // =============================   ME
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.me_machinery_hfo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.me_machinery_lfo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.me_machinery_mgo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.me_machinery_mdo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.me_machinery_lpg, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.me_machinery_lng, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.me_machinery_methanol, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.me_machinery_ethanol, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.me_machinery_other_fuel_consumption, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.me_machinery_other_fuel_type, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.me_machinery_other_full_emission, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;


              // =============================   AUX
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.aux_machinery_hfo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.aux_machinery_lfo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.aux_machinery_mgo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.aux_machinery_mdo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.aux_machinery_lpg, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.aux_machinery_lng, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.aux_machinery_methanol, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.aux_machinery_ethanol, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.aux_machinery_other_fuel_consumption, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.aux_machinery_other_fuel_type, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.aux_machinery_other_full_emission, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;


              // =============================   BOILER
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.boiler_machinery_hfo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.boiler_machinery_lfo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.boiler_machinery_mgo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.boiler_machinery_mdo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.boiler_machinery_lpg, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.boiler_machinery_lng, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.boiler_machinery_methanol, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.boiler_machinery_ethanol, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.boiler_machinery_other_fuel_consumption, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.boiler_machinery_other_fuel_type, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.boiler_machinery_other_full_emission, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;

              // =============================   gi
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.gi_machinery_hfo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.gi_machinery_lfo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.gi_machinery_mgo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.gi_machinery_mdo, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.gi_machinery_lpg, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.gi_machinery_lng, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.gi_machinery_methanol, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.gi_machinery_ethanol, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.gi_machinery_other_fuel_consumption, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.gi_machinery_other_fuel_type, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.gi_machinery_other_full_emission, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');



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
              column = column + 1;

              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.ifo_other, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.mgo_pp, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.mgo_other, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');


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


  // Agregamos el cuadro de informacion del buque.
  private AddValueTableBunkerReport(worksheet, positRow: number, positCol: number, listFormatDNV_Bunker_Report: FormatDNV_Bunker_Report[]): Promise<number> {

    console.log('AddValueTableBunkerReport')
    // Reset
    let row = positRow;
    let column = positCol;

    // Le sumo 7 celdas por que la logitud de la leyenda es 7 celdas
    let positionRow = [row, row];
    let positionColumn = [column, column];
    return Promise.resolve(true)
      .then(
        result => {


          console.log('INICIA RECORRER LIST ADD VALUE')
          listFormatDNV_Bunker_Report.forEach(
            (item: FormatDNV_Bunker_Report) => {

              console.log('ADD VALUE')
              console.log(item)
              // HEADER 3
              row = row + 1;
              // UTC
              column = positCol;
              debugger
              positionRow = [row, row];


              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.bunker_delivery_number, 10, "", "ffffff", true, false, "center", "right", "Arial");
              column = column + 1;

              console.log('PRIMERO VALUE')
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.bunker_delivery_date, 10, "", "ffffff", true, false, "center", "right", "Arial");
              column = column + 1;

              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.fuel_type, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;

              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.mass, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;

              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.sulphur_content, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;

              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.density, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.000');
              column = column + 1;
              positionColumn = [column, column];
              this.addStyleByColums(worksheet, positionRow, positionColumn, item.lower_heating_value, 10, "", "ffffff", true, false, "center", "right", "Arial", '0.00');
              column = column + 1;


              let getRow = worksheet.getRow(row);
              getRow.height = 15;
            }
          )


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


}
