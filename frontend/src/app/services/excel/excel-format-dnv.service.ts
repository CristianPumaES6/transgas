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

@Injectable({
  providedIn: 'root'
})
export class ExcelFormatDNVService {

  // Translate
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'exportExcel';

  constructor(
    private languageService: LanguageService,
    private dailyReportService: DailyReportService,
  ) { }


  // Opcion que exporta el excel.
  public async ExportReporteEntryForUser(selectUser: User): Promise<boolean> {


    // Creamos una nueva hoja de trabajo
    let workbook = new Workbook();
    workbook.creator = 'codev.site';


    let listGetReport: GetReportVoyagePortDaily[] = [];
    let getInfoFuelStartEndByFilterDate: InfoFuelStartEndForDate;

    return await Promise.resolve(true)
      .then(
        result => {
          if (!result) throw 'ERROR GER REPORT';

          // aGREGAMOS LA HOJA DE TRABAJO
          let worksheet = workbook.addWorksheet("Log abstract - DCS noon - min");

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
            { width: 9.2 },
            { width: 9.2 },
            { width: 9.2 },
            { width: 9.2 },
            { width: 9.2 },
            { width: 9.2 },
            { width: 9.2 },
            { width: 29.2 },//AH E;LIMINAR BORRAR ESTO.
          ];






          // JUNTAR COLUMA

          worksheet.mergeCells('A1', 'D1');


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


}
