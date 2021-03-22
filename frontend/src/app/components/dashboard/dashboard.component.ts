import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DailyReport, Speed } from '../../models/daily-report';
import { User } from '../../models/user';
import { Voyage, VoyageFilterByYears } from '../../models/voyage';
import { ASideService } from '../../services/a-side.service';
import { DailyReportService } from '../../services/daily-report.service';
import { LanguageService } from '../../services/language.service';
import { LoadingService } from '../../services/loading.service';
import { PortService } from '../../services/port.service';
import { UserService } from '../../services/user.service';
import { VoyageService } from '../../services/voyage.service';


import * as Chart from 'chart.js';
import { mathRound } from '../../../assets/math/math.assets';
import PerfectScrollbar from 'perfect-scrollbar';
import { Port } from '../../models/port';
import { FormatDate, GetMonthYearFromDate, ComparePreviousDates, CompareAfterDates, TextMonthYear, TextMonthDayYear, DiffDates } from 'src/assets/moment/moment.assets';
import { ActivityPerformed, ConsumptionMachineMGO, ConsumptionMachineIFO } from '../../models/dashboard';

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
  public summaryBy: string = 'VOYAGES';
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


  public xLabelReport: any[] = [];

  public configLineaIFO: any; // configuracion del elemento
  public chartLineIFO: any; // LINEA
  public dataIFO = [];

  public configLineaMGO: any; // configuracion del elemento
  public chartLineMGO: any; // LINEA
  public dataMGO = [];

  public configLineaSPEED: any;
  public chartLineSPEED: any; // LINEA
  public dataSPEED = [];


  // Consumo IFO POR ACTIVIDAD
  public totalTimePerActivityIFO: ActivityPerformed = new ActivityPerformed();
  public totalDistanceMilesByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

  public averageSpeedByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
  public averageSpeedCharterByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

  public voyageConsumptionByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
  public dayliConsumptionByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

  public dayliConsumptionCharterByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
  public timePerNavigationCharterByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
  public voyageConsumptionCharterByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

  public balanceConsumptionByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
  public balanceTimeByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

  // CONSUMER MGO
  public totalTimePerActivityMGO: ActivityPerformed = new ActivityPerformed();
  public totalDistanceMilesByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();

  public averageSpeedByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();
  public averageSpeedCharterByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();

  public voyageConsumptionByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();
  public dayliConsumptionByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();

  public dayliConsumptionCharterByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();
  public timePerNavigationCharterByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();
  public voyageConsumptionCharterByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();

  public balanceConsumptionByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();
  public balanceTimeByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();


  // CONSUMER MGO POR MAQUINA
  public consumptionTotalMGO = new ConsumptionMachineMGO();
  public consumptionDaysRealMGO = new ConsumptionMachineMGO();
  public consumptionDaysByContractMGO = new ConsumptionMachineMGO();
  public consumptionDailyBalanceMGO = new ConsumptionMachineMGO();

  // CONSUMER MGO POR MAQUINA
  public consumptionTotalIFO: ConsumptionMachineIFO = new ConsumptionMachineIFO();
  public consumptionDaysRealIFO: ConsumptionMachineIFO = new ConsumptionMachineIFO();
  public consumptionDaysByContractIFO: ConsumptionMachineIFO = new ConsumptionMachineIFO();
  public consumptionDailyBalanceIFO: ConsumptionMachineIFO = new ConsumptionMachineIFO();

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
    // PerfectScrooll
    setTimeout(() => {
      new PerfectScrollbar('.body-full-container', {
        suppressScrollX: true
      });

      // PerfectScrollbar, para el elemento div az-contact-info-body del html.
      new PerfectScrollbar('.PerfectScrollbar-table-data-MGO', {
        suppressScrollY: true,
        minScrollbarLength: 60
      });

      new PerfectScrollbar('.PerfectScrollbar-table-data-LSFO', {
        suppressScrollY: true,
        minScrollbarLength: 20
      });



      // PerfectScrollbar, para el elemento div az-contact-info-body del html.
      new PerfectScrollbar('.PerfectScrollbar-table-data-activity-lsfo', {
        suppressScrollY: true,
        minScrollbarLength: 20
      });


      // PerfectScrollbar, para el elemento div az-contact-info-body del html.
      new PerfectScrollbar('.PerfectScrollbar-table-data-activity-mgo', {
        suppressScrollY: true,
        minScrollbarLength: 20
      });

    }, 500)

    Promise.resolve(true).then(
      result => {
        this.PluginChartLine();
        // Generamos las lineas en el canvas
        this.GenetareLineIFO();
        this.GenetareLineMGO();
        this.GenetareLineSPEED();

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
          filter.years = [2021, 2020];
        } else {
          throw 'NO_BUQUE_REGISTER';
        }

        // Traigo a todos los User y lo instancio en el obj.
        // GeyVoyage obtiene todos los puertos.
        return this.GetVoyagesByYears(filter).pipe().toPromise();
      }
    ).then(
      result => {

        this.GenerateDataByFilter(this.getVoyages);

        this.GenerateDashboardBySumary()


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

    Promise.resolve(true).then(
      result => {
        // Activamos el loading.
        this.loadingService.Open();

        // Seleccionamos al usuairo
        this.selectUser = this.getUsers.find(user => user.id === this.selectUserId);
        return true;

      }
    ).then(
      result => {

        // Seleccionaremos el primer buque del arreglo.
        let filter: VoyageFilterByYears = new VoyageFilterByYears();
        filter.userId = this.selectUserId;
        filter.years = [2021, 2020];
        // Traigo a todos los User y lo instancio en el obj.
        // GeyVoyage obtiene todos los puertos.
        return this.GetVoyagesByYears(filter).pipe().toPromise();
      }
    ).then(
      reulst => {


        this.GenerateDataByFilter(this.getVoyages);

        this.GenerateDashboardBySumary()


        // Activamos el loading.
        this.loadingService.Close();
      }
    )

    return false;
  }

  public SelectComboVoyage(index: number): boolean {

    console.log('SelectComboVoyage()');

    let newVoyages = [];
    newVoyages.push(this.getVoyages[index]);
    this.GenerateDataByFilter(newVoyages);

    this.summaryBy = 'PORTS';
    this.GenerateDashboardBySumary();

    return false;
  }

  public FilterByActivities() {

    this.GenerateDataByFilter(this.getVoyages);
    this.GenerateDashboardBySumary();
  }

  public ClickSummaryBy(): boolean {

    this.loadingService.Open();

    Promise.resolve(true).then(
      () => {

        this.GenerateDashboardBySumary();

      }
    ).then(
      () => {


        this.loadingService.Close();
      }
    )
    return true;
  }

  public ClearFilter(): boolean {

    this.startDate = null;
    this.endDate = null;

    if (this.activityPerformed && this.activityPerformed.value && this.activityPerformed.value) {
      // Reset filtro.
      this.activityPerformed = new FormControl();
    }

    this.selectVoyageId = 0;
    this.selectVoyage = new Voyage();


    this.summaryBy = 'VOYAGES';

    this.GenerateDataByFilter(this.getVoyages);

    this.GenerateDashboardBySumary();
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

  // Genera la data del viaje con filtro y resumen.
  public GenerateDataByFilter(aRvoyages: Voyage[]) {
    console.log('Generate()');


    this.generateVoyages = JSON.parse(JSON.stringify(aRvoyages));

    // Consumo IFO POR ACTIVIDAD
    this.totalTimePerActivityIFO = new ActivityPerformed();
    this.totalDistanceMilesByActivityPerformedIFO = new ActivityPerformed();

    this.averageSpeedByActivityPerformedIFO = new ActivityPerformed();
    this.averageSpeedCharterByActivityPerformedIFO = new ActivityPerformed(); // (0, 0, 12.5, 12, 12, 0, 0, 0)

    this.voyageConsumptionByActivityPerformedIFO = new ActivityPerformed();
    this.dayliConsumptionByActivityPerformedIFO = new ActivityPerformed();

    this.dayliConsumptionCharterByActivityPerformedIFO = new ActivityPerformed();  // (4.5, 4.5, 30.5, 30.5, 30.5, 4.5, 4.5, 4.5)
    this.timePerNavigationCharterByActivityPerformedIFO = new ActivityPerformed();
    this.voyageConsumptionCharterByActivityPerformedIFO = new ActivityPerformed();

    this.balanceConsumptionByActivityPerformedIFO = new ActivityPerformed();
    this.balanceTimeByActivityPerformedIFO = new ActivityPerformed();


    // CONSUMER MGO

    this.totalTimePerActivityMGO = new ActivityPerformed();
    this.totalDistanceMilesByActivityPerformedMGO = new ActivityPerformed();

    this.averageSpeedByActivityPerformedMGO = new ActivityPerformed();
    this.averageSpeedCharterByActivityPerformedMGO = new ActivityPerformed(); // (0, 0, 12.5, 12, 12, 0, 0, 0)

    this.voyageConsumptionByActivityPerformedMGO = new ActivityPerformed();
    this.dayliConsumptionByActivityPerformedMGO = new ActivityPerformed();

    this.dayliConsumptionCharterByActivityPerformedMGO = new ActivityPerformed();  // (4.5, 4.5, 30.5, 30.5, 30.5, 4.5, 4.5, 4.5)
    this.timePerNavigationCharterByActivityPerformedMGO = new ActivityPerformed();
    this.voyageConsumptionCharterByActivityPerformedMGO = new ActivityPerformed();

    this.balanceConsumptionByActivityPerformedMGO = new ActivityPerformed();
    this.balanceTimeByActivityPerformedMGO = new ActivityPerformed();


    // CONSUMER MGO POR MAUQINA
    this.consumptionTotalMGO = new ConsumptionMachineMGO();
    this.consumptionDaysRealMGO = new ConsumptionMachineMGO();
    this.consumptionDaysByContractMGO = new ConsumptionMachineMGO();
    this.consumptionDailyBalanceMGO = new ConsumptionMachineMGO();

    // CONSUMER MGO POR MAQUINA
    this.consumptionTotalIFO = new ConsumptionMachineIFO();
    this.consumptionDaysRealIFO = new ConsumptionMachineIFO();
    this.consumptionDaysByContractIFO = new ConsumptionMachineIFO(0, 0, 0, 0, 0);
    this.consumptionDailyBalanceIFO = new ConsumptionMachineIFO();


    let generalStartDate: String;
    let generalEndDate: String;

    this.generateVoyages = this.generateVoyages.filter(
      (voyage: Voyage, indexV: number, voyages: any[]) => {

        let totalConsumoViajeIFO = 0;
        let totalConsumoViajeMGO = 0;
        let totalPuertos = 0;
        let dayStartByVoyage: String;
        let dayEndByVoyage: String;

        let totalSpeedViaje: Speed = new Speed();

        // Recorremos los puertos
        voyage.ports = voyage.ports.reverse().filter(
          (port: Port, index, ports) => {

            let totalConsumoByPortIFO = 0;
            let totalConsumoByPortMGO = 0;
            let totalSpeedByPort: Speed = new Speed();
            let dayStartByPort: String;
            let dayEndByPort: String;

            // Filtramos si el estado es true, ademas de filtros.
            if (port.status) {

              // Recorremos los reportes
              port.dailyReports = port.dailyReports.filter(
                (report, index, reports) => {

                  if (report.status) {

                    let totalIFO = this.SumaIfo(report);
                    let totalMGO = this.SumaMgo(report);

                    dayStartByPort = ComparePreviousDates(dayStartByPort, report.date);
                    dayEndByPort = CompareAfterDates(dayEndByPort, report.date);

                    // FILTRO POR ACTIVIDAD
                    if (report.activityPerformed === 'LOADING') {

                      this.totalTimePerActivityIFO.loading += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.loading += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.loading += totalIFO;


                      this.totalTimePerActivityMGO.loading += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.loading += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.loading += totalMGO;

                    } else if (report.activityPerformed === 'DOWNLOADING') {

                      this.totalTimePerActivityIFO.discharge += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.discharge += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.discharge += totalIFO;


                      this.totalTimePerActivityMGO.discharge += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.discharge += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.discharge += totalMGO;

                    } else if (report.activityPerformed === 'SAILING_IN_BALLAST') {

                      this.totalTimePerActivityIFO.ballast += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.ballast += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.ballast += totalIFO;

                      this.totalTimePerActivityMGO.ballast += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.ballast += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.ballast += totalMGO;

                    } else if (report.activityPerformed === 'SAILING_WITH_LADEN') {

                      this.totalTimePerActivityIFO.laden += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.laden += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.laden += totalIFO;


                      this.totalTimePerActivityMGO.laden += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.laden += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.laden += totalMGO;

                    } else if (report.activityPerformed === 'ECONOMICAL_NAVIGATION') {

                      this.totalTimePerActivityIFO.economical += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.economical += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.economical += totalIFO;


                      this.totalTimePerActivityMGO.economical += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.economical += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.economical += totalMGO;

                    } else if (report.activityPerformed === 'ANCHORED') {

                      this.totalTimePerActivityIFO.anchor += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.anchor += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.anchor += totalIFO;


                      this.totalTimePerActivityMGO.anchor += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.anchor += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.anchor += totalMGO;

                    } else if (report.activityPerformed === 'MANEUVER') {

                      this.totalTimePerActivityIFO.maneuver += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.maneuver += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.maneuver += totalIFO;


                      this.totalTimePerActivityMGO.maneuver += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.maneuver += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.maneuver += totalMGO;

                    } else if (report.activityPerformed === 'OTHER_ACT') {

                      this.totalTimePerActivityIFO.otherActivity += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.otherActivity += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.otherActivity += totalIFO;

                      this.totalTimePerActivityMGO.otherActivity += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.otherActivity += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.otherActivity += totalMGO;

                    }

                    if (
                      (!this.activityPerformed.value || this.activityPerformed.value.length === 0) ||
                      this.activityPerformed.value.find(activity => activity === report.activityPerformed)
                    ) {


                      totalConsumoByPortIFO = totalConsumoByPortIFO + totalIFO;
                      totalConsumoByPortMGO = totalConsumoByPortMGO + totalMGO;
                      totalSpeedByPort.add(report.distance, report.steamingTime);
                      totalPuertos = totalPuertos + 1;

                      // Sumamos el consumo MGO
                      this.consumptionTotalMGO.mpal += report.mplaMgo;
                      this.consumptionTotalMGO.aux += report.auxMgo;
                      this.consumptionTotalMGO.boiler += report.boilerMgo;
                      this.consumptionTotalMGO.pp += report.ppMgo;
                      this.consumptionTotalMGO.gi += report.giMgo;
                      this.consumptionTotalMGO.other += report.otherMgo;
                      // FIN Consumo MGO

                      // Sumamos el consumo IFO
                      this.consumptionTotalIFO.mpal += report.mplaIfo;
                      this.consumptionTotalIFO.aux += report.auxIfo;
                      this.consumptionTotalIFO.boiler += report.boilerIfo;
                      this.consumptionTotalIFO.other += report.otherIfo;
                      // FIN Consumo IFO


                    } else {

                      return false;
                    }


                    return true;
                  } else {
                    return false;
                  }

                }
              )

              port.robIfo = totalConsumoByPortIFO;
              port.robMgo = totalConsumoByPortMGO
              port.speed = totalSpeedByPort;

              port.dayStart = dayStartByPort;
              port.dayEnd = dayEndByPort;

              dayStartByVoyage = ComparePreviousDates(dayStartByVoyage, dayStartByPort);
              dayEndByVoyage = CompareAfterDates(dayEndByVoyage, dayEndByPort);

              totalConsumoViajeIFO = totalConsumoViajeIFO + totalConsumoByPortIFO;
              totalConsumoViajeMGO = totalConsumoViajeMGO + totalConsumoByPortMGO;
              totalSpeedViaje.add(totalSpeedByPort.distance, totalSpeedByPort.steamingTime);

              return true;

            } else {
              return false;
            }

          }
        );

        voyage.totalMGO = totalConsumoViajeMGO;
        voyage.totalIFO = totalConsumoViajeIFO;
        voyage.totalSpeed = totalSpeedViaje;
        voyage.totalPort = totalPuertos;
        voyage.dayStart = dayStartByVoyage;
        voyage.dayEnd = dayEndByVoyage;

        generalStartDate = ComparePreviousDates(generalStartDate, voyage.dayStart);
        generalEndDate = CompareAfterDates(generalEndDate, voyage.dayEnd);
        return true;
      });

    let numberDay = DiffDates(generalStartDate, generalEndDate);
    if (!numberDay) numberDay = 1;

    this.consumptionDaysRealMGO.mpal = this.consumptionTotalMGO.mpal / (numberDay || 1);
    this.consumptionDaysRealMGO.aux = this.consumptionTotalMGO.aux / (numberDay || 1);
    this.consumptionDaysRealMGO.boiler = this.consumptionTotalMGO.boiler / (numberDay || 1);
    this.consumptionDaysRealMGO.pp = this.consumptionTotalMGO.pp / (numberDay || 1);
    this.consumptionDaysRealMGO.gi = this.consumptionTotalMGO.gi / (numberDay || 1);
    this.consumptionDaysRealMGO.other = this.consumptionTotalMGO.other / (numberDay || 1);

    this.consumptionDaysByContractMGO.mpal = this.selectUser.consumptionEquipmentME_MGO;
    this.consumptionDaysByContractMGO.aux = this.selectUser.consumptionEquipmentAE_MGO;
    this.consumptionDaysByContractMGO.boiler = this.selectUser.consumptionEquipmentBOILER_MGO;
    this.consumptionDaysByContractMGO.pp = this.selectUser.consumptionEquipmentPP_MGO;
    this.consumptionDaysByContractMGO.gi = this.selectUser.consumptionEquipmentIG_MGO;
    this.consumptionDaysByContractMGO.other = this.selectUser.consumptionEquipmentOther_MGO;
    
    this.consumptionDailyBalanceMGO.mpal = this.consumptionDaysByContractMGO.mpal ? this.consumptionDaysRealMGO.mpal - this.consumptionDaysByContractMGO.mpal : 0;
    this.consumptionDailyBalanceMGO.aux = this.consumptionDaysByContractMGO.aux ? this.consumptionDaysRealMGO.aux - this.consumptionDaysByContractMGO.aux : 0;
    this.consumptionDailyBalanceMGO.boiler = this.consumptionDaysByContractMGO.boiler ? this.consumptionDaysRealMGO.boiler - this.consumptionDaysByContractMGO.boiler : 0;
    this.consumptionDailyBalanceMGO.pp = this.consumptionDaysByContractMGO.pp ? this.consumptionDaysRealMGO.pp - this.consumptionDaysByContractMGO.pp : 0;
    this.consumptionDailyBalanceMGO.gi = this.consumptionDaysByContractMGO.gi ? this.consumptionDaysRealMGO.gi - this.consumptionDaysByContractMGO.gi : 0;
    this.consumptionDailyBalanceMGO.other = this.consumptionDaysByContractMGO.other ? this.consumptionDaysRealMGO.other - this.consumptionDaysByContractMGO.other : 0;

    
    //IFO
    this.consumptionDaysRealIFO.mpal = this.consumptionTotalIFO.mpal / (numberDay || 1);
    this.consumptionDaysRealIFO.aux = this.consumptionTotalIFO.aux / (numberDay || 1);
    this.consumptionDaysRealIFO.boiler = this.consumptionTotalIFO.boiler / (numberDay || 1);
    this.consumptionDaysRealIFO.other = this.consumptionTotalIFO.other / (numberDay || 1);

    this.consumptionDaysByContractIFO.mpal = this.selectUser.consumptionEquipmentME_IFO;
    this.consumptionDaysByContractIFO.aux = this.selectUser.consumptionEquipmentAE_IFO;
    this.consumptionDaysByContractIFO.boiler = this.selectUser.consumptionEquipmentBOILER_IFO;
    this.consumptionDaysByContractIFO.other = this.selectUser.consumptionEquipmentOther_IFO;

    this.consumptionDailyBalanceIFO.mpal = this.consumptionDaysByContractIFO.mpal ? this.consumptionDaysRealIFO.mpal - this.consumptionDaysByContractIFO.mpal : 0;
    this.consumptionDailyBalanceIFO.aux = this.consumptionDaysByContractIFO.aux ? this.consumptionDaysRealIFO.aux - this.consumptionDaysByContractIFO.aux : 0;
    this.consumptionDailyBalanceIFO.boiler = this.consumptionDaysByContractIFO.boiler ? this.consumptionDaysRealIFO.boiler - this.consumptionDaysByContractIFO.boiler : 0;
    this.consumptionDailyBalanceIFO.other = this.consumptionDaysByContractIFO.other ? this.consumptionDaysRealIFO.other - this.consumptionDaysByContractIFO.other : 0;

    // ActivityPerformance IFO
    // calculo de speed
    this.averageSpeedByActivityPerformedIFO.loading = this.totalDistanceMilesByActivityPerformedIFO.loading / (this.totalTimePerActivityIFO.loading || 1);
    this.averageSpeedByActivityPerformedIFO.discharge = this.totalDistanceMilesByActivityPerformedIFO.discharge / (this.totalTimePerActivityIFO.discharge || 1);
    this.averageSpeedByActivityPerformedIFO.ballast = this.totalDistanceMilesByActivityPerformedIFO.ballast / (this.totalTimePerActivityIFO.ballast || 1);
    this.averageSpeedByActivityPerformedIFO.laden = this.totalDistanceMilesByActivityPerformedIFO.laden / (this.totalTimePerActivityIFO.laden || 1);
    this.averageSpeedByActivityPerformedIFO.economical = this.totalDistanceMilesByActivityPerformedIFO.economical / (this.totalTimePerActivityIFO.economical || 1);
    this.averageSpeedByActivityPerformedIFO.anchor = this.totalDistanceMilesByActivityPerformedIFO.anchor / (this.totalTimePerActivityIFO.anchor || 1);
    this.averageSpeedByActivityPerformedIFO.maneuver = this.totalDistanceMilesByActivityPerformedIFO.maneuver / (this.totalTimePerActivityIFO.maneuver || 1);
    this.averageSpeedByActivityPerformedIFO.otherActivity = this.totalDistanceMilesByActivityPerformedIFO.otherActivity / (this.totalTimePerActivityIFO.otherActivity || 1);

    // calculo de speed
    this.averageSpeedCharterByActivityPerformedIFO.loading = 0;
    this.averageSpeedCharterByActivityPerformedIFO.discharge = 0;
    this.averageSpeedCharterByActivityPerformedIFO.ballast = this.selectUser.contractSpeedSailingBallastIFO;
    this.averageSpeedCharterByActivityPerformedIFO.laden = this.selectUser.contractSpeedSailingLadenIFO;
    this.averageSpeedCharterByActivityPerformedIFO.economical = this.selectUser.contractSpeedSailingEconomicalIFO;
    this.averageSpeedCharterByActivityPerformedIFO.anchor = 0;
    this.averageSpeedCharterByActivityPerformedIFO.maneuver = 0;
    this.averageSpeedCharterByActivityPerformedIFO.otherActivity = 0;

    this.dayliConsumptionByActivityPerformedIFO.loading = (this.voyageConsumptionByActivityPerformedIFO.loading * numberDay) / (this.totalTimePerActivityIFO.loading || 1);
    this.dayliConsumptionByActivityPerformedIFO.discharge = (this.voyageConsumptionByActivityPerformedIFO.discharge * numberDay) / (this.totalTimePerActivityIFO.discharge || 1);
    this.dayliConsumptionByActivityPerformedIFO.ballast = (this.voyageConsumptionByActivityPerformedIFO.ballast * numberDay) / (this.totalTimePerActivityIFO.ballast || 1);
    this.dayliConsumptionByActivityPerformedIFO.laden = (this.voyageConsumptionByActivityPerformedIFO.laden * numberDay) / (this.totalTimePerActivityIFO.laden || 1);
    this.dayliConsumptionByActivityPerformedIFO.economical = (this.voyageConsumptionByActivityPerformedIFO.economical * numberDay) / (this.totalTimePerActivityIFO.economical || 1);
    this.dayliConsumptionByActivityPerformedIFO.anchor = (this.voyageConsumptionByActivityPerformedIFO.anchor * numberDay) / (this.totalTimePerActivityIFO.anchor || 1);
    this.dayliConsumptionByActivityPerformedIFO.maneuver = (this.voyageConsumptionByActivityPerformedIFO.maneuver * numberDay) / (this.totalTimePerActivityIFO.maneuver || 1);
    this.dayliConsumptionByActivityPerformedIFO.otherActivity = (this.voyageConsumptionByActivityPerformedIFO.otherActivity * numberDay) / (this.totalTimePerActivityIFO.otherActivity || 1);

    this.dayliConsumptionCharterByActivityPerformedIFO.loading = this.totalDistanceMilesByActivityPerformedIFO.loading / (this.totalTimePerActivityIFO.loading || 1);
    this.dayliConsumptionCharterByActivityPerformedIFO.discharge = this.totalDistanceMilesByActivityPerformedIFO.discharge / (this.totalTimePerActivityIFO.discharge || 1);
    this.dayliConsumptionCharterByActivityPerformedIFO.ballast = this.totalDistanceMilesByActivityPerformedIFO.ballast / (this.totalTimePerActivityIFO.ballast || 1);
    this.dayliConsumptionCharterByActivityPerformedIFO.laden = this.totalDistanceMilesByActivityPerformedIFO.laden / (this.totalTimePerActivityIFO.laden || 1);
    this.dayliConsumptionCharterByActivityPerformedIFO.economical = this.totalDistanceMilesByActivityPerformedIFO.economical / (this.totalTimePerActivityIFO.economical || 1);
    this.dayliConsumptionCharterByActivityPerformedIFO.anchor = this.totalDistanceMilesByActivityPerformedIFO.anchor / (this.totalTimePerActivityIFO.anchor || 1);
    this.dayliConsumptionCharterByActivityPerformedIFO.maneuver = this.totalDistanceMilesByActivityPerformedIFO.maneuver / (this.totalTimePerActivityIFO.maneuver || 1);
    this.dayliConsumptionCharterByActivityPerformedIFO.otherActivity = this.totalDistanceMilesByActivityPerformedIFO.otherActivity / (this.totalTimePerActivityIFO.otherActivity || 1);

    this.timePerNavigationCharterByActivityPerformedIFO.loading = this.totalDistanceMilesByActivityPerformedIFO.loading / (this.averageSpeedCharterByActivityPerformedIFO.loading || 1);
    this.timePerNavigationCharterByActivityPerformedIFO.discharge = this.totalDistanceMilesByActivityPerformedIFO.discharge / (this.averageSpeedCharterByActivityPerformedIFO.discharge || 1);
    this.timePerNavigationCharterByActivityPerformedIFO.ballast = this.totalDistanceMilesByActivityPerformedIFO.ballast / (this.averageSpeedCharterByActivityPerformedIFO.ballast || 1);
    this.timePerNavigationCharterByActivityPerformedIFO.laden = this.totalDistanceMilesByActivityPerformedIFO.laden / (this.averageSpeedCharterByActivityPerformedIFO.laden || 1);
    this.timePerNavigationCharterByActivityPerformedIFO.economical = this.totalDistanceMilesByActivityPerformedIFO.economical / (this.averageSpeedCharterByActivityPerformedIFO.economical || 1);
    this.timePerNavigationCharterByActivityPerformedIFO.anchor = this.totalDistanceMilesByActivityPerformedIFO.anchor / (this.averageSpeedCharterByActivityPerformedIFO.anchor || 1);
    this.timePerNavigationCharterByActivityPerformedIFO.maneuver = this.totalDistanceMilesByActivityPerformedIFO.maneuver / (this.averageSpeedCharterByActivityPerformedIFO.maneuver || 1);
    this.timePerNavigationCharterByActivityPerformedIFO.otherActivity = this.totalDistanceMilesByActivityPerformedIFO.otherActivity / (this.averageSpeedCharterByActivityPerformedIFO.otherActivity || 1);

    this.voyageConsumptionCharterByActivityPerformedIFO.loading = (this.dayliConsumptionCharterByActivityPerformedIFO.loading * (this.timePerNavigationCharterByActivityPerformedIFO.loading ? this.timePerNavigationCharterByActivityPerformedIFO.loading : this.totalTimePerActivityIFO.loading)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedIFO.discharge = (this.dayliConsumptionCharterByActivityPerformedIFO.discharge * (this.timePerNavigationCharterByActivityPerformedIFO.discharge ? this.timePerNavigationCharterByActivityPerformedIFO.discharge : this.totalTimePerActivityIFO.discharge)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedIFO.ballast = (this.dayliConsumptionCharterByActivityPerformedIFO.ballast * (this.timePerNavigationCharterByActivityPerformedIFO.ballast ? this.timePerNavigationCharterByActivityPerformedIFO.ballast : this.totalTimePerActivityIFO.ballast)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedIFO.laden = (this.dayliConsumptionCharterByActivityPerformedIFO.laden * (this.timePerNavigationCharterByActivityPerformedIFO.laden ? this.timePerNavigationCharterByActivityPerformedIFO.laden : this.totalTimePerActivityIFO.laden)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedIFO.economical = (this.dayliConsumptionCharterByActivityPerformedIFO.economical * (this.timePerNavigationCharterByActivityPerformedIFO.economical ? this.timePerNavigationCharterByActivityPerformedIFO.economical : this.totalTimePerActivityIFO.economical)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedIFO.anchor = (this.dayliConsumptionCharterByActivityPerformedIFO.anchor * (this.timePerNavigationCharterByActivityPerformedIFO.anchor ? this.timePerNavigationCharterByActivityPerformedIFO.anchor : this.totalTimePerActivityIFO.anchor)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedIFO.maneuver = (this.dayliConsumptionCharterByActivityPerformedIFO.maneuver * (this.timePerNavigationCharterByActivityPerformedIFO.maneuver ? this.timePerNavigationCharterByActivityPerformedIFO.maneuver : this.totalTimePerActivityIFO.maneuver)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedIFO.otherActivity = (this.dayliConsumptionCharterByActivityPerformedIFO.otherActivity * (this.timePerNavigationCharterByActivityPerformedIFO.otherActivity ? this.timePerNavigationCharterByActivityPerformedIFO.otherActivity : this.totalTimePerActivityIFO.otherActivity)) / numberDay;

    this.balanceConsumptionByActivityPerformedIFO.loading = this.voyageConsumptionCharterByActivityPerformedIFO.loading - this.voyageConsumptionByActivityPerformedIFO.loading;
    this.balanceConsumptionByActivityPerformedIFO.discharge = this.voyageConsumptionCharterByActivityPerformedIFO.discharge - this.voyageConsumptionByActivityPerformedIFO.discharge;
    this.balanceConsumptionByActivityPerformedIFO.ballast = this.voyageConsumptionCharterByActivityPerformedIFO.ballast - this.voyageConsumptionByActivityPerformedIFO.ballast;
    this.balanceConsumptionByActivityPerformedIFO.laden = this.voyageConsumptionCharterByActivityPerformedIFO.laden - this.voyageConsumptionByActivityPerformedIFO.laden;
    this.balanceConsumptionByActivityPerformedIFO.economical = this.voyageConsumptionCharterByActivityPerformedIFO.economical - this.voyageConsumptionByActivityPerformedIFO.economical;
    this.balanceConsumptionByActivityPerformedIFO.anchor = this.voyageConsumptionCharterByActivityPerformedIFO.anchor - this.voyageConsumptionByActivityPerformedIFO.anchor;
    this.balanceConsumptionByActivityPerformedIFO.maneuver = this.voyageConsumptionCharterByActivityPerformedIFO.maneuver - this.voyageConsumptionByActivityPerformedIFO.maneuver;
    this.balanceConsumptionByActivityPerformedIFO.otherActivity = this.voyageConsumptionCharterByActivityPerformedIFO.otherActivity - this.voyageConsumptionByActivityPerformedIFO.otherActivity;

    this.balanceTimeByActivityPerformedIFO.loading = this.timePerNavigationCharterByActivityPerformedIFO.loading - this.totalTimePerActivityIFO.loading;
    this.balanceTimeByActivityPerformedIFO.discharge = this.timePerNavigationCharterByActivityPerformedIFO.discharge - this.totalTimePerActivityIFO.discharge;
    this.balanceTimeByActivityPerformedIFO.ballast = this.timePerNavigationCharterByActivityPerformedIFO.ballast - this.totalTimePerActivityIFO.ballast;
    this.balanceTimeByActivityPerformedIFO.laden = this.timePerNavigationCharterByActivityPerformedIFO.laden - this.totalTimePerActivityIFO.laden;
    this.balanceTimeByActivityPerformedIFO.economical = this.timePerNavigationCharterByActivityPerformedIFO.economical - this.totalTimePerActivityIFO.economical;
    this.balanceTimeByActivityPerformedIFO.anchor = this.timePerNavigationCharterByActivityPerformedIFO.anchor - this.totalTimePerActivityIFO.anchor;
    this.balanceTimeByActivityPerformedIFO.maneuver = this.timePerNavigationCharterByActivityPerformedIFO.maneuver - this.totalTimePerActivityIFO.maneuver;
    this.balanceTimeByActivityPerformedIFO.otherActivity = this.timePerNavigationCharterByActivityPerformedIFO.otherActivity - this.totalTimePerActivityIFO.otherActivity;



    // ActivityPerformance MGO
    // calculo de speed
    this.averageSpeedByActivityPerformedMGO.loading = this.totalDistanceMilesByActivityPerformedMGO.loading / (this.totalTimePerActivityMGO.loading || 1);
    this.averageSpeedByActivityPerformedMGO.discharge = this.totalDistanceMilesByActivityPerformedMGO.discharge / (this.totalTimePerActivityMGO.discharge || 1);
    this.averageSpeedByActivityPerformedMGO.ballast = this.totalDistanceMilesByActivityPerformedMGO.ballast / (this.totalTimePerActivityMGO.ballast || 1);
    this.averageSpeedByActivityPerformedMGO.laden = this.totalDistanceMilesByActivityPerformedMGO.laden / (this.totalTimePerActivityMGO.laden || 1);
    this.averageSpeedByActivityPerformedMGO.economical = this.totalDistanceMilesByActivityPerformedMGO.economical / (this.totalTimePerActivityMGO.economical || 1);
    this.averageSpeedByActivityPerformedMGO.anchor = this.totalDistanceMilesByActivityPerformedMGO.anchor / (this.totalTimePerActivityMGO.anchor || 1);
    this.averageSpeedByActivityPerformedMGO.maneuver = this.totalDistanceMilesByActivityPerformedMGO.maneuver / (this.totalTimePerActivityMGO.maneuver || 1);
    this.averageSpeedByActivityPerformedMGO.otherActivity = this.totalDistanceMilesByActivityPerformedMGO.otherActivity / (this.totalTimePerActivityMGO.otherActivity || 1);

    // calculo de speed
    this.averageSpeedCharterByActivityPerformedMGO.loading = 0;
    this.averageSpeedCharterByActivityPerformedMGO.discharge = 0;
    this.averageSpeedCharterByActivityPerformedMGO.ballast = this.selectUser.contractSpeedSailingBallastMGO;
    this.averageSpeedCharterByActivityPerformedMGO.laden = this.selectUser.contractSpeedSailingLadenMGO;
    this.averageSpeedCharterByActivityPerformedMGO.economical = this.selectUser.contractSpeedSailingEconomicalMGO;
    this.averageSpeedCharterByActivityPerformedMGO.anchor = 0;
    this.averageSpeedCharterByActivityPerformedMGO.maneuver = 0;
    this.averageSpeedCharterByActivityPerformedMGO.otherActivity = 0;

    this.dayliConsumptionByActivityPerformedMGO.loading = (this.voyageConsumptionByActivityPerformedMGO.loading * numberDay) / (this.totalTimePerActivityMGO.loading || 1);
    this.dayliConsumptionByActivityPerformedMGO.discharge = (this.voyageConsumptionByActivityPerformedMGO.discharge * numberDay) / (this.totalTimePerActivityMGO.discharge || 1);
    this.dayliConsumptionByActivityPerformedMGO.ballast = (this.voyageConsumptionByActivityPerformedMGO.ballast * numberDay) / (this.totalTimePerActivityMGO.ballast || 1);
    this.dayliConsumptionByActivityPerformedMGO.laden = (this.voyageConsumptionByActivityPerformedMGO.laden * numberDay) / (this.totalTimePerActivityMGO.laden || 1);
    this.dayliConsumptionByActivityPerformedMGO.economical = (this.voyageConsumptionByActivityPerformedMGO.economical * numberDay) / (this.totalTimePerActivityMGO.economical || 1);
    this.dayliConsumptionByActivityPerformedMGO.anchor = (this.voyageConsumptionByActivityPerformedMGO.anchor * numberDay) / (this.totalTimePerActivityMGO.anchor || 1);
    this.dayliConsumptionByActivityPerformedMGO.maneuver = (this.voyageConsumptionByActivityPerformedMGO.maneuver * numberDay) / (this.totalTimePerActivityMGO.maneuver || 1);
    this.dayliConsumptionByActivityPerformedMGO.otherActivity = (this.voyageConsumptionByActivityPerformedMGO.otherActivity * numberDay) / (this.totalTimePerActivityMGO.otherActivity || 1);

    this.dayliConsumptionCharterByActivityPerformedMGO.loading = this.totalDistanceMilesByActivityPerformedMGO.loading / (this.totalTimePerActivityMGO.loading || 1);
    this.dayliConsumptionCharterByActivityPerformedMGO.discharge = this.totalDistanceMilesByActivityPerformedMGO.discharge / (this.totalTimePerActivityMGO.discharge || 1);
    this.dayliConsumptionCharterByActivityPerformedMGO.ballast = this.totalDistanceMilesByActivityPerformedMGO.ballast / (this.totalTimePerActivityMGO.ballast || 1);
    this.dayliConsumptionCharterByActivityPerformedMGO.laden = this.totalDistanceMilesByActivityPerformedMGO.laden / (this.totalTimePerActivityMGO.laden || 1);
    this.dayliConsumptionCharterByActivityPerformedMGO.economical = this.totalDistanceMilesByActivityPerformedMGO.economical / (this.totalTimePerActivityMGO.economical || 1);
    this.dayliConsumptionCharterByActivityPerformedMGO.anchor = this.totalDistanceMilesByActivityPerformedMGO.anchor / (this.totalTimePerActivityMGO.anchor || 1);
    this.dayliConsumptionCharterByActivityPerformedMGO.maneuver = this.totalDistanceMilesByActivityPerformedMGO.maneuver / (this.totalTimePerActivityMGO.maneuver || 1);
    this.dayliConsumptionCharterByActivityPerformedMGO.otherActivity = this.totalDistanceMilesByActivityPerformedMGO.otherActivity / (this.totalTimePerActivityMGO.otherActivity || 1);

    this.timePerNavigationCharterByActivityPerformedMGO.loading = this.totalDistanceMilesByActivityPerformedMGO.loading / (this.averageSpeedCharterByActivityPerformedMGO.loading || 1);
    this.timePerNavigationCharterByActivityPerformedMGO.discharge = this.totalDistanceMilesByActivityPerformedMGO.discharge / (this.averageSpeedCharterByActivityPerformedMGO.discharge || 1);
    this.timePerNavigationCharterByActivityPerformedMGO.ballast = this.totalDistanceMilesByActivityPerformedMGO.ballast / (this.averageSpeedCharterByActivityPerformedMGO.ballast || 1);
    this.timePerNavigationCharterByActivityPerformedMGO.laden = this.totalDistanceMilesByActivityPerformedMGO.laden / (this.averageSpeedCharterByActivityPerformedMGO.laden || 1);
    this.timePerNavigationCharterByActivityPerformedMGO.economical = this.totalDistanceMilesByActivityPerformedMGO.economical / (this.averageSpeedCharterByActivityPerformedMGO.economical || 1);
    this.timePerNavigationCharterByActivityPerformedMGO.anchor = this.totalDistanceMilesByActivityPerformedMGO.anchor / (this.averageSpeedCharterByActivityPerformedMGO.anchor || 1);
    this.timePerNavigationCharterByActivityPerformedMGO.maneuver = this.totalDistanceMilesByActivityPerformedMGO.maneuver / (this.averageSpeedCharterByActivityPerformedMGO.maneuver || 1);
    this.timePerNavigationCharterByActivityPerformedMGO.otherActivity = this.totalDistanceMilesByActivityPerformedMGO.otherActivity / (this.averageSpeedCharterByActivityPerformedMGO.otherActivity || 1);

    this.voyageConsumptionCharterByActivityPerformedMGO.loading = (this.dayliConsumptionCharterByActivityPerformedMGO.loading * (this.timePerNavigationCharterByActivityPerformedMGO.loading ? this.timePerNavigationCharterByActivityPerformedMGO.loading : this.totalTimePerActivityMGO.loading)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedMGO.discharge = (this.dayliConsumptionCharterByActivityPerformedMGO.discharge * (this.timePerNavigationCharterByActivityPerformedMGO.discharge ? this.timePerNavigationCharterByActivityPerformedMGO.discharge : this.totalTimePerActivityMGO.discharge)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedMGO.ballast = (this.dayliConsumptionCharterByActivityPerformedMGO.ballast * (this.timePerNavigationCharterByActivityPerformedMGO.ballast ? this.timePerNavigationCharterByActivityPerformedMGO.ballast : this.totalTimePerActivityMGO.ballast)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedMGO.laden = (this.dayliConsumptionCharterByActivityPerformedMGO.laden * (this.timePerNavigationCharterByActivityPerformedMGO.laden ? this.timePerNavigationCharterByActivityPerformedMGO.laden : this.totalTimePerActivityMGO.laden)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedMGO.economical = (this.dayliConsumptionCharterByActivityPerformedMGO.economical * (this.timePerNavigationCharterByActivityPerformedMGO.economical ? this.timePerNavigationCharterByActivityPerformedMGO.economical : this.totalTimePerActivityMGO.economical)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedMGO.anchor = (this.dayliConsumptionCharterByActivityPerformedMGO.anchor * (this.timePerNavigationCharterByActivityPerformedMGO.anchor ? this.timePerNavigationCharterByActivityPerformedMGO.anchor : this.totalTimePerActivityMGO.anchor)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedMGO.maneuver = (this.dayliConsumptionCharterByActivityPerformedMGO.maneuver * (this.timePerNavigationCharterByActivityPerformedMGO.maneuver ? this.timePerNavigationCharterByActivityPerformedMGO.maneuver : this.totalTimePerActivityMGO.maneuver)) / numberDay;
    this.voyageConsumptionCharterByActivityPerformedMGO.otherActivity = (this.dayliConsumptionCharterByActivityPerformedMGO.otherActivity * (this.timePerNavigationCharterByActivityPerformedMGO.otherActivity ? this.timePerNavigationCharterByActivityPerformedMGO.otherActivity : this.totalTimePerActivityMGO.otherActivity)) / numberDay;

    this.balanceConsumptionByActivityPerformedMGO.loading = this.voyageConsumptionCharterByActivityPerformedMGO.loading - this.voyageConsumptionByActivityPerformedMGO.loading;
    this.balanceConsumptionByActivityPerformedMGO.discharge = this.voyageConsumptionCharterByActivityPerformedMGO.discharge - this.voyageConsumptionByActivityPerformedMGO.discharge;
    this.balanceConsumptionByActivityPerformedMGO.ballast = this.voyageConsumptionCharterByActivityPerformedMGO.ballast - this.voyageConsumptionByActivityPerformedMGO.ballast;
    this.balanceConsumptionByActivityPerformedMGO.laden = this.voyageConsumptionCharterByActivityPerformedMGO.laden - this.voyageConsumptionByActivityPerformedMGO.laden;
    this.balanceConsumptionByActivityPerformedMGO.economical = this.voyageConsumptionCharterByActivityPerformedMGO.economical - this.voyageConsumptionByActivityPerformedMGO.economical;
    this.balanceConsumptionByActivityPerformedMGO.anchor = this.voyageConsumptionCharterByActivityPerformedMGO.anchor - this.voyageConsumptionByActivityPerformedMGO.anchor;
    this.balanceConsumptionByActivityPerformedMGO.maneuver = this.voyageConsumptionCharterByActivityPerformedMGO.maneuver - this.voyageConsumptionByActivityPerformedMGO.maneuver;
    this.balanceConsumptionByActivityPerformedMGO.otherActivity = this.voyageConsumptionCharterByActivityPerformedMGO.otherActivity - this.voyageConsumptionByActivityPerformedMGO.otherActivity;

    this.balanceTimeByActivityPerformedMGO.loading = this.timePerNavigationCharterByActivityPerformedMGO.loading - this.totalTimePerActivityMGO.loading;
    this.balanceTimeByActivityPerformedMGO.discharge = this.timePerNavigationCharterByActivityPerformedMGO.discharge - this.totalTimePerActivityMGO.discharge;
    this.balanceTimeByActivityPerformedMGO.ballast = this.timePerNavigationCharterByActivityPerformedMGO.ballast - this.totalTimePerActivityMGO.ballast;
    this.balanceTimeByActivityPerformedMGO.laden = this.timePerNavigationCharterByActivityPerformedMGO.laden - this.totalTimePerActivityMGO.laden;
    this.balanceTimeByActivityPerformedMGO.economical = this.timePerNavigationCharterByActivityPerformedMGO.economical - this.totalTimePerActivityMGO.economical;
    this.balanceTimeByActivityPerformedMGO.anchor = this.timePerNavigationCharterByActivityPerformedMGO.anchor - this.totalTimePerActivityMGO.anchor;
    this.balanceTimeByActivityPerformedMGO.maneuver = this.timePerNavigationCharterByActivityPerformedMGO.maneuver - this.totalTimePerActivityMGO.maneuver;
    this.balanceTimeByActivityPerformedMGO.otherActivity = this.timePerNavigationCharterByActivityPerformedMGO.otherActivity - this.totalTimePerActivityMGO.otherActivity;


    console.log(' FIN Generate()');

  }

  // Configuracaion Axes si son menos de 60 registro que muestre los dias caso contrario que muestre los meses
  public ConfigScales(dataReport: Date[], isSpeed?: boolean, lineaMax?: number) {
    let config: any = {};

    if (this.summaryBy === 'VOYAGES') {

      config = {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
            max: lineaMax,
          },
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
          },
          type: 'category',
          position: 'bottom',
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
        }]
      };

    } else if (this.summaryBy === 'PORTS') {

      config = {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
            max: lineaMax,
          },
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
          },
          type: 'category',
          position: 'bottom',
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
        }]
      };

    } else if (this.summaryBy === 'MONTHS') {

      config = {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
            max: lineaMax,
          },
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
        }],
        xAxes: [{
          type: 'time',
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
          },
          time: {
            displayFormats: {
              day: 'MM/YY'
            },
            tooltipFormat: 'MM/DD/YY',
            unit: 'month',
          },
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
        }]
      };

    } else if (this.summaryBy === 'DAYS') {

      config = {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
            max: lineaMax,
          },
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
        }],
        xAxes: [{
          type: 'time',
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
          },
          time:
          {
            displayFormats: {
              day: 'MM/DD'
            },
            tooltipFormat: 'MM/DD',
            unit: 'day',
          },
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
        }]
      };

    } else {

      /*   config = {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: '#b8d1ff',
            },
            gridLines: {
              display: true,
              color: '#b8d1ff'
            },
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: '#b8d1ff',
            },
            type: 'time',
            position: 'bottom',
            time: {
              displayFormats: {
                day: 'MM/DD'
              },
              tooltipFormat: 'MM/DD',
              unit: 'day',
            },
            gridLines: {
              display: true,
              color: '#b8d1ff'
            },
          }]
        };
  
  
        if (isSpeed) {
  
          if (lineaMax > 0) {
            config.yAxes = [{
              ticks: {
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                max: lineaMax,
                fontColor: '#b8d1ff',
              },
              gridLines: {
                display: true,
                color: '#b8d1ff'
              },
            }];
  
          }
        }
  
        // Segun la cantidad de datos, estara personalizada.
        if (dataReport.length < 60) {
  
          config.xAxes[0].time = {
            displayFormats: {
              day: 'MM/DD'
            },
            tooltipFormat: 'MM/DD',
            unit: 'day',
          };
  
        } else {
  
          config.xAxes[0].time = {
            displayFormats: {
              day: 'MM/YY'
            },
            tooltipFormat: 'MM/DD/YY',
            unit: 'month',
          };
  
        } */

    }

    return config;
  }

  public GenerateDashboardBySumary() {

    let filter = this.summaryBy;

    if (filter === 'VOYAGES') {
      this.GenerateDashBoardByVoyages();
    } else if (filter === 'PORTS') {
      this.GenerateDashBoardByPorts();
    } else if (filter === 'MONTHS') {
      this.GenerateDashBoardByMonths();
    } else if (filter === 'DAYS') {
      this.GenerateDashBoardByDays();
    }

    // Actualizamos los cuadros del dashboard.
    this.UpdateLineIFO();
    this.UpdateLineMGO();
    this.UpdateLineSPEED();

  }

  // Generar data para el dashboard desde el arreglo de reportes
  public GenerateDashBoardByVoyages() {

    this.xLabelReport = [];
    this.dataIFO = [];
    this.dataMGO = [];
    this.dataSPEED = [];


    let startDate;
    let endDate;
    this.generateVoyages.forEach(
      (voyage, iv) => {

        let txtX = 'V' + voyage.voyageNumber + ' Y' + ('' + voyage.year).slice(-2);
        this.xLabelReport.push(txtX);

        this.dataIFO.push(
          { x: txtX, y: voyage.totalIFO, ubication: [iv] }
        );
        this.dataMGO.push(
          { x: txtX, y: voyage.totalMGO, ubication: [iv] }
        );

        let speed = mathRound(voyage.totalSpeed.distance / voyage.totalSpeed.steamingTime, 2);
        this.dataSPEED.push(
          { x: txtX, y: speed, ubication: [iv] }
        );

        if (voyage.totalIFO > this.configLineaIFO.lineaMax) {
          this.configLineaIFO.lineaMax = voyage.totalIFO;
        }
        if (voyage.totalMGO > this.configLineaMGO.lineaMax) {
          this.configLineaMGO.lineaMax = voyage.totalMGO;
        }

        if (speed > this.configLineaSPEED.lineaMax) {
          this.configLineaSPEED.lineaMax = speed;
        }


        startDate = ComparePreviousDates(startDate, voyage.dayStart)
        endDate = CompareAfterDates(endDate, voyage.dayEnd)

      }

    );


    this.startDate = startDate;
    this.endDate = endDate;

  }
  // Generar data para el dashboard desde el arreglo de reportes
  public GenerateDashBoardByPorts() {

    this.xLabelReport = [];
    this.dataIFO = [];
    this.dataMGO = [];
    this.dataSPEED = [];

    let startDate;
    let endDate;

    this.generateVoyages.forEach(
      (voyage: Voyage, iV) => {

        voyage.ports.forEach(
          (port, iP) => {
            let txtX = 'V' + voyage.voyageNumber + ' ' + 'P' + port.portNumber + ' Y' + ('' + voyage.year).slice(-2);

            this.xLabelReport.push(txtX);
            this.dataIFO.push(
              { x: txtX, y: port.robIfo, ubication: [iV, iP] }
            );
            this.dataMGO.push(
              { x: txtX, y: port.robMgo, ubication: [iV, iP] }
            );

            let speed = mathRound(port.speed.distance / port.speed.steamingTime, 2);
            this.dataSPEED.push(
              { x: txtX, y: speed, ubication: [iV, iP] }
            );


            if (port.robIfo > this.configLineaIFO.lineaMax) {
              this.configLineaIFO.lineaMax = port.robIfo;
            }
            if (port.robMgo > this.configLineaMGO.lineaMax) {
              this.configLineaMGO.lineaMax = port.robMgo;
            }

            if (speed > this.configLineaSPEED.lineaMax) {
              this.configLineaSPEED.lineaMax = speed;
            }

            startDate = ComparePreviousDates(startDate, port.dayStart)
            endDate = CompareAfterDates(endDate, port.dayEnd)
          }
        )



      }

    );

    this.startDate = startDate;
    this.endDate = endDate;

  }

  public GenerateDashBoardByMonths() {

    this.xLabelReport = [];
    this.dataIFO = [];
    this.dataMGO = [];
    this.dataSPEED = [];

    let startDate;
    let endDate;

    this.generateVoyages.forEach(
      (voyage, iV) => {

        voyage.ports.forEach(
          (port, iP) => {

            port.dailyReports.forEach(
              (report, iR) => {

                let day = report.date;


                let resultSearch = this.xLabelReport.find(
                  (xDay, iL) => {

                    // Verificamos la fecha actual.

                    if (GetMonthYearFromDate(day) === GetMonthYearFromDate(xDay)) {
                      this.dataIFO[iL].x = day;
                      this.dataMGO[iL].x = day;
                      this.dataSPEED[iL].x = day;


                      let speedI: Speed = this.dataSPEED[iL].speed;
                      speedI.add(report.distance, report.steamingTime);

                      this.dataIFO[iL].speed = speedI;
                      this.dataMGO[iL].speed = speedI;
                      this.dataSPEED[iL].speed = speedI;

                      // Actualizamos el vlaor por la posicion.
                      this.dataIFO[iL].y = this.dataIFO[iL].y + this.SumaIfo(report)
                      this.dataMGO[iL].y = this.dataMGO[iL].y + this.SumaMgo(report)

                      let ySpeed = mathRound(speedI.distance / speedI.steamingTime, 2)
                      this.dataSPEED[iL].y = ySpeed;



                      if (this.dataIFO[iL].y > this.configLineaIFO.lineaMax) {
                        this.configLineaIFO.lineaMax = this.dataIFO[iL].y;
                      }
                      if (this.dataMGO[iL].y > this.configLineaMGO.lineaMax) {
                        this.configLineaMGO.lineaMax = this.dataMGO[iL].y;
                      }
                      if (ySpeed > this.configLineaSPEED.lineaMax) {
                        this.configLineaSPEED.lineaMax = ySpeed;
                      }


                      startDate = ComparePreviousDates(startDate, report.date)
                      endDate = CompareAfterDates(endDate, report.date)


                      return true;
                    }

                    return false;
                  }

                );


                if (!resultSearch) {

                  // console.log('GenerateDataForDashboard()');

                  // agregamos la fecha a nuestro arreglo.
                  this.xLabelReport.push(day);

                  let newSpeed = new Speed(report.distance, report.steamingTime);
                  this.dataIFO.push(
                    { x: day, y: this.SumaIfo(report), speed: newSpeed }
                  );

                  this.dataMGO.push(
                    { x: day, y: this.SumaMgo(report), speed: newSpeed }
                  );

                  let ySpeed = mathRound(newSpeed.distance / newSpeed.steamingTime, 2)
                  this.dataSPEED.push(
                    { x: day, y: ySpeed, speed: newSpeed }
                  );



                  if (this.SumaIfo(report) > this.configLineaIFO.lineaMax) {
                    this.configLineaIFO.lineaMax = this.SumaIfo(report);
                  }
                  if (this.SumaMgo(report) > this.configLineaMGO.lineaMax) {
                    this.configLineaMGO.lineaMax = this.SumaMgo(report);
                  }

                  if (ySpeed > this.configLineaSPEED.lineaMax) {
                    this.configLineaSPEED.lineaMax = ySpeed;
                  }



                  startDate = ComparePreviousDates(startDate, report.date)
                  endDate = CompareAfterDates(endDate, report.date)

                }



              }
            );

          }
        )



      }

    );


    this.startDate = startDate;
    this.endDate = endDate;

  }

  public GenerateDashBoardByDays() {

    this.xLabelReport = [];
    this.dataIFO = [];
    this.dataMGO = [];
    this.dataSPEED = [];

    let startDate;
    let endDate;

    this.generateVoyages.forEach(
      (voyage, iV) => {

        voyage.ports.forEach(
          (port, iP) => {

            port.dailyReports.forEach(
              (report, iR) => {
                let day = report.date;


                let resultSearch = this.xLabelReport.find(
                  (xDay, iL) => {

                    // Verificamos la fecha actual.

                    if (FormatDate(day) === FormatDate(xDay)) {

                      let speedI: Speed = this.dataSPEED[iL].speed;
                      speedI.add(report.distance, report.steamingTime);

                      this.dataIFO[iL].speed = speedI;
                      this.dataMGO[iL].speed = speedI;
                      this.dataSPEED[iL].speed = speedI;

                      // Actualizamos el vlaor por la posicion.
                      this.dataIFO[iL].y = this.dataIFO[iL].y + this.SumaIfo(report)
                      this.dataMGO[iL].y = this.dataMGO[iL].y + this.SumaMgo(report)
                      let ySpeed = mathRound(speedI.distance / speedI.steamingTime, 2)
                      this.dataSPEED[iL].y = ySpeed;



                      let dataExtra = this.dataIFO[iL].dataExtra;
                      dataExtra.push(report);

                      this.dataIFO[iL].dataExtra = dataExtra;
                      this.dataMGO[iL].dataExtra = dataExtra;
                      this.dataSPEED[iL].dataExtra = dataExtra;

                      if (this.dataIFO[iL].y > this.configLineaIFO.lineaMax) {
                        this.configLineaIFO.lineaMax = this.dataIFO[iL].y;
                      }
                      if (this.dataMGO[iL].y > this.configLineaMGO.lineaMax) {
                        this.configLineaMGO.lineaMax = this.dataMGO[iL].y;
                      }
                      if (ySpeed > this.configLineaSPEED.lineaMax) {
                        this.configLineaSPEED.lineaMax = ySpeed;
                      }


                      startDate = ComparePreviousDates(startDate, report.date)
                      endDate = CompareAfterDates(endDate, report.date)


                      return true;
                    }

                    return false;
                  }

                );


                if (!resultSearch) {

                  // console.log('GenerateDataForDashboard()');

                  // agregamos la fecha a nuestro arreglo.
                  this.xLabelReport.push(day);

                  let newSpeed = new Speed(report.distance, report.steamingTime);
                  let dataExtra = [];

                  dataExtra.push(report)

                  this.dataIFO.push(
                    { x: day, y: this.SumaIfo(report), speed: newSpeed, dataExtra: dataExtra }
                  );
                  this.dataMGO.push(
                    { x: day, y: this.SumaMgo(report), speed: newSpeed, dataExtra: dataExtra }
                  );
                  let ySpeed = mathRound(newSpeed.distance / newSpeed.steamingTime, 2)
                  this.dataSPEED.push(
                    { x: day, y: ySpeed, speed: newSpeed, dataExtra: dataExtra }
                  );

                  if (this.SumaIfo(report) > this.configLineaIFO.lineaMax) {
                    this.configLineaIFO.lineaMax = this.SumaIfo(report);
                  }
                  if (this.SumaMgo(report) > this.configLineaMGO.lineaMax) {
                    this.configLineaMGO.lineaMax = this.SumaMgo(report);
                  }
                  if (ySpeed > this.configLineaSPEED.lineaMax) {
                    this.configLineaSPEED.lineaMax = ySpeed;
                  }

                  startDate = ComparePreviousDates(startDate, report.date)
                  endDate = CompareAfterDates(endDate, report.date)

                }


              }
            );

          }
        )



      }

    );

    this.startDate = startDate;
    this.endDate = endDate;

  }


  // Generar linea en los canvas.
  public GenetareLineIFO(): boolean {
    // Test
    console.log('GenetareLineIFO()');

    console.log(this.xLabelReport);

    this.configLineaIFO = {
      type: 'line',
      data: {
        labels: this.xLabelReport,
        datasets: [{
          label: this.languageService.GetMessage(this.translateCategory, 'TITLE_COMSUMPTION_IFO'),
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: this.dataIFO,
          fill: false,
        }]
      },
      options: {
        onClick: (event, legendItem) => {

          if (legendItem && legendItem.length) {
            let index = legendItem[0]._index;

            if (this.summaryBy === 'VOYAGES') {

              let ubication = this.dataIFO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]

              this.selectVoyageId = voyage.id;

              let newVoyage = [];
              newVoyage.push(voyage);

              this.generateVoyages = newVoyage;
              this.summaryBy = 'PORTS'
              this.GenerateDataByFilter(newVoyage);

              this.GenerateDashboardBySumary()
            } else if (this.summaryBy === 'PORTS') {

              let ubication = this.dataIFO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]
              let port = this.generateVoyages[ubication[0]].ports[ubication[1]]

              let newVoyage = [voyage];
              newVoyage[0].ports = [port];

              this.generateVoyages = newVoyage;
              this.summaryBy = 'DAYS'
              this.GenerateDataByFilter(newVoyage);

              this.GenerateDashboardBySumary()
            }
          }
        },
        legend: {
          display: true,
          onClick: (event, legendItem) => {
            console.log('onClick:' + legendItem.text);
          },
          labels: {
            fontColor: 'rgb(255,255,255)',
            fontStyle: 'bold',
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {

          // Establece qué elementos aparecen en la información sobre herramientas.
          mode: 'nearest',
          // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
          intersect: false,
          callbacks: {
            title: (tooltipItem, data) => {
              return tooltipItem[0].xLabel;
            },
            label: (tooltipItem, data) => {
              return 'Consumption LSFO: ' + tooltipItem.value;
            },
            footer: (tooltipItem, data) => {
              let index = tooltipItem[0].index;
              let reportDetail: Voyage[] = data.datasets[0].reportDetail;


              return [
                'Voyage N° : ' + reportDetail[index].voyageNumber,
                'Consume :' + reportDetail[index].totalIFO,
              ];

            },
          },

        },
        scales: null,

      },
      lineaMax: 0
    };

    this.configLineaIFO.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaIFO.lineaMax, 0) + 2);



    let canvaLineIFO: any = document.getElementById('lineIFO');
    let ctxLineIFO = canvaLineIFO.getContext('2d');

    this.chartLineIFO = new Chart(ctxLineIFO, this.configLineaIFO);

    console.log('FIN GenetareLineIFO()');

    return false;
  }

  public GenetareLineMGO(): boolean {
    console.log('GenetareLineMGO()');


    this.configLineaMGO = {
      type: 'line',
      data: {
        labels: this.xLabelReport,
        datasets: [{
          label: this.languageService.GetMessage(this.translateCategory, 'TITLE_COMSUMPTION_MGO'),
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: this.dataMGO,
          fill: false,
        }]
      },
      options: {
        onClick: (event, legendItem) => {

          if (legendItem && legendItem.length) {
            let index = legendItem[0]._index;

            if (this.summaryBy === 'VOYAGES') {

              let ubication = this.dataMGO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]

              this.selectVoyageId = voyage.id;

              let newVoyage = [];
              newVoyage.push(voyage);

              this.generateVoyages = newVoyage;
              this.summaryBy = 'PORTS'
              this.GenerateDataByFilter(newVoyage);

              this.GenerateDashboardBySumary()
            } else if (this.summaryBy === 'PORTS') {

              let ubication = this.dataMGO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]
              let port = this.generateVoyages[ubication[0]].ports[ubication[1]]

              let newVoyage = [voyage];
              newVoyage[0].ports = [port];

              this.generateVoyages = newVoyage;
              this.summaryBy = 'DAYS'
              this.GenerateDataByFilter(newVoyage);

              this.GenerateDashboardBySumary()
            }
          }
        },
        lines: [
          /*  {
             type: 'horizontal',
             y: 13,
             color: 'red',
             label: 'max'
           },
           {
             type: 'horizontal',
             y: 11,
             color: '#343D46',
             label: 'min'
           } */
        ],
        legend: {
          display: true,
          labels: {
            fontColor: 'rgb(255,255,255)',
            fontStyle: 'bold',
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {
          // Establece qué elementos aparecen en la información sobre herramientas.
          mode: 'nearest',
          // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
          intersect: false,
          callbacks: {
            title: (tooltipItem, data) => {
              console.log('---------------');
              console.log(tooltipItem);
              console.log(data);
              console.log('---------------');
              return tooltipItem[0].xLabel;
            },
            /*             labelColor: (tooltipItem, data) => {
                          return {
                            borderColor: 'red',
                            backgroundColor: 'blue',
                          };
                        }, */
            afterBody: (tooltipItem, data) => {
              let index = tooltipItem[0].index;

              let reportDetail: Voyage[] = data.datasets[0].reportDetail;

              return [];

            },
            footer: (tooltipItem, data) => {
              let index = tooltipItem[0].index;
              let reportDetail: Voyage[] = data.datasets[0].reportDetail;

              let resultado = '';


              return [
                'Voyage N° : ' + reportDetail[index].voyageNumber,
                'Consume :' + reportDetail[index].totalMGO,
              ];

            },
          }

        },
        scales: null,
      },
      lineaMax: 0
    };

    this.configLineaMGO.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaMGO.lineaMax, 0) + 2);

    let canvaLineMGO: any = document.getElementById('lineMGO');
    let ctxLineMGO = canvaLineMGO.getContext('2d');

    this.chartLineMGO = new Chart(ctxLineMGO, this.configLineaMGO);


    return false;
  }

  public GenetareLineSPEED(): boolean {
    // Test
    console.log('GenetareLineSPEED()');

    this.configLineaSPEED = {
      type: 'line',
      data: {
        labels: this.xLabelReport,
        datasets: [{
          label: 'AVERAGE SPEED',
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: this.dataSPEED,
          fill: false,
        }],
        moreData: [['ROBIFO', 'MPL']]
      },

      options: {
        onClick: (event, legendItem) => {

          if (legendItem && legendItem.length) {
            let index = legendItem[0]._index;

            if (this.summaryBy === 'VOYAGES') {

              let ubication = this.dataSPEED[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]

              this.selectVoyageId = voyage.id;

              let newVoyage = [];
              newVoyage.push(voyage);

              this.generateVoyages = newVoyage;
              this.summaryBy = 'PORTS'
              this.GenerateDataByFilter(newVoyage);

              this.GenerateDashboardBySumary()
            } else if (this.summaryBy === 'PORTS') {

              let ubication = this.dataMGO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]
              let port = this.generateVoyages[ubication[0]].ports[ubication[1]]

              let newVoyage = [voyage];
              newVoyage[0].ports = [port];

              this.generateVoyages = newVoyage;
              this.summaryBy = 'DAYS'
              this.GenerateDataByFilter(newVoyage);

              this.GenerateDashboardBySumary()
            }
          }
        },
        lines: [
          /*     {
                type: 'horizontal',
                y: 8,
                color: 'green',
                label: 'avg'
              } */
        ],
        legend: {
          display: true,
          onClick: (event, legendItem) => {
            console.log('onClick:' + legendItem.text);
          },
          labels: {
            fontColor: 'rgb(255,255,255)',
            fontStyle: 'bold',
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {
          // Establece qué elementos aparecen en la información sobre herramientas.
          mode: 'nearest',
          // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
          intersect: false,


          callbacks: {
            title: (tooltipItem, data) => {
              console.log('---------------');
              console.log(tooltipItem);
              console.log(data);
              console.log('---------------');
              return tooltipItem[0].xLabel;
            },
            label: (tooltipItem, data) => {
              return '';
            },
            labelColor: (tooltipItem, data) => {
              return {
                borderColor: 'red',
                backgroundColor: 'blue',
              };
            },
            afterBody: (tooltipItem, data) => {
              let index = tooltipItem[0].index;

              let reportDetail: Voyage[] = data.datasets[0].reportDetail;

              let resultado = '';

              /*
              return [
                'Departure : ' + reportDetail[index].departurePort,
                'Time : ' + reportDetail[index].duration.numero,
                'Activity : ' + reportDetail[index].activityPerformed,
                'Comentario : ' + resultado,
              ]; */

              let voyage = reportDetail[index];
              return [
                'Speed: ' + mathRound(voyage.totalSpeed.distance / voyage.totalSpeed.steamingTime, 1),
                'Distance : ' + mathRound(voyage.totalSpeed.distance, 1),
                'Time : ' + mathRound(voyage.totalSpeed.steamingTime, 1)
              ];
            },
            footer: (tooltipItem, data) => {

              return [];

            },
          },

        },
        scales: null,
      },
      lineaMax: 0
    };
    this.configLineaSPEED.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaSPEED.lineaMax, 0) + 2);

    let canvaLineSPEED: any = document.getElementById('lineSPEED');
    let ctxLineSPEED: any = canvaLineSPEED.getContext('2d');

    this.chartLineSPEED = new Chart(ctxLineSPEED, this.configLineaSPEED);

    return false;
  }


  public UpdateLineMGO(): boolean {

    // Test
    console.log('UpdateLineMGO');

    // Actualizamos los labels
    this.configLineaMGO.data.labels = this.xLabelReport;
    this.configLineaMGO.data.datasets[0].data = this.dataMGO;

    // Vaciamos la configuracion de las lines MGO
    this.configLineaMGO.options.lines = [];

    if (this.selectUser.isConsumptionMGO) {

      if (this.selectUser.maxMGOConsumption > 0) {
        this.configLineaMGO.options.lines.push({
          type: 'horizontal',
          y: this.selectUser.maxMGOConsumption,
          color: 'red',
          label: ''
        });

      }
    }


    this.configLineaMGO.options.tooltips = {

      // Establece qué elementos aparecen en la información sobre herramientas.
      mode: 'nearest',
      // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
      intersect: false,
      callbacks: {
        title: (tooltipItem, data) => {

          let result = tooltipItem[0].xLabel;
          if (this.summaryBy === 'MONTHS') {

            result = TextMonthYear(result);
          }
          if (this.summaryBy === 'DAYS') {
            result = TextMonthDayYear(result)
          }

          return result;
        },
        label: (tooltipItem, data) => {

          let typeConsumption = this.selectUser.isConsumptionMGO ? 'MGO' : 'MGO';

          let result = 'Consumption ' + typeConsumption + ' : ' + tooltipItem.value;

          return result;
        },
        footer: (tooltipItem, data) => {
          let index = tooltipItem[0].index;

          let result = [];
          if (this.summaryBy === 'VOYAGES') {

            let ubication = data.datasets[0].data[index].ubication;

            let voyage = this.generateVoyages[ubication[0]];
            result = [
              'T. Ports : ' + voyage.totalPort,
              'Distance : ' + voyage.totalSpeed.distance,
              'Time : ' + voyage.totalSpeed.steamingTime,
              'Speed : ' + mathRound(voyage.totalSpeed.distance / voyage.totalSpeed.steamingTime, 2),
            ];
          } else if (this.summaryBy === 'PORTS') {

            let ubication = data.datasets[0].data[index].ubication;

            let port = this.generateVoyages[ubication[0]].ports[ubication[1]];
            result = [
              'Departure : ' + port.departurePort,
              'Arrival : ' + port.arrivalPort,
              'Distance : ' + port.speed.distance,
              'Time : ' + port.speed.steamingTime,
              'Speed : ' + mathRound(port.speed.distance / port.speed.steamingTime, 2),
            ];
          } else if (this.summaryBy === 'MONTHS') {


            let speed = data.datasets[0].data[index].speed;

            //let port = this.generateVoyages[ubication[0]].ports[ubication[1]];
            result = [
              'Distance : ' + speed.distance,
              'Time : ' + speed.steamingTime,
              'Speed : ' + mathRound(speed.distance / speed.steamingTime, 2),
            ];
          }
          else if (this.summaryBy === 'DAYS') {


            let dataExtra = data.datasets[0].data[index].dataExtra;

            let speed = new Speed();
            let activities = '';
            let observations = '';
            let totalReport = 0;

            dataExtra.forEach((report: DailyReport) => {
              activities = activities + ', ' + this.languageService.GetMessage(this.translateCategory, report.activityPerformed);
              observations = observations + ', ' + report.observation;
              speed.add(report.distance, report.steamingTime);
              totalReport = totalReport + 1;
            });

            result = [
              'Distance : ' + speed.distance,
              'Time : ' + speed.steamingTime,
              'Speed : ' + mathRound(speed.distance / speed.steamingTime, 2),
              'T. Reports : ' + totalReport,
              'Activities : ' + activities,
              'Observations : ' + observations
            ];

          }


          return result;

        },
      },
    }


    if (this.configLineaMGO.lineaMax < this.selectUser.maxMGOConsumption) {
      this.configLineaMGO.lineaMax = this.selectUser.maxMGOConsumption;
    }

    this.configLineaMGO.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaMGO.lineaMax, 0) + 2);

    this.chartLineMGO.update();

    return false;
  }

  public UpdateLineIFO(): boolean {

    // Testing
    console.log('UpdateLineIFO');

    // Actualizamos los labels
    this.configLineaIFO.data.labels = this.xLabelReport;

    this.configLineaIFO.data.datasets[0].data = this.dataIFO;

    // Vaciamos la configuracion de las lines MGO
    this.configLineaIFO.options.lines = [];

    // Verificamos que exista una confifuracion para LSFO
    if (this.selectUser.isConsumptionIFO || this.selectUser.isConsumptionLSFO || this.selectUser.isConsumptionVLSFO) {
      // Si el consumo maximo es mayor a 0 lo pintamos si no no hace falta.
      if (this.selectUser.maxIFOConsumption > 0) {
        this.configLineaIFO.options.lines.push({
          type: 'horizontal',
          y: this.selectUser.maxIFOConsumption,
          color: 'red',
          label: ''
        });
      }

      this.configLineaIFO.options.tooltips = {

        // Establece qué elementos aparecen en la información sobre herramientas.
        mode: 'nearest',
        // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
        intersect: false,
        callbacks: {
          title: (tooltipItem, data) => {

            let result = tooltipItem[0].xLabel;
            if (this.summaryBy === 'MONTHS') {

              result = TextMonthYear(result);
            }
            if (this.summaryBy === 'DAYS') {
              result = TextMonthDayYear(result)
            }

            return result;
          },
          label: (tooltipItem, data) => {

            let typeConsumption = this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';
            return 'Consumption ' + typeConsumption + ' : ' + tooltipItem.value;
          },
          footer: (tooltipItem, data) => {
            let index = tooltipItem[0].index;

            let result = [];
            if (this.summaryBy === 'VOYAGES') {

              let ubication = data.datasets[0].data[index].ubication;

              let voyage = this.generateVoyages[ubication[0]];
              result = [
                'T. Ports : ' + voyage.totalPort,
                'Distance : ' + voyage.totalSpeed.distance,
                'Time : ' + voyage.totalSpeed.steamingTime,
                'Speed : ' + mathRound(voyage.totalSpeed.distance / voyage.totalSpeed.steamingTime, 2),
              ];
            } else if (this.summaryBy === 'PORTS') {

              let ubication = data.datasets[0].data[index].ubication;

              let port = this.generateVoyages[ubication[0]].ports[ubication[1]];
              result = [
                'Departure : ' + port.departurePort,
                'Arrival : ' + port.arrivalPort,
                'Distance : ' + port.speed.distance,
                'Time : ' + port.speed.steamingTime,
                'Speed : ' + mathRound(port.speed.distance / port.speed.steamingTime, 2),
              ];
            } else if (this.summaryBy === 'MONTHS') {

              let speed = data.datasets[0].data[index].speed;

              result = [
                'Distance : ' + speed.distance,
                'Time : ' + speed.steamingTime,
                'Speed : ' + mathRound(speed.distance / speed.steamingTime, 2),
              ];
            }
            else if (this.summaryBy === 'DAYS') {

              let dataExtra = data.datasets[0].data[index].dataExtra;

              let speed = new Speed();
              let activities = '';
              let observations = '';
              let totalReport = 0;

              dataExtra.forEach((report: DailyReport) => {
                activities = activities + ', ' + this.languageService.GetMessage(this.translateCategory, report.activityPerformed);
                observations = observations + ', ' + report.observation;
                speed.add(report.distance, report.steamingTime);
                totalReport = totalReport + 1;
              });

              result = [
                'Distance : ' + speed.distance,
                'Time : ' + speed.steamingTime,
                'Speed : ' + mathRound(speed.distance / speed.steamingTime, 2),
                'T. Reports : ' + totalReport,
                'Activities : ' + activities,
                'Observations : ' + observations
              ];
            }


            return result;

          },
        }
      }

    }


    if (this.configLineaIFO.lineaMax < this.selectUser.maxIFOConsumption) {
      this.configLineaIFO.lineaMax = this.selectUser.maxIFOConsumption;
    }


    this.configLineaIFO.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaIFO.lineaMax, 0) + 2);
    //
    this.chartLineIFO.update();
    //
    return false;

  }

  public UpdateLineSPEED(): boolean {

    // Testing
    console.log('UpdateLineSPEED()');

    // Actualizamos los labels    // Actualizamos los labels
    this.configLineaSPEED.data.labels = this.xLabelReport;
    this.configLineaSPEED.data.datasets[0].data = this.dataSPEED;
    this.configLineaSPEED.data.datasets[0].reportDetail = this.generateVoyages;

    // Vaciamos la configuracion de las lines MGO
    this.configLineaSPEED.options.lines = [];

    // Si el consumo maximo es mayor a 0 lo pintamos si no no hace falta.
    if (this.selectUser.maxSpeed > 0) {
      this.configLineaSPEED.options.lines.push({
        type: 'horizontal',
        y: this.selectUser.maxSpeed,
        color: 'red',
        label: ''
      });
    }
    // Si el consumo maximo es mayor a 0 lo pintamos si no no hace falta.
    if (this.selectUser.minSpeed > 0) {
      this.configLineaSPEED.options.lines.push({
        type: 'horizontal',
        y: this.selectUser.minSpeed,
        color: '#39FF14',
        label: ''
      });
    }



    this.configLineaSPEED.options.tooltips = {

      // Establece qué elementos aparecen en la información sobre herramientas.
      mode: 'nearest',
      // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
      intersect: false,
      callbacks: {
        title: (tooltipItem, data) => {

          let result = tooltipItem[0].xLabel;
          if (this.summaryBy === 'MONTHS') {
            result = TextMonthYear(result);
          }
          if (this.summaryBy === 'DAYS') {
            result = TextMonthDayYear(result)
          }

          return result;
        },
        label: (tooltipItem, data) => {

          let typeConsumption = 'Speed : ' + tooltipItem.value;
          return typeConsumption;
        },
        footer: (tooltipItem, data) => {

          let index = tooltipItem[0].index;


          let result = [];
          if (this.summaryBy === 'VOYAGES') {

            let ubication = data.datasets[0].data[index].ubication;

            let voyage = this.generateVoyages[ubication[0]];
            result = [
              'T. Ports : ' + voyage.totalPort,
              'Distance : ' + voyage.totalSpeed.distance,
              'Time : ' + voyage.totalSpeed.steamingTime,
            ];
          } else if (this.summaryBy === 'PORTS') {

            let ubication = data.datasets[0].data[index].ubication;

            let port = this.generateVoyages[ubication[0]].ports[ubication[1]];
            result = [
              'Departure : ' + port.departurePort,
              'Arrival : ' + port.arrivalPort,
              'Distance : ' + port.speed.distance,
              'Time : ' + port.speed.steamingTime,
            ];
          } else if (this.summaryBy === 'MONTHS') {

            let speed = data.datasets[0].data[index].speed;

            result = [
              'Distance : ' + speed.distance,
              'Time : ' + speed.steamingTime
            ];
          }
          else if (this.summaryBy === 'DAYS') {

            let dataExtra = data.datasets[0].data[index].dataExtra;

            let speed = new Speed();
            let activities = '';
            let observations = '';
            let totalReport = 0;

            dataExtra.forEach((report: DailyReport) => {
              activities = activities + ', ' + this.languageService.GetMessage(this.translateCategory, report.activityPerformed);
              observations = observations + ', ' + report.observation;
              speed.add(report.distance, report.steamingTime);
              totalReport = totalReport + 1;
            });

            result = [
              'Distance : ' + speed.distance,
              'Time : ' + speed.steamingTime,
              'T. Reports : ' + totalReport,
              'Activities : ' + activities,
              'Observations : ' + observations
            ];
          }


          return result;

        },
      },
    }


    if (this.configLineaSPEED.lineaMax < this.selectUser.maxSpeed) {
      this.configLineaSPEED.lineaMax = this.selectUser.maxSpeed;
    }


    this.configLineaSPEED.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaSPEED.lineaMax, 0) + 2);

    this.chartLineSPEED.update();

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


  public MathRoundOneDecimal(valor, cantDecimales: number) {
    if (!valor) { return 0; }

    let result = mathRound(valor, 2)
    return result;

  }
  public Testt() {
    alert("DI O CLICK");
  }

  public PluginChartLine() {

    // Agregamos un plugin para saver los niveles.
    const chartPluginLineaHorizontal = {
      afterDraw: (chartobj: any) => {
        if (chartobj.options.lines) {
          let ctx = chartobj.chart.ctx;

          // tslint:disable-next-line: prefer-for-of
          for (let idx = 0; idx < chartobj.options.lines.length; idx++) {

            let line = chartobj.options.lines[idx];
            line.iniCoord = [0, 0];
            line.endCoord = [0, 0];
            line.color = line.color ? line.color : 'red';
            line.label = line.label ? line.label : '';

            if (line.type === 'horizontal' && line.y) {
              line.iniCoord[1] = line.endCoord[1] = chartobj.scales['y-axis-0'].getPixelForValue(line.y);
              line.endCoord[0] = chartobj.chart.width;
            } else if (line.type === 'vertical' && line.x) {
              line.iniCoord[0] = line.endCoord[0] = chartobj.scales['x-axis-0'].getPixelForValue(line.x);
              line.endCoord[1] = chartobj.chart.height;
            }

            ctx.beginPath();
            ctx.moveTo(line.iniCoord[0], line.iniCoord[1]);
            ctx.lineTo(line.endCoord[0], line.endCoord[1]);
            ctx.strokeStyle = line.color;
            ctx.stroke();
            ctx.fillStyle = line.color;
            ctx.fillText(line.label, line.iniCoord[0] + 3, line.iniCoord[1] + 3);
          }
        }
      }
    };

    Chart.pluginService.register(chartPluginLineaHorizontal);

  }

}
