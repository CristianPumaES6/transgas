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
    public CalculateIfoTotal(getReportVoyagePortDaily: GetReportVoyagePortDaily): number {
      // Total
      let total: number = 0;

      // SUMAMOS TODOS LOS EQUIPOS
      total =  getReportVoyagePortDaily.mplaIfo + getReportVoyagePortDaily.boilerIfo +  getReportVoyagePortDaily.otherIfo + getReportVoyagePortDaily.auxIfo;
      
      // RETornamos el total.
      return total;
    }
  
    // Calcula la velocidad Distancia / time
    public CalculateDailyIfoTotal(getReportVoyagePortDaily: GetReportVoyagePortDaily): number {
      // Total
      let total: number = 0;

      // SUMAMOS TODOS LOS EQUIPOS
      total =  getReportVoyagePortDaily.mplaIfo + getReportVoyagePortDaily.boilerIfo +  getReportVoyagePortDaily.otherIfo + getReportVoyagePortDaily.auxIfo;
      
      // Calculamos el dayli consumtion si no hay tiempo el valor por defecto es 0
      let dailyConsumtion =getReportVoyagePortDaily.steamingTime ? (total * 24)/getReportVoyagePortDaily.steamingTime : 0;
      // RETornamos el total.
      return dailyConsumtion;
    }
  
}
