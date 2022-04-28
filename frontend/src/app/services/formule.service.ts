import { Injectable } from '@angular/core';
import { DailyReport } from '../models/daily-report';
import { GetReportVoyagePortDaily } from '../models/dialog-export-excel';
import { DailyReportService } from './daily-report.service';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class FormuleService {

  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'formuleService';

  constructor(
    private languageService: LanguageService,
    private dailyReportService: DailyReportService,
  ) { }


  // Calcula la velocidad Distancia / time
  public CalculateSpeed(distance: number, time: number): number {

    let speed: number = 0;

    speed = (distance || 0) / (time || 1);

    return speed;
  }


  // Calcula la velocidad Distancia / time
  public CalculateDailyTotal_IFO_Or_MGO(getReportVoyagePortDaily: GetReportVoyagePortDaily, typeIfoOrMGO: string): number {
    // Total
    let total: number = 0;

    total = this.CalculateTotal_IFO_Or_MGO(getReportVoyagePortDaily,typeIfoOrMGO);

    // Calculamos el dayli consumtion si no hay tiempo el valor por defecto es 0
    let dailyConsumtion = getReportVoyagePortDaily.steamingTime ? (total * 24) / getReportVoyagePortDaily.steamingTime : 0;
    // RETornamos el total.
    return dailyConsumtion;
  }



  // Calcula el total de combustible
  public CalculateTotal_IFO_Or_MGO(getReportVoyagePortDaily: GetReportVoyagePortDaily, typeIfoOrMGO: string): number {
    // Total
    let total: number = 0;

    if (typeIfoOrMGO == 'IFO') {
      // SUMAMOS TODOS LOS EQUIPOS
      total = getReportVoyagePortDaily.mplaIfo + getReportVoyagePortDaily.auxIfo + getReportVoyagePortDaily.boilerIfo + getReportVoyagePortDaily.otherIfo;
    } else if (typeIfoOrMGO == 'MGO') {
      // SUMAMOS TODOS LOS EQUIPOS
      total = getReportVoyagePortDaily.mplaMgo + getReportVoyagePortDaily.boilerMgo + getReportVoyagePortDaily.giMgo + getReportVoyagePortDaily.ppMgo + getReportVoyagePortDaily.auxMgo + getReportVoyagePortDaily.otherMgo;
    }
    // RETornamos el total.
    return total;
  }


}
