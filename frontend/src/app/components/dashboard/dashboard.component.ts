import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DailyReport, Speed } from 'src/app/models/daily-report';
import { User } from 'src/app/models/user';
import { Voyage, VoyageFilterByYears } from 'src/app/models/voyage';
import { ASideService } from 'src/app/services/a-side.service';
import { DailyReportService } from 'src/app/services/daily-report.service';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PortService } from 'src/app/services/port.service';
import { UserService } from 'src/app/services/user.service';
import { VoyageService } from 'src/app/services/voyage.service';


import * as Chart from 'chart.js';
import { mathRound } from 'dist/frontend/assets/math/math.assets';
import PerfectScrollbar from 'perfect-scrollbar';
import { Port } from 'src/app/models/port';
import { FormatDate, GetMonthYearFromDate, ComparePreviousDates, CompareBeforeDates, TextMonthYear } from 'src/assets/moment/moment.assets';

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

        this.GenerateDataByFilter();

        this.GenerateDashboardBySumary()

        // Actualizamos los cuadros del dashboard.
        this.UpdateLineIFO();
        this.UpdateLineMGO();
        this.UpdateLineSPEED();

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

  public ClickSummaryBy(): boolean {

    this.loadingService.Open();

    Promise.resolve(true).then(
      () => {

        this.GenerateDashboardBySumary();

      }
    ).then(
      () => {
        this.UpdateLineIFO();
        this.UpdateLineMGO();
        this.UpdateLineSPEED();

        this.loadingService.Close();
      }
    )
    return true;
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

  // Genera la data del viaje con filtro y resumen.
  public GenerateDataByFilter() {
    console.log('Generate()');


    this.generateVoyages = JSON.parse(JSON.stringify(this.getVoyages));

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
                    totalConsumoByPortIFO = totalConsumoByPortIFO + this.SumaIfo(report);
                    totalConsumoByPortMGO = totalConsumoByPortMGO + this.SumaMgo(report);
                    totalSpeedByPort.add(report.distance, report.steamingTime);
                    totalPuertos = totalPuertos + 1;


                    dayStartByPort = ComparePreviousDates(dayStartByPort, report.date);
                    dayEndByPort = CompareBeforeDates(dayEndByPort, report.date);

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
              dayEndByVoyage = CompareBeforeDates(dayEndByVoyage, dayEndByPort);

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

        return true;
      });

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
  }

  // Generar data para el dashboard desde el arreglo de reportes
  public GenerateDashBoardByVoyages() {

    this.xLabelReport = [];
    this.dataIFO = [];
    this.dataMGO = [];
    this.dataSPEED = [];

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

      }

    );


  }
  // Generar data para el dashboard desde el arreglo de reportes
  public GenerateDashBoardByPorts() {

    this.xLabelReport = [];
    this.dataIFO = [];
    this.dataMGO = [];
    this.dataSPEED = [];

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
          }
        )



      }

    );


  }
  public GenerateDashBoardByMonths() {

    this.xLabelReport = [];
    this.dataIFO = [];
    this.dataMGO = [];
    this.dataSPEED = [];

    this.generateVoyages.forEach(
      (voyage, iV) => {

        voyage.ports.forEach(
          (port, iP) => {

            port.dailyReports.forEach(
              (report, iR) => {

                let day = report.date;
                debugger

                let resultSearch = this.xLabelReport.find(
                  (xDay, iL) => {

                    // Verificamos la fecha actual.
                    debugger
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
                      // this.dataSPEED[iL].y = { x: dataReport.date, y: dataReport.totalMGO };
                      // speed.distance / speed.steamingTime
                      return true;
                    }

                    return false;
                  }

                );

                debugger
                if (!resultSearch) {
                  debugger
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


                }



              }
            );

          }
        )



      }

    );


  }
  public GenerateDashBoardByDays() {

    this.xLabelReport = [];
    this.dataIFO = [];
    this.dataMGO = [];
    this.dataSPEED = [];

    this.generateVoyages.forEach(
      (voyage, iV) => {

        voyage.ports.forEach(
          (port, iP) => {

            port.dailyReports.forEach(
              (report, iR) => {
                let day = report.date;
                debugger

                let resultSearch = this.xLabelReport.find(
                  (xDay, iL) => {

                    // Verificamos la fecha actual.
                    debugger
                    if (FormatDate(day) === FormatDate(xDay)) {

                      // Actualizamos el vlaor por la posicion.
                      this.dataIFO[iL].y = this.dataIFO[iL].y + this.SumaIfo(report)
                      this.dataMGO[iL].y = this.dataMGO[iL].y + this.SumaMgo(report)


                      if (this.dataIFO[iL].y > this.configLineaIFO.lineaMax) {
                        this.configLineaIFO.lineaMax = this.dataIFO[iL].y;
                      }
                      if (this.dataMGO[iL].y > this.configLineaMGO.lineaMax) {
                        this.configLineaMGO.lineaMax = this.dataMGO[iL].y;
                      }
                      // this.dataSPEED[iL].y = { x: dataReport.date, y: dataReport.totalMGO };
                      // speed.distance / speed.steamingTime
                      return true;
                    }

                    return false;
                  }

                );

                debugger
                if (!resultSearch) {
                  debugger
                  // console.log('GenerateDataForDashboard()');

                  // agregamos la fecha a nuestro arreglo.
                  this.xLabelReport.push(day);

                  this.dataIFO.push(
                    { x: day, y: this.SumaIfo(report) }
                  );

                  this.dataMGO.push(
                    { x: day, y: this.SumaMgo(report) }
                  );



                  if (this.SumaIfo(report) > this.configLineaIFO.lineaMax) {
                    this.configLineaIFO.lineaMax = this.SumaIfo(report);
                  }
                  if (this.SumaMgo(report) > this.configLineaMGO.lineaMax) {
                    this.configLineaMGO.lineaMax = this.SumaMgo(report);
                  }

                  /*     let speed = mathRound(port.speed.distance / port.speed.steamingTime, 2);
                      this.dataSPEED.push(
                        { x: txtX, y: speed }
                      );
          
          
                      if (port.robIfo > this.configLineaIFO.lineaMax) {
                        this.configLineaIFO.lineaMax = port.robIfo;
                      }
                      if (port.robMgo > this.configLineaMGO.lineaMax) {
                        this.configLineaMGO.lineaMax = port.robMgo;
                      }
          
                      if (speed > this.configLineaSPEED.lineaMax) {
                        this.configLineaSPEED.lineaMax = speed;
                      } */
                }


              }
            );

          }
        )



      }

    );


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
        onClick: function (e) {
          var bar = this.getElementAtEvent(e)[0];
          if (bar != undefined) {
            var index = bar._index;
            var datasetIndex = bar._datasetIndex;

            debugger
          }
        }

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
    debugger

    this.configLineaMGO = {
      type: 'line',
      data: {
        labels: this.xLabelReport,
        datasets: [{
          label: this.languageService.GetMessage(this.translateCategory, 'TITLE_COMSUMPTION_MGO'),
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: this.dataMGO,
          reportDetail: this.generateVoyages,
          fill: false,
        }]
      },
      options: {
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
          onClick: (event, legendItem) => {
            debugger
            this.Testt();
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
            /*             labelColor: (tooltipItem, data) => {
                          return {
                            borderColor: 'red',
                            backgroundColor: 'blue',
                          };
                        }, */
            afterBody: (tooltipItem, data) => {
              let index = tooltipItem[0].index;

              let reportDetail: Voyage[] = data.datasets[0].reportDetail;


              // '     MPAL :  ' + reportDetail[index].mplaMgo,
              // '     AUX :  ' + reportDetail[index].auxMgo,
              // '     CALDERA :  ' + reportDetail[index].calderaMgo,
              // '     PP :  ' + reportDetail[index].ppMgo,
              // '     GI :  ' + reportDetail[index].giMgo,
              // '     OTHER :  ' + reportDetail[index].otherIfo,
              // '',

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
          reportDetail: this.generateVoyages,
          fill: false,
        }],
        moreData: [['ROBIFO', 'MPL']]
      },

      options: {
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
    this.configLineaMGO.data.datasets[0].reportDetail = this.generateVoyages;

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
              'Ports : ' + voyage.totalPort,
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

            //let port = this.generateVoyages[ubication[0]].ports[ubication[1]];
            result = ['DAYS'];
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
    debugger
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
                'Ports : ' + voyage.totalPort,
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

              //let port = this.generateVoyages[ubication[0]].ports[ubication[1]];
              result = ['DAYS'];
            }


            return result;

          },
        },
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
              'Ports : ' + voyage.totalPort,
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

            //let port = this.generateVoyages[ubication[0]].ports[ubication[1]];
            result = ['DAYS'];
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
