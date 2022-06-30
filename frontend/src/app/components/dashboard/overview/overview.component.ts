import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { User } from 'src/app/models/user';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  // Esta variable nos ayudara a saber si nos encontramos con conexion al servidor.
  public isOnline: boolean = true;

  // Variables de traduccion
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'consumptionAnalysis';

  // Rol del usuario logeado.
  public roleUser: string = '';

  // DATA consultas server.
  // Todos los usuarios obtenidos por el getUsers.
  public getUsers: User[] = [];

  public name: string = '';
  public image: string = 'http://localhost:3000/ALBANE-ce510.jpg';
  public isConsumptionIFO: string = 'IFO';
  public isConsumptionVLSFO: string = 'VLSFO';
  public startDate: string = '10/20/222 08 00';
  public startIFO: number = 200;
  public startMGO: number = 90;
  public distance: number = 10;
  public endIFO: number = 10;
  public endMGO: number = 10;
  public lastDate: string = '10/20/222 08 00';
  public departurePort: string = 'Lima';
  public arrivalPort: string = 'Lima';


  constructor(
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit(): void {
  }

}
