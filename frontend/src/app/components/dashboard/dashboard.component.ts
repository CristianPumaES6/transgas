import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DailyReport } from 'src/app/models/daily-report';
import { User } from 'src/app/models/user';
import { Voyage, VoyageFilterByYears } from 'src/app/models/voyage';
import { ASideService } from 'src/app/services/a-side.service';
import { DailyReportService } from 'src/app/services/daily-report.service';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PortService } from 'src/app/services/port.service';
import { UserService } from 'src/app/services/user.service';
import { VoyageService } from 'src/app/services/voyage.service';

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

  // El viaje generado suma total.
  public generateVoyages: Voyage[] = [];

  public getVoyages: Voyage[] = [];
  public selectVoyageId: number = 0;
  public selectVoyage: Voyage = new Voyage();


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private voyageService: VoyageService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
    private aSideService: ASideService) { }

  ngOnInit(): void {
    console.log('ngOnInit()');

    // Activamos el loading.
    this.loadingService.Open();

    // Rol del usurio logeado.
    this.roleUser = this.userService.GetIdentity().role;


    Promise.resolve(true).then(
      result => {

        // Instanciamos el obj que usaremos en la consulta de registro de viajes
        let user: User = new User();
        // Si no eres un admin solo puedes registrar voajes con tu userId logeado.
        if (this.roleUser === 'BUQUE') {
          user.id = this.userService.GetIdentity().id;
          user.name = this.userService.GetIdentity().name;
          user.nick = this.userService.GetIdentity().nick;
        }
        // Traigo a todos los User y lo instancio en el obj.
        return this.GetUsers(user).pipe().toPromise();
      }
    ).then(
      (result) => {

        // Seleccionaremos el primer buque del arreglo.
        let filter: VoyageFilterByYears = new VoyageFilterByYears();
        let firstUser: User = this.getUsers.find(user => user.role === 'BUQUE');

        if (firstUser) {
          this.selectUser = firstUser;
          this.selectUserId = firstUser.id;
          filter.userId = this.selectUser.id;
          filter.years = [2021];
        } else {
          throw 'NO_BUQUE_REGISTER';
        }

        // Traigo a todos los User y lo instancio en el obj.
        // GeyVoyage obtiene todos los puertos.
        return this.GetVoyagesByYears(filter).pipe().toPromise();
      }
    ).then(
      result => {

        debugger;
        this.Generate();
        // Activamos el loading.
        this.loadingService.Close();
      }
    ).catch(
      err => {

        // Manejo el error
        let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, err || 'ERROR_ON_LOAD'));

        console.error(msg);
        console.dir(err);

        this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
        // Deshabilito el spinner de loading
        this.loadingService.Close();
      });


  }




  // GetUsers: Cargo todos los Users para el listado de Users.
  private GetUsers(user: User): Observable<boolean> {
    // Test
    console.log('GetUsers(user: User)');
    console.log(user);

    // Obtenemos todos los usuarios
    return this.userService.GetUsers(user).pipe(map(
      (resultUser: User[]) => {

        // Filtramos para que solos los busques se visualizen
        this.getUsers = resultUser.filter((userItem: User) => {
          if (userItem.role === 'ADMIN' || userItem.role === 'SUPPORT') {
            return false;
          }
          return true;
        });

        // Segun el resultado retornamos la respuesta.
        return (resultUser !== null);
      }
    ));

  }


  // GetDailyReports: Cargo todos los registros de viaje, util para el dashboard.
  private GetVoyagesByYears(filter: VoyageFilterByYears): Observable<boolean> {

    // Consulto el servicio
    return this.voyageService.GetsVoyageByYears(filter).pipe(map(
      (resultVoyages: Voyage[]) => {

        // Guardamos el valor en nuestra variable global.
        this.getVoyages = resultVoyages || this.getVoyages;

        // Segun el resultado retornamos la respuesta.
        return (resultVoyages !== null);
      }
    ));

  }

  public SelectComboBuque(): boolean {
    console.log('SelectComboBuque()');
    alert(this.selectUserId);
    return false;
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


  public Generate() {


    this.generateVoyages = JSON.parse(JSON.stringify(this.getVoyages));

    this.generateVoyages = this.generateVoyages.filter(
      (voyage: Voyage, indexV: number, voyages: any[]) => {

        let totalConsumoViajeIFO = 0;
        let totalConsumoViajeMGO = 0;

        // Recorremos los puertos
        voyage.ports = voyage.ports.filter(
          (port, index, ports) => {


            let totalConsumoByPortIFO = 0;
            let totalConsumoByPortMGO = 0;

            // Filtramos si el estado es true, ademas de filtros.
            if (port.status) {
              // Recorremos los reportes
              port.dailyReports = port.dailyReports.filter(
                (report, index, reports) => {


                  if (report.status) {

                    totalConsumoByPortIFO = totalConsumoByPortIFO + this.SumaIfo(report);
                    totalConsumoByPortMGO = totalConsumoByPortMGO + this.SumaMgo(report);
                    return true;
                  } else {
                    return false;
                  }
                }
              )

              port.robIfo = totalConsumoByPortIFO;
              port.robMgo = totalConsumoByPortMGO

              totalConsumoViajeIFO = totalConsumoViajeIFO + totalConsumoByPortIFO;
              totalConsumoViajeMGO = totalConsumoViajeMGO + totalConsumoByPortMGO;
              return true;
            } else {
              return false;
            }

          }
        );

        voyage.totalMGO = totalConsumoViajeMGO;
        voyage.totalIFO = totalConsumoViajeIFO;

        console.log('TOTAL DE Voyage N°' + voyage.voyageNumber + '   MGO:' + totalConsumoViajeMGO + 'IFO:' + totalConsumoViajeIFO);

        return true;
      });

    console.log(this.getVoyages);
    console.log(this.generateVoyages);

  }

  // Generate data
  public GenerateResumeVoyage(iVoyage): boolean {

    for (const iVoyage of this.getVoyages) {

      let resuVoyage: any = {};
      resuVoyage.name = 'Voyage ' + iVoyage.year + ' N°' + iVoyage.voyageNumber;

      // resumenVoyage.push()
    }

    return false;
  }


  // Suma los campos ifo()
  private SumaIfo(report: DailyReport): number {
    let ifo = report.mplaIfo + report.auxIfo + report.boilerIfo + report.otherIfo;
    return ifo;
  }
  private SumaMgo(report: DailyReport): number {
    let mgo = report.mplaMgo + report.auxMgo + report.boilerMgo + report.ppMgo + report.giMgo + report.otherMgo;
    return mgo;
  }
}
