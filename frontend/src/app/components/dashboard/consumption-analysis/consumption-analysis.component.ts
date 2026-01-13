import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
// import { ChartData, registerables } from 'chart.js'; // Para CHart 3.7
// import { getRelativePosition } from 'chart.js/helpers';
// import Chart from 'chart.js/auto';// Para CHart 3.7
import { DailyReportService } from '../../../services/daily-report.service';
import { GetReportVoyagePortDaily } from '../../../models/dialog-export-excel';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChartConfiguration } from 'chart.js';
import { LoadingService } from '../../../services/loading.service';
import { LanguageService } from '../../../services/language.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DailyReport, Speed } from '../../../models/daily-report';
import { Voyage } from '../../../models/voyage';
import { Port } from '../../../models/port';
import { ActivityPerformed, InfoReport_IFO_AND_MGO } from '../../../models/dashboard';
import { FormuleService } from '../../../services/formule.service';

import PerfectScrollbar from 'perfect-scrollbar';
import { mathRound } from '../../../../assets/math/math.assets';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { ConvertMomentUTC, IsAfter1Date, validateDate } from '../../../../assets/moment/moment.assets';

@Component({
  selector: 'app-consumption-analysis',
  templateUrl: './consumption-analysis.component.html',
  styleUrls: ['./consumption-analysis.component.scss']
})
export class ConsumptionAnalysisComponent implements OnInit {
  // Esta variable nos ayudara a saber si nos encontramos con conexion al servidor.
  public isOnline: boolean = true;

  // Variables de traduccion
  public userLanguage: string;
  public translateCategory: string = 'consumptionAnalysis';

  // Rol del usuario logeado.
  public roleUser: string = '';


  // ------------ Chart ----------------
  public xLabelReport: any[] = [];
  // Configuracion del SPEED
  public dataConsumptionChartPoint: any[] = []; // Data
  public configLineaConsumption: ChartConfiguration; // configuracion del elemento
  public chartLineConsumption: Chart; // LINEA

  public xLabelReportMGO: any[] = [];
  // Configuracion del SPEED
  public dataConsumptionChartPointMGO: any[] = []; // Data
  public configLineaConsumptionMGO: ChartConfiguration; // configuracion del elemento
  public chartLineConsumptionMGO: Chart; // LINEA

  // Años que tiene el usuario.
  public yearsOfUsers: number[] = [];

  // ------------ Formulario Filter -----------------
  public formFilter: FormGroup;
  public selectSummaryBy: string = 'VOYAGES';
  public typeSummaryVoyageList: string[] = ['VOYAGES', 'PORTS', 'MONTHS', 'DAYS'];
  public activityPerformedList: string[] = ['LOADING', 'DOWNLOADING', 'SAILING_IN_BALLAST', 'SAILING_WITH_LADEN', 'ECONOMICAL_NAVIGATION', 'ANCHORED', 'MANEUVER', 'OTHER_ACT'];
  // UserId seleccionado.
  public selectUserId: number = 0; // esta variable podria desaparecer esta de mas, por que el id del usuario ya lo tenemos en la variable selectUser
  // Viajes seleccionados.
  public selectedYears: number[] = [];

  // Filtro por fecha inicio y fin
  public startDate: string; // REVISAR SI ESTA BIEN POR QUE ES UNA FECHA:
  public endDate: string;

  // Usuario seleccionado.
  public selectUser: User = new User();

  // Si esta activado nos muestra con la formula de dailuconsumption.
  public isDailyFormule: boolean = false;



  // DATA consultas server.
  // Todos los usuarios obtenidos por el getUsers.
  public getUsers: User[] = [];
  // Lista con el resumen por viaje.
  public listTableSpeedByVoyage: any = [];

  // Data
  public listGetReportVoyagePortDaily: GetReportVoyagePortDaily[] = [];
  public reorganizarDataViajes = {
    LOADING: [],
    DOWNLOADING: [],
    SAILING_IN_BALLAST: [],
    SAILING_WITH_LADEN: [],
    ECONOMICAL_NAVIGATION: [],
    ANCHORED: [],
    MANEUVER: [],
    OTHER_ACT: []
  };

