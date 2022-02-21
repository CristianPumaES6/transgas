import { Injectable } from '@angular/core';
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

}
