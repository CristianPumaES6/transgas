import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { User } from 'src/app/models/user';
import { Voyage } from 'src/app/models/voyage';
import { ASideService } from 'src/app/services/a-side.service';
import { DailyReportService } from 'src/app/services/daily-report.service';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PortService } from 'src/app/services/port.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public isViewFilter: boolean = true;
  public activityPerformed = new FormControl();
  public activityPerformedList: string[] = ['LOADING', 'DOWNLOADING', 'SAILING_IN_BALLAST', 'SAILING_WITH_LADEN', 'ECONOMICAL_NAVIGATION', 'ANCHORED', 'MANEUVER', 'OTHER_ACT'];
  public disableEdit = false;

  // Variables de traduccion
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'dashboard';


  public roleUser: string = '';
  public cantDiasDashboard: number = 0;


  // Usuarios.
  public getUsers: User[] = [];
  public selectUserId: number = 0;
  public selectUser: User = new User();

  // Filtro por fecha inicio y fin
  public startDate: Date;
  public endDate: Date;


  public getVoyages: Voyage[] = [];
  public selectVoyageId: number = 0;
  public selectVoyage: Voyage = new Voyage();


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private voyageService: PortService,
    private dailyReportService: DailyReportService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
    private aSideService: ASideService) { }

  ngOnInit(): void {
    console.log('ngOnInit()');

  }

  public ClearFilter(): boolean {
    console.log('ClearFilter()');

    return false;
  }

  public viewFilter(isView: boolean) {
    console.log('viewFilter(isView: boolean)');

    this.isViewFilter = isView;
  }


  public exportExcel(): boolean {
    console.log('exportExcel();');

    return false;
  }

  public exportPdf(): boolean {
    console.log('exportPdf()');

    return false;
  }

  public GenerateReporteByDate(): boolean {
    console.log('GenerateReporteByDate()');

    return false;
  }

  public SelectionmodalDisplayView(): boolean {
    console.log('SelectionmodalDisplayView()');

    return false;
  }

}