  public listGetReportVoyagePortDailyMGO: GetReportVoyagePortDaily[] = [];
  public reorganizarDataViajesMGO = {
    LOADING: [],
    DOWNLOADING: [],
    SAILING_IN_BALLAST: [],
    SAILING_WITH_LADEN: [],
    ECONOMICAL_NAVIGATION: [],
    ANCHORED: [],
    MANEUVER: [],
    OTHER_ACT: []
  };
  public cantDecimal: number = 1;
  public aMonthEnglishShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _dailyReportService: DailyReportService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
    private fb: FormBuilder,
    private formuleService: FormuleService,
    private userService: UserService,
  ) {
    this.userLanguage = this.languageService.GetCurrentLanguage();
    // Inicializamos y bloqueamos el formulario.
    this.ReactiveForm(true, false, true, false, true);
  }

  ngOnInit(): void {



    // Si tenemos internet se ejecuta lo siguiente.
    Promise.resolve(true).then(
      result => {

        // Plugin de linea
        this.PluginChartLine();

        // Inicializamos la lineaChartSPEED
        this.GenetareLineIFO();
        this.GenetareLineMGO();

        // Instanciamos el obj que usaremos en la consulta de registro de viajes
        let user: User = new User();

        // Rol del usurio logeado.
        this.roleUser = this.userService.GetIdentity().role;

        // Si no eres un admin solo puedes registrar viajes con el userId logeado.
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
        if (!result) throw 'ERROR_GET_USERS';

        // Seleccionaremos el primer buque del arreglo.
        let firstUser: User = this.getUsers.find(user => user.role === 'BUQUE');

        if (!firstUser) throw 'NO_BUQUE_REGISTER';

        // Buscamos al primer usuario, si no es admin solo nos saldra el usuario logeado.
        return this.SelectUser(firstUser.id);
      }
    )

    setTimeout(() => {
      // BODY FULL CONTAINER
      new PerfectScrollbar('.body-full-container', {
        suppressScrollX: true
      });

    });

  }

  public async ClickButtonTest(): Promise<boolean> {
    console.log('ClickButtonTest()')

    // Filtros por fecha.
    let userSelect = 0;
    let summaryBy = '';
    let dateStart = '';
    let dateEnd = '';




    // Inicia la promesa.
    return await Promise.resolve(true)
      .then(
        result => {
          // Obtenemos los datos escrito en el formulario, nos importa 
          return this.ReactiveForm(false, false, true, true, false);
        }
      ).then(
        result => {
          if (!result) throw 'ERROR FILTER';

          // Seleccionamos los del formulario.
          // Obtenemos el usuario seleccionamos.
          userSelect = this.selectUserId;
          // agregamos el filtro.
          summaryBy = this.selectSummaryBy;
          // Seteammos una fecha solo si la fecha es null
          this.GenerateDateByThisFishYearAndOldYear(true);
          // Seteamos la fecha.
          return this.ReactiveForm(false, false, true, false, true);
        }
      ).then(
        result => {
          if (!result) throw 'ERROR_REACTIVE_FORM'
          dateStart = this.startDate;
          dateEnd = this.endDate;

          // Obtenemos el total por actividad
          return this.GetTotalConsumptionByActivityFilterByUserIdAndDateAndType(userSelect, dateStart, dateEnd, summaryBy).pipe().toPromise();
        }
      ).then(
        result => {
          if (!result) throw 'ERROR GER REPORT';
          this.listGetReportVoyagePortDaily = result.ifo;
          this.listGetReportVoyagePortDailyMGO = result.mgo;

          return this.GenerateDataForChart(false, this.listGetReportVoyagePortDaily);
        }
      ).then(
        result => {
          this.UpdateLineSPEED()

          return this.GenerateDataForChartMGO(false, this.listGetReportVoyagePortDailyMGO);
        }
      ).then(
        result => {
          this.UpdateLineSPEED_MGO()
          return true;
        }
      ).then(
        result => {
          return true;
        }
      ).then(
        result => {
          return true;
        }
      ).catch(
        err => {
          return false
        }
      );

  }

  // Esta funcion hace una busqueda por defecto omite loos filtros, se preocupa en los ultimos 40 dias del reporte.
  public async ClickClear(): Promise<boolean> {
    console.log('ClickClear()')
    // Inicia la promesa.
    return await Promise.resolve(true)
      .then(
        result => {
          // Reset valores del filtro.
          this.startDate = null;
          this.endDate = null;
          // El resumen se hace por puerto.
          this.selectSummaryBy = 'PORTS';


          // Seteamos el form.
          return this.ReactiveForm(false, false, true, false, true);
        }
      ).then(
        result => {
          if (!result) throw 'ERROR REACTIVE_FORM'

          // armamos los valores que se enviaran a la consulta
          let userSelect = this.selectUserId;
          let dateStart = this.startDate;
          let dateEnd = this.endDate;
          let typeSummary = this.selectSummaryBy;

          // Obtenemos el total por actividad
          return this.GetTotalConsumptionByActivityFilterByUserIdAndDateAndType(userSelect, dateStart, dateEnd, typeSummary).pipe().toPromise();
        }
      ).then(
        result => {
          if (!result) throw 'ERROR GER REPORT';
          this.listGetReportVoyagePortDaily = result.ifo;
          this.listGetReportVoyagePortDailyMGO = result.mgo;

          return this.GenerateDataForChart(false, this.listGetReportVoyagePortDaily);
        }
      ).then(
        result => {
          this.UpdateLineSPEED()
          return this.GenerateDataForChartMGO(false, this.listGetReportVoyagePortDailyMGO);
        }
      ).then(
        result => {
          this.UpdateLineSPEED_MGO();
          return true;
        }
      ).then(
        resutl => {

          if (this.listGetReportVoyagePortDaily.length > 0) {
            this.startDate = String(this.listGetReportVoyagePortDaily[0].date);
            this.endDate = String(this.listGetReportVoyagePortDaily[this.listGetReportVoyagePortDaily.length - 1].date);

          } else {
            throw 'There are no reports registered.'
          }

          // Seteamos el form.
          return this.ReactiveForm(false, false, true, false, true);
        }
      )


  }

  public async ClickItemTableIfo(indexData: number) {

    // Ubicacion
    let ubication = indexData;
    // Obtenemos el registro real con la ubicacion.
    let reportVoyagePortDaily = this.listGetReportVoyagePortDaily[ubication];
    // Fecha inicio fecha fin.
    this.startDate = reportVoyagePortDaily.dayStart;
    this.endDate = reportVoyagePortDaily.dayEnd;


    // Este click tendra consulta al server solo si no es de tipo dia.
    let consultarServer = true;
    if (this.selectSummaryBy == 'VOYAGES') {
      this.selectSummaryBy = 'PORTS';
    } else if (this.selectSummaryBy == 'PORTS') {
      this.selectSummaryBy = 'DAYS';
    } else if (this.selectSummaryBy == 'MONTHS') {
      this.selectSummaryBy = 'DAYS';
    } else if (this.selectSummaryBy == 'DAYS') {
      consultarServer = false;
    }

    // Solo si el tipo de resumen es diferente a dias hacemos la consulta.
    if (consultarServer) {
      // Seteamos los valores configurados.
      this.ReactiveForm(false, false, true, false, true)
      // BUscamos segun los filtros.  
      this.ClickButtonTest();
    }
  }

  private GenetareLineIFO(): boolean {

    // Configuracion Chart lineal
    this.configLineaConsumption = {
      // Update Char 3.7 quitar este type deberia ir en cada dataset.
      type: 'line',
      data: {
        labels: [], // Lo pongo vacio por que en el update se colocara el valor.
        datasets: []
      },
      options: {
        title: {
          display: true,
          text: this.languageService.GetMessage(this.translateCategory,
            this.isDailyFormule ?
              (this.selectUser.isConsumptionLSFO ? 'TITLE_DAILY_COMSUMPTION_LSFO' : this.selectUser.isConsumptionIFO ? 'TITLE_DAILY_COMSUMPTION_IFO' : this.selectUser.isConsumptionVLSFO ? 'TITLE_DAILY_COMSUMPTION_VLSFO' : 'TITLE_DAILY_COMSUMPTION_LSFO') :
              (this.selectUser.isConsumptionLSFO ? 'TITLE_COMSUMPTION_LSFO' : this.selectUser.isConsumptionIFO ? 'TITLE_COMSUMPTION_IFO' : this.selectUser.isConsumptionVLSFO ? 'TITLE_COMSUMPTION_VLSFO' : 'TITLE_COMSUMPTION_LSFO')

          ),
          fontColor: 'rgb(255,255,255)',
          fontStyle: 'bold', // Tipo de texto de la leyenda.
          padding: 1
        },
        // Lineas los pongo por el public creo que es maxio y minimo corrigan.
        lines: [],
        onHover: (event, chartElement) => {
          //console.log(event);
          // console.log(chartElement);
          let eventTarget = event.target as HTMLCanvasElement;
          eventTarget.style.cursor = chartElement[0] ? 'pointer' : 'default';
        },
        // Otras opciones dentro del Chart
        onClick: (event, activeElement) => {
          // REVISAR ESTO, Aqui se ejecuta la data que se muestra al dar click a los puntos dentro del chart.
          if (activeElement && activeElement.length) {

            // Obtenemos la posicion 0 del activeElement
            let actEle: any = activeElement[0];

            // Obtenemos la ubicacion.
            let index = actEle._index;
            let datasetIndex = actEle._datasetIndex;
            let dataConsumptionChartPoint = this.dataConsumptionChartPoint[datasetIndex];
            let label = dataConsumptionChartPoint.label;
            // Obtenemos la lista de dataset del la actividad seleccionada.
            let dataChartList = dataConsumptionChartPoint.data;
            let ubication = dataChartList[index].ubication;
            // Obtenemos el registro real con la ubicacion.
            let reportVoyagePortDaily = this.listGetReportVoyagePortDaily[ubication];

            this.startDate = reportVoyagePortDaily.dayStart;
            this.endDate = reportVoyagePortDaily.dayEnd;


            // Este click tendra consulta al server solo si no es de tipo dia.
            let consultarServer = true;
            if (this.selectSummaryBy == 'VOYAGES') {
              this.selectSummaryBy = 'PORTS';
            } else if (this.selectSummaryBy == 'PORTS') {
              this.selectSummaryBy = 'DAYS';
            } else if (this.selectSummaryBy == 'MONTHS') {
              this.selectSummaryBy = 'DAYS';
            } else if (this.selectSummaryBy == 'DAYS') {
              consultarServer = false;
            }
            // Solo si el tipo de resumen es diferente a dias hacemos la consulta.
            if (consultarServer) {
              // Seteamos los valores configurados.
              this.ReactiveForm(false, false, true, false, true)
              // BUscamos segun los filtros.  
              this.ClickButtonTest();
            }

          }
        },
        legend: {
          // La leyenda es el texto que esta arriva del cuadro.
          display: true,
          labels: {
            fontColor: 'rgb(255,255,255)', // Color de la leyenda.
            fontStyle: 'normal', // Tipo de texto de la leyenda.
            boxWidth: 7,
            fontSize: 10,
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {}, // Lo pongo vacio por que en// Lo pongo vacio por que en el update se colocara el valor.
        scales: {},// Lo pongo vacio por que en el update se colocara el valor.
        /*  hover: {
           // @ts-ignore
           onHover: function (e: MouseEvent) {
 
             console.log('hoverrrrrrrrrrrrrrr')
             // puntos GetElementAtaEvent
             var point = this.getElementAtEvent(e);
 
             // event targer.
             let eventTarget = e.target as HTMLCanvasElement;
             ///home/kali/.vscode/extensions/ms-vscode.vscode-typescript-next-4.3.20210505/node_modules/typescript/lib/lib.dom.d.ts
             if (point.length) {
               eventTarget.style.cursor = 'pointer';// Aqui se esta modificando el TypeScript.
             } else {
               eventTarget.style.cursor = 'default';
             }
           }
         } */
      },
      lineaMax: 0 // Lo pongo cero por que en el update se colocara el valor.
    };


    // Encapculamos el elemento del dom.
    let canvaLineSPEED: any = document.getElementById('myChart');
    // Convertimos el canvaLineIfo en 2d
    let ctxLineSPEED: any = canvaLineSPEED.getContext('2d');

    this.chartLineConsumption = new Chart(ctxLineSPEED, this.configLineaConsumption);

    return false;

  }

  private GenetareLineMGO(): boolean {

    // Configuracion Chart lineal
    this.configLineaConsumptionMGO = {
      // Update Char 3.7 quitar este type deberia ir en cada dataset.
      type: 'line',
      data: {
        labels: [], // Lo pongo vacio por que en el update se colocara el valor.
        datasets: []
      },
      options: {
        title: {
          display: true,
          text: this.languageService.GetMessage(this.translateCategory,
            this.isDailyFormule ?
              'TITLE_DAILY_COMSUMPTION_MGO' :
              'TITLE_COMSUMPTION_MGO'
          ),
          fontColor: 'rgb(255,255,255)',
          fontStyle: 'bold', // Tipo de texto de la leyenda.
          padding: 1
        },
        // Lineas los pongo por el public creo que es maxio y minimo corrigan.
        lines: [],
        onHover: (event, chartElement) => {
          //console.log(event);
          // console.log(chartElement);
          let eventTarget = event.target as HTMLCanvasElement;
          eventTarget.style.cursor = chartElement[0] ? 'pointer' : 'default';
        },
        // Otras opciones dentro del Chart
        onClick: (event, activeElement) => {
          // REVISAR ESTO, Aqui se ejecuta la data que se muestra al dar click a los puntos dentro del chart.
          if (activeElement && activeElement.length) {

            // Obtenemos la posicion 0 del activeElement
            let actEle: any = activeElement[0];

            // Obtenemos la ubicacion.
            let index = actEle._index;
            let datasetIndex = actEle._datasetIndex;
            let dataConsumptionChartPoint = this.dataConsumptionChartPointMGO[datasetIndex];
            let label = dataConsumptionChartPoint.label;
            // Obtenemos la lista de dataset del la actividad seleccionada.
            let dataChartList = dataConsumptionChartPoint.data;
            let ubication = dataChartList[index].ubication;
            // Obtenemos el registro real con la ubicacion.
            let reportVoyagePortDaily = this.listGetReportVoyagePortDailyMGO[ubication];

            this.startDate = reportVoyagePortDaily.dayStart;
            this.endDate = reportVoyagePortDaily.dayEnd;


            // Este click tendra consulta al server solo si no es de tipo dia.
            let consultarServer = true;
            if (this.selectSummaryBy == 'VOYAGES') {
              this.selectSummaryBy = 'PORTS';
            } else if (this.selectSummaryBy == 'PORTS') {
              this.selectSummaryBy = 'DAYS';
            } else if (this.selectSummaryBy == 'MONTHS') {
              this.selectSummaryBy = 'DAYS';
            } else if (this.selectSummaryBy == 'DAYS') {
              consultarServer = false;
            }
            // Solo si el tipo de resumen es diferente a dias hacemos la consulta.
            if (consultarServer) {
              // Seteamos los valores configurados.
              this.ReactiveForm(false, false, true, false, true)
              // BUscamos segun los filtros.  
              this.ClickButtonTest();
            }

          }
        },
        legend: {
          // La leyenda es el texto que esta arriva del cuadro.
          display: true,
          labels: {
            fontColor: 'rgb(255,255,255)', // Color de la leyenda.
            fontStyle: 'normal', // Tipo de texto de la leyenda.
            boxWidth: 7,
            fontSize: 10,
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {}, // Lo pongo vacio por que en// Lo pongo vacio por que en el update se colocara el valor.
        scales: {},// Lo pongo vacio por que en el update se colocara el valor.
        /*  hover: {
           // @ts-ignore
           onHover: function (e: MouseEvent) {
 
             console.log('hoverrrrrrrrrrrrrrr')
             // puntos GetElementAtaEvent
             var point = this.getElementAtEvent(e);
 
             // event targer.
             let eventTarget = e.target as HTMLCanvasElement;
             ///home/kali/.vscode/extensions/ms-vscode.vscode-typescript-next-4.3.20210505/node_modules/typescript/lib/lib.dom.d.ts
             if (point.length) {
               eventTarget.style.cursor = 'pointer';// Aqui se esta modificando el TypeScript.
             } else {
               eventTarget.style.cursor = 'default';
             }
           }
         } */
      },
      lineaMax: 0 // Lo pongo cero por que en el update se colocara el valor.
    };


    // Encapculamos el elemento del dom.
    let canvaLineMGO: any = document.getElementById('myChartMGO');
    // Convertimos el canvaLineIfo en 2d
    let ctxLineMGO: any = canvaLineMGO.getContext('2d');

    this.chartLineConsumptionMGO = new Chart(ctxLineMGO, this.configLineaConsumptionMGO);

    return false;

  }
  // GenerateDataForChart(): genera data para los chart.
  // Dependiendo del tipo de resumen, puede ser viaje, puertos, meses, dias
  private GenerateDataForChart(setDate: boolean, listGetReportVoyagePortDaily: GetReportVoyagePortDaily[]) {

    console.log('GenerateDataForChart(setDate: boolean)' + setDate)
    // Texto x de los reportes.
    this.xLabelReport = [];

    // Data de los chart.
    this.dataConsumptionChartPoint = [];

    this.reorganizarDataViajes = {
      LOADING: [],
      DOWNLOADING: [],
      SAILING_IN_BALLAST: [],
      SAILING_WITH_LADEN: [],
      ECONOMICAL_NAVIGATION: [],
      ANCHORED: [],
      MANEUVER: [],
      OTHER_ACT: []
    };

    // Limpiamos la lista del viaje.
    this.listTableSpeedByVoyage = [];

    // Configuracion de la linea maxima.
    this.configLineaConsumption.lineaMax = 0;

    // Fecha inicio y fin de la data.
    let startDate;
    let endDate;


    // Creamos esta variable para que nos avise cuando hay un nuevo registro
    // Esta variable solo se usa en los filtro Sumary por mes y dia
    let isAddNewVoyage: boolean = false;

    let ultimoViaje: number = 0;
    let ultimoPuerto: number = 0;

    let speed = 0;

    // Esto se esta poniendo para darle un espacio a la izquierda. por que hay barras que estan despues del borde.
    if (this.selectSummaryBy === 'VOYAGES' || this.selectSummaryBy === 'PORTS') {
      this.xLabelReport.push("")
    } else {
      //Resument por mes o dia no le inserto ese valor vacio.
    }

    // recorremos todo el arreglo
    listGetReportVoyagePortDaily.forEach(
      (iGetReportVoyagePortDaily: GetReportVoyagePortDaily, indexReport: number) => {

        // Generamos el texto para los labels segun tipo de resumen
        let txtLabelChart: string = '';

        if (this.selectSummaryBy === 'VOYAGES') {
          // Armamos el texto de label para viajes.
          txtLabelChart = 'V' + iGetReportVoyagePortDaily.voyageNumber + ' Y' + ('' + iGetReportVoyagePortDaily.year).slice(-2);
        } else if (this.selectSummaryBy === 'PORTS') {
          // Armamos el texto de label para el puerto.
          txtLabelChart = 'V' + iGetReportVoyagePortDaily.voyageNumber + ' P' + iGetReportVoyagePortDaily.portNumber + ' Y' + ('' + iGetReportVoyagePortDaily.year).slice(-2);
        }
        else if (this.selectSummaryBy === 'MONTHS') {
          console.log(Number(String(iGetReportVoyagePortDaily.date).slice(-2)))
          // Armamos el texto de label para mes.
          txtLabelChart = String(iGetReportVoyagePortDaily.date).substring(0, 4)
            + this.aMonthEnglishShort[Number(String(iGetReportVoyagePortDaily.date).slice(-2)) - 1];
        }
        else if (this.selectSummaryBy === 'DAYS') {
          // Armamos el texto de label para dias.
          txtLabelChart = String(iGetReportVoyagePortDaily.date);
        }

        // Posiciondel elemento
        let posicionDelLabelSiExiste = 0;
        // Buscamos si el label ya se registro.
        let existeElLabel = this.xLabelReport.find(
          (label, index) => {
            if (label == txtLabelChart) {
              posicionDelLabelSiExiste = index;
              return true
            }
            return false;
          }
        );

        // Si no existe el label lo agregamos.
        if (!existeElLabel) {
          // Agregamos el texto al arreglo del chart.
          this.xLabelReport.push(txtLabelChart);
        }

        // si la opcion de Aplicar la formula de daily consumption esta activada aplicamos la formula, si no solo hacemos la suma de los equipos-
        let totalIFO = this.isDailyFormule ?
          this.formuleService.CalculateDailyTotal_IFO_Or_MGO(iGetReportVoyagePortDaily, 'IFO') :
          this.formuleService.CalculateTotal_IFO_Or_MGO(iGetReportVoyagePortDaily, 'IFO');


        if (totalIFO > this.configLineaConsumption.lineaMax) {
          this.configLineaConsumption.lineaMax = totalIFO;
        };


        this.reorganizarDataViajes[iGetReportVoyagePortDaily.activityPerformed].push(
          { x: txtLabelChart, y: totalIFO, ubication: indexReport }
        );
      });

    // Solo agregamos una linea si hay registros.
    if (this.reorganizarDataViajes['LOADING'].length > 0) {
      this.dataConsumptionChartPoint.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'LOADING'),
          data: this.reorganizarDataViajes['LOADING'],
          backgroundColor: '#b57c00',
          borderColor: '#b57c00',
          fill: false
        }
      )
    }
    if (this.reorganizarDataViajes['DOWNLOADING'].length > 0) {
      this.dataConsumptionChartPoint.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'DOWNLOADING'),
          data: this.reorganizarDataViajes['DOWNLOADING'],
          backgroundColor: '#d09306',
          borderColor: '#d09306',
          fill: false,
          order: 2
        }
      );
    }
    if (this.reorganizarDataViajes['SAILING_IN_BALLAST'].length > 0) {
      this.dataConsumptionChartPoint.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'SAILING_IN_BALLAST'),
          data: this.reorganizarDataViajes['SAILING_IN_BALLAST'],
          backgroundColor: '#ecab0f',
          borderColor: '#ecab0f',
          fill: false,
          order: 3

        });
    }
    if (this.reorganizarDataViajes['SAILING_WITH_LADEN'].length > 0) {
      this.dataConsumptionChartPoint.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'SAILING_WITH_LADEN'),
          data: this.reorganizarDataViajes['SAILING_WITH_LADEN'],
          backgroundColor: 'rgb(255,192,5)',
          borderColor: 'rgb(255,192,5)',
          fill: false,
          order: 4
        });
    }
    if (this.reorganizarDataViajes['ECONOMICAL_NAVIGATION'].length > 0) {
      this.dataConsumptionChartPoint.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'ECONOMICAL_NAVIGATION'),
          data: this.reorganizarDataViajes['ECONOMICAL_NAVIGATION'],
          backgroundColor: 'rgb(22,205,6)',
          borderColor: 'rgb(22,205,6)',
          fill: false,
          order: 5
        });
    }
    if (this.reorganizarDataViajes['ANCHORED'].length > 0) {
      this.dataConsumptionChartPoint.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'ANCHORED'),
          data: this.reorganizarDataViajes['ANCHORED'],
          backgroundColor: '#f7d547',
          borderColor: '#f7d547',
          fill: false,
          order: 6
        });
    }
    if (this.reorganizarDataViajes['MANEUVER'].length > 0) {
      this.dataConsumptionChartPoint.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'MANEUVER'),
          data: this.reorganizarDataViajes['MANEUVER'],
          backgroundColor: '#ffff72',
          borderColor: '#ffff72',
          fill: false,
          order: 7
        }
      );
    }
    if (this.reorganizarDataViajes['OTHER_ACT'].length > 0) {
      this.dataConsumptionChartPoint.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'OTHER_ACT'),
          data: this.reorganizarDataViajes['OTHER_ACT'],
          backgroundColor: '#fffff1',
          borderColor: '#fffff1',
          fill: false,
          order: 8
        }
      );
    }

    return true;
  }

  private GenerateDataForChartMGO(setDate: boolean, listGetReportVoyagePortDaily: GetReportVoyagePortDaily[]) {

    console.log('GenerateDataForChartMGO(setDate: boolean)' + setDate)
    // Texto x de los reportes.
    this.xLabelReportMGO = [];

    // Data de los chart.
    this.dataConsumptionChartPointMGO = [];

    this.reorganizarDataViajesMGO = {
      LOADING: [],
      DOWNLOADING: [],
      SAILING_IN_BALLAST: [],
      SAILING_WITH_LADEN: [],
      ECONOMICAL_NAVIGATION: [],
      ANCHORED: [],
      MANEUVER: [],
      OTHER_ACT: []
    };


    // Configuracion de la linea maxima.
    this.configLineaConsumptionMGO.lineaMax = 0;

    // Fecha inicio y fin de la data.
    let startDate;
    let endDate;


    // Creamos esta variable para que nos avise cuando hay un nuevo registro
    // Esta variable solo se usa en los filtro Sumary por mes y dia
    let isAddNewVoyage: boolean = false;

    let ultimoViaje: number = 0;
    let ultimoPuerto: number = 0;

    let speed = 0;

    // Esto se esta poniendo para darle un espacio a la izquierda. por que hay barras que estan despues del borde.
    if (this.selectSummaryBy === 'VOYAGES' || this.selectSummaryBy === 'PORTS') {
      this.xLabelReportMGO.push("")
    } else {
      //Resument por mes o dia no le inserto ese valor vacio.
    }

    // recorremos todo el arreglo
    listGetReportVoyagePortDaily.forEach(
      (iGetReportVoyagePortDaily: GetReportVoyagePortDaily, indexReport: number) => {

        // Generamos el texto para los labels segun tipo de resumen
        let txtLabelChart: string = '';

        if (this.selectSummaryBy === 'VOYAGES') {
          // Armamos el texto de label para viajes.
          txtLabelChart = 'V' + iGetReportVoyagePortDaily.voyageNumber + ' Y' + ('' + iGetReportVoyagePortDaily.year).slice(-2);
        } else if (this.selectSummaryBy === 'PORTS') {
          // Armamos el texto de label para el puerto.
          txtLabelChart = 'V' + iGetReportVoyagePortDaily.voyageNumber + ' P' + iGetReportVoyagePortDaily.portNumber + ' Y' + ('' + iGetReportVoyagePortDaily.year).slice(-2);
        }
        else if (this.selectSummaryBy === 'MONTHS') {
          console.log(Number(String(iGetReportVoyagePortDaily.date).slice(-2)))
          // Armamos el texto de label para mes.
          txtLabelChart = String(iGetReportVoyagePortDaily.date).substring(0, 4)
            + this.aMonthEnglishShort[Number(String(iGetReportVoyagePortDaily.date).slice(-2)) - 1];
        }
        else if (this.selectSummaryBy === 'DAYS') {
          // Armamos el texto de label para dias.
          txtLabelChart = String(iGetReportVoyagePortDaily.date);
        }

        // Posiciondel elemento
        let posicionDelLabelSiExiste = 0;

        // Buscamos si el label ya se registro.
        let existeElLabel = this.xLabelReportMGO.find(
          (label, index) => {
            if (label == txtLabelChart) {
              posicionDelLabelSiExiste = index;
              return true
            }
            return false;
          }
        );

        // Si no existe el label lo agregamos.
        if (!existeElLabel) {
          // Agregamos el texto al arreglo del chart.
          this.xLabelReportMGO.push(txtLabelChart);
        }

        // si la opcion de Aplicar la formula de daily consumption esta activada aplicamos la formula, si no solo hacemos la suma de los equipos-
        let totalMGO = this.isDailyFormule ?
          this.formuleService.CalculateDailyTotal_IFO_Or_MGO(iGetReportVoyagePortDaily, 'MGO') :
          this.formuleService.CalculateTotal_IFO_Or_MGO(iGetReportVoyagePortDaily, 'MGO');

        if (totalMGO > this.configLineaConsumptionMGO.lineaMax) {
          this.configLineaConsumptionMGO.lineaMax = totalMGO;
        };


        this.reorganizarDataViajesMGO[iGetReportVoyagePortDaily.activityPerformed].push(
          { x: txtLabelChart, y: totalMGO, ubication: indexReport }
        );
      });

    // Solo agregamos una linea si hay registros.
    if (this.reorganizarDataViajesMGO['LOADING'].length > 0) {
      this.dataConsumptionChartPointMGO.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'LOADING'),
          data: this.reorganizarDataViajesMGO['LOADING'],
          backgroundColor: '#b57c00',
          borderColor: '#b57c00',
          fill: false
        }
      )
    }
    if (this.reorganizarDataViajesMGO['DOWNLOADING'].length > 0) {
      this.dataConsumptionChartPointMGO.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'DOWNLOADING'),
          data: this.reorganizarDataViajesMGO['DOWNLOADING'],
          backgroundColor: '#d09306',
          borderColor: '#d09306',
          fill: false,
          order: 2
        }
      );
    }
    if (this.reorganizarDataViajesMGO['SAILING_IN_BALLAST'].length > 0) {
      this.dataConsumptionChartPointMGO.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'SAILING_IN_BALLAST'),
          data: this.reorganizarDataViajesMGO['SAILING_IN_BALLAST'],
          backgroundColor: '#ecab0f',
          borderColor: '#ecab0f',
          fill: false,
          order: 3

        });
    }
    if (this.reorganizarDataViajesMGO['SAILING_WITH_LADEN'].length > 0) {
      this.dataConsumptionChartPointMGO.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'SAILING_WITH_LADEN'),
          data: this.reorganizarDataViajesMGO['SAILING_WITH_LADEN'],
          backgroundColor: 'rgb(255,192,5)',
          borderColor: 'rgb(255,192,5)',
          fill: false,
          order: 4
        });
    }
    if (this.reorganizarDataViajesMGO['ECONOMICAL_NAVIGATION'].length > 0) {
      this.dataConsumptionChartPointMGO.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'ECONOMICAL_NAVIGATION'),
          data: this.reorganizarDataViajesMGO['ECONOMICAL_NAVIGATION'],
          backgroundColor: 'rgb(22,205,6)',
          borderColor: 'rgb(22,205,6)',
          fill: false,
          order: 5
        });
    }
    if (this.reorganizarDataViajesMGO['ANCHORED'].length > 0) {
      this.dataConsumptionChartPointMGO.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'ANCHORED'),
          data: this.reorganizarDataViajesMGO['ANCHORED'],
          backgroundColor: '#f7d547',
          borderColor: '#f7d547',
          fill: false,
          order: 6
        });
    }
    if (this.reorganizarDataViajesMGO['MANEUVER'].length > 0) {
      this.dataConsumptionChartPointMGO.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'MANEUVER'),
          data: this.reorganizarDataViajesMGO['MANEUVER'],
          backgroundColor: '#ffff72',
          borderColor: '#ffff72',
          fill: false,
          order: 7
        }
      );
    }
    if (this.reorganizarDataViajesMGO['OTHER_ACT'].length > 0) {
      this.dataConsumptionChartPointMGO.push(
        {
          type: 'bar',
          label: this.languageService.GetMessage(this.translateCategory, 'OTHER_ACT'),
          data: this.reorganizarDataViajesMGO['OTHER_ACT'],
          backgroundColor: '#fffff1',
          borderColor: '#fffff1',
          fill: false,
          order: 8
        }
      );
    }

    return true;
  }


  private UpdateLineSPEED(): boolean {
    console.log('UpdateLineSPEED()');


    // Los label lo pongo vacio por es multi line
    this.configLineaConsumption.data.labels = this.xLabelReport;

    // Actualizamos la dataSPEED
    // Revisar esto por que ponen datas .datasets[0].data  si la variable es un arreglo de tipo chartPOint
    this.configLineaConsumption.data.datasets = this.dataConsumptionChartPoint;

    // UPDATE title
    this.configLineaConsumption.options.title.text = this.languageService.GetMessage(this.translateCategory,
      this.isDailyFormule ?
        (this.selectUser.isConsumptionLSFO ? 'TITLE_DAILY_COMSUMPTION_LSFO' : this.selectUser.isConsumptionIFO ? 'TITLE_DAILY_COMSUMPTION_IFO' : this.selectUser.isConsumptionVLSFO ? 'TITLE_DAILY_COMSUMPTION_VLSFO' : 'TITLE_DAILY_COMSUMPTION_LSFO') :
        (this.selectUser.isConsumptionLSFO ? 'TITLE_COMSUMPTION_LSFO' : this.selectUser.isConsumptionIFO ? 'TITLE_COMSUMPTION_IFO' : this.selectUser.isConsumptionVLSFO ? 'TITLE_COMSUMPTION_VLSFO' : 'TITLE_COMSUMPTION_LSFO')
    )

    // Vaciamos la configuracion de las lines SPEED
    // La linea es el campo que agregamos en el plugin.
    this.configLineaConsumption.options.lines = [];

    this.configLineaConsumption.options.lines.push({
      type: 'horizontal',
      y: 12,// this.selectUser.maxSpeed,
      color: 'red',
      label: ''
    });
    // Configuracion Tooltips
    this.configLineaConsumption.options.tooltips = this.GetToolTipConfig('IFO'); // Revisar para mejorar el tooltips viaje, puerto, mes, dias.

    // Agregamos la configuracion de las escalas.
    this.configLineaConsumption.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaConsumption.lineaMax, 0) + 2);
    //

    this.chartLineConsumption.update();

    return false;
  }


  private UpdateLineSPEED_MGO(): boolean {
    console.log('UpdateLineSPEED_MGO()');


    // Los label lo pongo vacio por es multi line
    this.configLineaConsumptionMGO.data.labels = this.xLabelReportMGO;

    // Actualizamos la dataSPEED
    // Revisar esto por que ponen datas .datasets[0].data  si la variable es un arreglo de tipo chartPOint
    this.configLineaConsumptionMGO.data.datasets = this.dataConsumptionChartPointMGO;

    // UPDATE title
    this.configLineaConsumptionMGO.options.title.text = this.languageService.GetMessage(this.translateCategory,
      this.isDailyFormule ? 'TITLE_DAILY_COMSUMPTION_MGO' : 'TITLE_COMSUMPTION_MGO'
    )

    // Vaciamos la configuracion de las lines SPEED
    // La linea es el campo que agregamos en el plugin.
    this.configLineaConsumptionMGO.options.lines = [];

    this.configLineaConsumptionMGO.options.lines.push({
      type: 'horizontal',
      y: 12,// this.selectUser.maxSpeed,
      color: 'red',
      label: ''
    });
    // Configuracion Tooltips
    this.configLineaConsumptionMGO.options.tooltips = this.GetToolTipConfig('MGO'); // Revisar para mejorar el tooltips viaje, puerto, mes, dias.

    // Agregamos la configuracion de las escalas.
    this.configLineaConsumptionMGO.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaConsumption.lineaMax, 0) + 2);
    //

    this.chartLineConsumptionMGO.update();

    return false;
  }


  private GetToolTipConfig(configIFOorMGOorSPEED): Chart.ChartTooltipOptions {
    // resultado de tooltip
    let tooltips: Chart.ChartTooltipOptions;

    return tooltips = {
      // Establece qué elementos aparecen en la información sobre herramientas.
      mode: 'nearest',
      // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
      intersect: false,
      callbacks: {

        //  label: (tooltipItem: Chart.ChartTooltipItem, data: Chart.ChartData) => {

        // },
        footer: (tooltipItem: Chart.ChartTooltipItem[], data: Chart.ChartData) => {


          // Obtenemos la posicion del item.
          let index = tooltipItem[0].index;
          // Obtenemos la posicion index dentro de la data de chart
          let positionDataset = tooltipItem[0].datasetIndex;

          // Obtenemos la data del la linea correspondiente
          let dataConsumptionChartPoint = this.dataConsumptionChartPoint[positionDataset].data;

          // Obtenemos la ubicacion que no sotros guardamos.
          let positionArrayData = dataConsumptionChartPoint[index].ubication;

          // Reporte por viaje por dia.
          let reportVoyagePortDaily = this.listGetReportVoyagePortDaily[positionArrayData];
          /* 
                  
                  let result =
                  `
                  Time : ${reportVoyagePortDaily.steamingTime} \n
                  Distance :  ${reportVoyagePortDaily.distance}
                  `;
          */
          let
            result = 'Time : ' + reportVoyagePortDaily.steamingTime;
          result += '\nDistance : ' + reportVoyagePortDaily.distance;
          result += `\nT.Reports : ` + reportVoyagePortDaily.countReports;
          result += `\nT.Ports : ` + reportVoyagePortDaily.countPorts;
          result += `\nFrom : ${reportVoyagePortDaily.dayStart} to ${reportVoyagePortDaily.dayEnd}`;
          result += `\nARRIVAL : ${reportVoyagePortDaily.arrivalPort}`;
          result += `\nDeparture : ${reportVoyagePortDaily.departurePort}`;

          return result;
        }
      }
    };
  }

  private ConfigScales(dataReport: Date[], isSpeed?: boolean, lineaMax?: number) {

    // Variable que retornara la configuracion
    let config: any = {
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
        type: '',// ES SE MODIFICA ABAJO // 'category' or 'time'
        //  time: {} // Se modificara abajo.
        ticks: {
          beginAtZero: true,
          fontColor: '#b8d1ff',
        },
        position: 'bottom', // NO QUE HACE ESTO
        gridLines: {
          display: true,
          color: '#b8d1ff'
        },
      }]
    };

    if (this.selectSummaryBy === 'VOYAGES' || this.selectSummaryBy === 'PORTS') {

      config.xAxes[0].type = 'category';

    } else if (this.selectSummaryBy === 'MONTHS') {

      config.xAxes[0].type = 'time';
      config.xAxes[0].time = {
        displayFormats: {
          day: 'MM/YY'
        },
        tooltipFormat: 'MM/DD/YY',
        unit: 'month'
      }

    } else if (this.selectSummaryBy === 'DAYS') {

      config.xAxes[0].type = 'time';
      config.xAxes[0].time = {
        displayFormats: {
          day: 'MM/DD'
        },
        tooltipFormat: 'MM/DD/YY',
        unit: 'day'

      }

    }

    return config;
  }

  // Obtenemos el consumo total por actividades
  private GetTotalConsumptionByActivityFilterByUserIdAndDateAndType(userId: number, startDate: string, endDate: string, typeSummary: string): Observable<InfoReport_IFO_AND_MGO> {

    // Invocamos la consulta para obtener el consumo total por actividad.
    return this._dailyReportService.GetTotalConsumptionByActivityFilterByUserIdAndDateAndType(userId, startDate, endDate, typeSummary).pipe(map(
      (resultGetROBByUser: InfoReport_IFO_AND_MGO) => {

        if (!resultGetROBByUser) throw 'ERROR_GetTotalByActivityFilterByUserIdAndDateAndType';


        return resultGetROBByUser;
      }
    ));

  }


  public errorHandling = (control: string, error: string) => {
    return this.formFilter.controls[control].hasError(error);
  }


  /* Reactive form */
  private ReactiveForm(initialize?: boolean, clearValidate?: boolean, enableForm?: boolean, getForm?: boolean, setForm?: boolean, validate?: boolean): boolean {
    console.log('ReactiveForm()');

    // Inicializamos el formFilter, si lo hacemos 2 proboca error, creao que deberia ser con un update
    if (initialize) {
      this.formFilter = this.fb.group({
        typeSummaryVoyage: ['', [Validators.required]],
        selectUserId: ['', [Validators.required]],
        selectedYears: [[], [Validators.required]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
      });
    }

    // reseteamos la configuracion
    if (clearValidate) {
      this.formFilter.reset({ onlySelf: true });
    }


    // Habilitamos el formulario
    if (enableForm) {
      this.formFilter.enable();
    } else {
      this.formFilter.disable();
    }

    // Obtenemos los valores del formulario
    if (getForm) {
      this.selectSummaryBy = this.formFilter.controls['typeSummaryVoyage'].value;
      this.selectUserId = this.formFilter.controls['selectUserId'].value;
      this.selectedYears = this.formFilter.controls['selectedYears'].value;
      this.startDate = this.formFilter.controls['startDate'].value;
      this.endDate = this.formFilter.controls['endDate'].value;
    }

    // Seteamos los valores del formulario con los datos del user.
    if (setForm) {
      this.formFilter.controls['typeSummaryVoyage'].setValue(this.selectSummaryBy);
      this.formFilter.controls['selectUserId'].setValue(this.selectUserId);
      this.formFilter.controls['selectedYears'].setValue(this.selectedYears);
      this.formFilter.controls['startDate'].setValue(this.startDate);
      this.formFilter.controls['endDate'].setValue(this.endDate);
    }

    // Validamos si el stado del formulario es VALID
    if (validate) {
      this.formFilter.markAllAsTouched();
      return this.formFilter.status == 'VALID';
    }

    return true;
  }


  // Agrega o actuliza la data segun lo que le indiquemos desde los parametros.
  // Estos valores son agregados al arreglo de listTable.
  public AddOrUpdateDataTableList(iGetReportVoyagePortDaily: GetReportVoyagePortDaily, ubication: number): boolean {
    // el objeto donde trabajaremos.
    let dataTable = {
      id: 0,
      title: '',
      activities: new ActivityPerformed(),
      ubication: 0
    }

    let typeSumary = this.selectSummaryBy;
    let indexUbication = 0;

    // el identificador 
    let itemFind = this.listTableSpeedByVoyage.find(
      (item, index) => {
        if (item.id == iGetReportVoyagePortDaily.voyageId) {

          indexUbication = index;
          return true;
        } else {
          return false;
        }
      });


    // Si existe cargamos los datos que ya  hemos guardado
    if (itemFind) {
      dataTable = this.listTableSpeedByVoyage[indexUbication];
    } else {
      // Actualizamos los datos.
      dataTable.id = iGetReportVoyagePortDaily.voyageId;

      if (typeSumary == 'VOYAGES') {
        dataTable.title = 'V' + iGetReportVoyagePortDaily.voyageNumber + ' Y' + ('' + iGetReportVoyagePortDaily.year).slice(-2);
      } else if (typeSumary == 'PORTS') {
        dataTable.title = 'V' + iGetReportVoyagePortDaily.voyageNumber + ' P' + iGetReportVoyagePortDaily.portNumber + ' Y' + ('' + iGetReportVoyagePortDaily.year).slice(-2);
      } else if (typeSumary == 'MONTHS') {
        dataTable.title = String(iGetReportVoyagePortDaily.date).substring(0, 4)
          + this.aMonthEnglishShort[Number(String(iGetReportVoyagePortDaily.date).slice(-2)) - 1];
      } else if (typeSumary == 'DAYS') {
        dataTable.title = String(iGetReportVoyagePortDaily.date);
      }

    }

    // Calculamos la velocidad.
    let speed = this.formuleService.CalculateSpeed(iGetReportVoyagePortDaily.distance, iGetReportVoyagePortDaily.steamingTime);
    // Agregamos la velocidad a la actividad.
    dataTable.activities[iGetReportVoyagePortDaily.activityPerformed] = this.MathRoundOneDecimal(speed, this.cantDecimal);

    // Si existe, actualizamos el objeto
    if (itemFind) {
      this.listTableSpeedByVoyage[indexUbication] = dataTable;
    } else {
      // Agregamos un nuevo objeto
      this.listTableSpeedByVoyage.push(dataTable);
    }

    return true;
  }

  // Convertir DECIMAL
  public MathRoundOneDecimal(valor, cantDecimales: number) {
    if (!valor) { return 0; }
    let result = mathRound(valor, cantDecimales)
    return result;
  }

  // Selecciona al usuario, 
  // Selecciona su ultimo año,
  // Obtiene todos los datos del reporte.
  // Y lo muestra en los cuadros.
  private async SelectUser(userId: number): Promise<boolean> {

    return await Promise.resolve(true).then(
      result => {

        // Seleccionamos al usuarios segun el selectUserId
        return this.getUsers.find(user => user.id === userId);
      }
    ).then(
      resultUser => {
        // Verificamos que exista el usuario.
        if (!resultUser) { throw 'NO_BUQUE_REGISTER'; }

        // Seleccionamos el usuario.
        this.selectUserId = userId;
        this.selectUser = resultUser;

        // seleccionamos el ulitmo año
        return this.SelectOldYear();
      }
    ).then(
      resultUser => {
        if (!resultUser) throw 'ERROR SELECT AUTO YEAR.';

        // Que se genere en automatico.
        this.ClickClear();

        return true;
      }
    ).then(
      resultUser => {
        if (!resultUser) throw 'ERROR GENERATE DATE FOR FIRSH AND OLD YEAR';


        // Obtenemos los datos escrito en el formulario.
        return this.ReactiveForm(false, false, true, false, true);

      }).then(
        resultReactiveForm => {
          if (!resultReactiveForm) throw 'ERROR REACTIVE FORM.';

          return true;
        })
  }

  // GetUsers: Cargo todos los Users para el listado de Users.
  private GetUsers(user: User): Observable<boolean> {
    // Cada vez que se use getUsers la consola nos avisara.
    console.log('GetUsers(user: User)');

    // Obtenemos todos los usuarios
    return this.userService.GetUsers(user).pipe(map(
      (resultUser: User[]) => {

        // Filtramos para que solos los busques se visualizen
        this.getUsers = resultUser.filter((userItem: User) => {
          if (userItem.role === 'BUQUE') {
            return true;
          }
          return false;
        });

        // Segun el resultado retornamos la respuesta.
        return (resultUser !== null);
      }
    ));

  }


  // SelectComboBuque: Selecciona un buque
  public SelectComboBuque(userId: number) {
    console.log('SelectComboBuque(userId)');

    Promise.resolve(true)
      .then(
        result => {
          // Activamos el loading.
          this.loadingService.Open();

          // Invocamos nuestra funcion SelectUser.
          return this.SelectUser(userId);
        }).then(
          result => {

            // Verificamos que todo este OK.
            if (!result) throw 'ERROR_COMBO_BUQUE';

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
          }
        );

    console.log('FIN SelectComboBuque()');
  }

  // Cuando seleccionamos el año en automatico marcamos el inicio y fin de año para el filtro por fecha.
  private SelectComboYears() {

    console.log('SelectComboYears()');
    // Promise
    Promise.resolve(true).then(
      result => {
        // Obtenemos los valores
        this.ReactiveForm(false, false, true, true, false);
      }
    ).then(
      result => {
        // Generamos las fechas segun el año seleccionado
        this.GenerateDateByThisFishYearAndOldYear(false);

        return true;
      }
    ).then(
      result => {
        this.ReactiveForm(false, false, true, false, true)
      }
    ).catch(
      err => {
        // Manejo el error
        let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, err || 'ERROR'));

        console.error(msg);
        console.dir(err);

        this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
        // Deshabilito el spinner de loading
        this.loadingService.Close();
      });

  }

  // Antiguos años
  private SelectOldYear(): boolean {

    // Obtenemos todos los años del buque seleccionado.
    let years = this.selectUser.years;

    // Ultimo año del buque.
    let OldYearUser: number;

    // Verificamos que tenga almenos un registro, de año.
    if (years && years.length > 0) {
      // Asignamos todos los años a la variable.
      this.yearsOfUsers = years;
      // Seleccionamos el ultimo año.
      OldYearUser = this.yearsOfUsers[years.length - 1];
      this.selectedYears = [OldYearUser];

    } else {
      // Años del usuario esta vacio.
      this.yearsOfUsers = [];
      // Revisar aqui deberia notificar que este buque no tiene años, registrados.
      // Al no tener años registrados no deberia poder permitir registrar reportes ni generar viajes.
      // ni ingresar al modulo voyage.
      throw 'NO_YEARS_REGISTER'; // No existen años registrados.
    };

    return true;
  }
  // Genera año por el priemero y ultimo seleccionado en automatico
  private GenerateDateByThisFishYearAndOldYear(isAutoOnlyIfIsNull: boolean) {
    console.log('GenerateDateByThisFishYearAndOldYear');

    let years = this.selectedYears;
    // Esta fecha se pomdra en la dcondicional.
    let dateStart = '';
    let dateEnd = '';

    // Se debe de seleccionar un año para que se genere el reporte en automatico.
    if (years.length > 0) {
      if (!isAutoOnlyIfIsNull || (isAutoOnlyIfIsNull && !this.startDate)) {
        dateStart = years[0] + '-01-01T00:00:00Z';
        this.startDate = dateStart;
      }
      if (!isAutoOnlyIfIsNull || (isAutoOnlyIfIsNull && !this.endDate)) {
        dateEnd = years[years.length - 1] + '-12-31T23:59:59Z';
        this.endDate = dateEnd;
      }
    } else {
      this.startDate = '';
      this.endDate = '';
      throw 'YOUR_SELECT_YEAR';
    };
  }

  // ClickFilterWithDate(): esta funcion se invoca al dar enter en los filtros por fecha.
  public ClickFilterWithDate() {
    console.log('ClickFilterWithDate()');

    // Iniciamos las promesas.
    Promise.resolve(true).then(
      () => {
        // Si no es valida enviamos error.
        if (!validateDate(this.startDate)) throw 'NULL_START_DATE';
        if (!validateDate(this.endDate)) throw 'NULL_END_DATE';
        // Verificamos que la fecha inicio sea antes que la fecha fin.
        if (IsAfter1Date(this.startDate, this.endDate)) throw 'ERROR_START_DATE';
      }
    )

  }

  // Plugin de para la linea horizontal o vertical
  private PluginChartLine() {

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
              // Verificamos si existe un yAxesID
              let yAxesID = line.yAxesID;
              if (yAxesID) {
                // Si es asi agregamos la linea hacia ese yAxesId
                line.iniCoord[1] = line.endCoord[1] = chartobj.scales[yAxesID].getPixelForValue(line.y);
                line.endCoord[0] = chartobj.chart.width;
                // Solo si enviamos un tamaño especifico, 
                if (line.fontSize) { ctx.font = line.fontSize; }
                if (line.lineWidth) { ctx.lineWidth = line.lineWidth; }
                ctx.fillStyle = line.color;
                if (yAxesID == 'A') {
                  ctx.textAlign = "start";
                  ctx.fillText(line.label, line.iniCoord[0] + 3, line.iniCoord[1] + 10);
                } else if (yAxesID == 'B') {
                  ctx.textAlign = "end";
                  ctx.fillText(line.label, chartobj.chart.width - 3, line.iniCoord[1] - 10);
                }

              } else {
                line.iniCoord[1] = line.endCoord[1] = chartobj.scales['y-axis-0'].getPixelForValue(line.y);
                line.endCoord[0] = chartobj.chart.width;

                ctx.fillStyle = line.color;
                ctx.fillText(line.label, line.iniCoord[0] + 3, line.iniCoord[1] + 3);

              }
            } else if (line.type === 'vertical' && line.x) {
              line.iniCoord[0] = line.endCoord[0] = chartobj.scales['x-axis-0'].getPixelForValue(line.x);
              line.endCoord[1] = chartobj.chart.height;
              ctx.fillStyle = line.color;
              ctx.fillText(line.label, line.iniCoord[0] + 3, line.iniCoord[1] + 3);
            }

            ctx.beginPath();

            // Le sumamos y restamos 18 para que no tape la leyenda.
            ctx.moveTo(line.iniCoord[0] + 18, line.iniCoord[1]);
            ctx.lineTo(line.endCoord[0] - 18, line.endCoord[1]);
            ctx.strokeStyle = line.color;
            ctx.stroke();
          }
        }
      }
    };

    Chart.pluginService.register(chartPluginLineaHorizontal);

  }
}

