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

        this.GenerateDashBoardByVoyage();

        //Bro tienes yerba?
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
        let totalSpeedViaje: Speed = new Speed();

        // Recorremos los puertos
        voyage.ports = voyage.ports.filter(
          (port: Port, index, ports) => {


            let totalConsumoByPortIFO = 0;
            let totalConsumoByPortMGO = 0;
            let totalSpeedByPort: Speed = new Speed();

            // Filtramos si el estado es true, ademas de filtros.
            if (port.status) {
              // Recorremos los reportes
              port.dailyReports = port.dailyReports.filter(
                (report, index, reports) => {


                  if (report.status) {

                    totalConsumoByPortIFO = totalConsumoByPortIFO + this.SumaIfo(report);
                    totalConsumoByPortMGO = totalConsumoByPortMGO + this.SumaMgo(report);
                    totalSpeedByPort.add(report.distance, report.steamingTime);
                    return true;
                  } else {
                    return false;
                  }
                }
              )

              port.robIfo = totalConsumoByPortIFO;
              port.robMgo = totalConsumoByPortMGO
              port.speed = totalSpeedByPort;

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

        return true;
      });

    console.log(' FIN Generate()');

  }

  // COnfiguracaion Axes si son menos de 60 registro que muestre los dias caso contrario que muestre los meses
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
    } else {

      config = {
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

      }

    }

    return config;
  }

  // Generar data para el dashboard desde el arreglo de reportes
  public GenerateDashBoardByVoyage() {


    this.generateVoyages.forEach(
      voyage => {

        let txtX = 'V' + voyage.voyageNumber + '-' + ('' + voyage.year).slice(-2);
        this.xLabelReport.push(txtX);

        this.dataIFO.push(
          { x: txtX, y: voyage.totalIFO }
        );
        this.dataMGO.push(
          { x: txtX, y: voyage.totalMGO }
        );

        let speed = mathRound(voyage.totalSpeed.distance / voyage.totalSpeed.steamingTime, 2);
        this.dataSPEED.push(
          { x: txtX, y: speed }
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
          reportDetail: this.generateVoyages,
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
              console.log('-------TITLE--------');
              console.log(tooltipItem);
              console.log(data);
              console.log('---------------');
              return tooltipItem[0].xLabel;
            },
            label: (tooltipItem, data) => {
              return 'Consumption LSFO: ' + tooltipItem.value;
            },
            /*   labelColor: (tooltipItem, data) => {
                return {
                  borderColor: 'red',
                  backgroundColor: 'blue',
                };
              }, */
            afterBody: (tooltipItem, data) => {
              let index = tooltipItem[0].index;

              let reportDetail: Voyage[] = data.datasets[0].reportDetail;

              //  '     MPAL : ' + reportDetail[index].mplaIfo,
              //  '     AUX :  ' + reportDetail[index].auxIfo,
              //  '     CALDERA :  ' + reportDetail[index].calderaIfo,
              //  '     OTHER :  ' + reportDetail[index].otherIfo,
              //  '',

              return [];
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

    debugger
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
    this.configLineaIFO.data.datasets[0].reportDetail = this.generateVoyages;

    // Vaciamos la configuracion de las lines MGO
    this.configLineaIFO.options.lines = [];

    // Verificamos que exista una confifuracion para LSFO
    if (this.selectUser.isConsumptionIFO) {
      // Si el consumo maximo es mayor a 0 lo pintamos si no no hace falta.
      if (this.selectUser.maxIFOConsumption > 0) {
        this.configLineaIFO.options.lines.push({
          type: 'horizontal',
          y: this.selectUser.maxIFOConsumption,
          color: 'red',
          label: ''
        });
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

}
