import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { Chart } from 'chart.js';
import jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import autoTable, { Cell, CellHookData, RowInput, UserOptions } from 'jspdf-autotable'

import { DailyReport, GetInfoVoyageROBBunkering, GetROBByUser, InfoFuelStartEndForDate, Speed } from '../../../../app/models/daily-report';
import { LoadingService } from '../../../../app/services/loading.service';
import { mathRound } from './../../../../assets/math/math.assets';
import { FormatDate, FormatDateUTCToDateHour, FormatYYYYMMDD, getYear, GetYearFromDate, IsAfter1Date, IsPrevious1Date, TextMonthDayYearFormatYYYYMMDD } from './../../../../assets/moment/moment.assets';
import { Port } from '../../../models/port';
import { User } from '../../../models/user';
import { Voyage } from '../../../models/voyage';
import { LanguageService } from '../../../services/language.service';
import { DialogListReportComponent } from '../dialog-list-report/dialog-list-report.component';
import { GenerateSummaryTableOverallPerformanceAnalisis, GenerateTableSummaryOverallPerformanceAnalisis, GenerateTableTotalSummaryOverallPerformanceAnalisis, SummarySpeedCondition, SummaryVesselPerformanceReport } from '../../../models/dialog-export-pdf';
import { DataChart } from '../../../models/chart';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { DailyReportService } from '../../../services/daily-report.service';

// RXJS
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import * as moment from 'moment';


// Interface de los input del componente.
export interface IDialogExportPdf {
  voyages: Voyage[],
  selectUser: User,
  selectVoyageId: number,
  dateStart: Date,
  dateEnd: Date
}

@Component({
  selector: 'app-dialog-export-pdf',
  templateUrl: './dialog-export-pdf.component.html',
  styleUrls: ['./dialog-export-pdf.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class DialogExportPdfComponent implements OnInit {

  // Constructores para setear valores al componente.
  constructor(
    // Dialog referencia es el mismo.
    public dialogRef: MatDialogRef<DialogExportPdfComponent>,
    // Data que se importara.
    @Inject(MAT_DIALOG_DATA) public data: IDialogExportPdf,
    // servicio de lenguaje.
    private languageService: LanguageService,
    // Servicios de notificaciones.
    private notificationsService: NotificationsService,
    // Loading service.
    private loadingService: LoadingService,
    // Agregamos el servicio del reporte.
    private dailyReportService: DailyReportService,
  ) { }


  // Traducciones
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'dialog';

  // Usuario seleccionado
  public selectUser: User = new User();

  // Seleccionamos el tipo de exportacion que deseamos
  public selectTypeExport: string = '';

  // Que informacion deseas agregar al reporte.
  public addOverallPerformance: boolean = false;
  public addVoyageSummary: boolean = false;
  public addBunkeringInformation: boolean = false;
  public addChartVoyageSummary: boolean = false;

  // Que informacion deseamos agregar
  public addInformationIFO: boolean = false;
  public addInformationMGO: boolean = false;

  // Por maquina
  public addMEIFO: boolean = false;
  public addAXIFO: boolean = false;
  public addBoilerIFO: boolean = false;
  public addOtherIFO: boolean = false;

  public addMEMGO: boolean = false;
  public addAXMGO: boolean = false;
  public addBoilerMGO: boolean = false;
  public addGIMGO: boolean = false;
  public addPPMGO: boolean = false;
  public addOtherMGO: boolean = false;


  // si deseamos agregar algun dato de sailing.
  public addSailingInBallast: boolean = false;
  public addSailingWithLaden: boolean = false;
  public addSailingEconomical: boolean = false;



  // Chart Overall Performance Laden
  public chartOverallPerformanceLaden: DataChart = new DataChart();
  public chartOverallPerformanceBallast: DataChart = new DataChart();

  // el primer paso esta completado, si es asi el segundo paso se habilita.
  public isFirstCompleted: boolean = false;

  // Creamos los View para poder controlar los elementos del html.
  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild('pdfViewerOnDemand') pdfViewerOnDemand: PdfJsViewerComponent;

  // Variable para el pagina 
  public numberPage = 1;

  // Colores
  public colorWhite = '#FFFFFF';
  public colorTextHedear = '#16214D';
  public colorBlueTable1 = '#375f9a';
  public colorBlueTable2 = '#0040d8';
  public colorBlueTable3 = '#001556';
  public colorYellowTransgas = '#FFCD06';
  public colorTextSuccess = '#008000';
  public colorTextWarning = '#ff0000';
  public colorGris = '#ebecec';
  public colorGreen = '#d4e6ff';

  ngOnInit(): void {

    Promise.resolve(true).then(
      result => {

        this.selectTypeExport = 'VESSEL_PERFORMANCE_REPORT';
        // seleccionar usuario.
        this.selectUser = this.data.selectUser;

        this.PluginChartDataLabels();

        return true;
      }
    ).then(
      result => {

        // le damos una tamaño al contenedor del pdf
        let alturaDelViewport = window.innerHeight;
        $('.content-PDF').css({
          height: alturaDelViewport
        });

        // Generamos el ChartOverall
        this.GenerateChartOverallPerformanceLaden();
        this.GenerateChartOverallPerformanceBallast();
        return true;
      }
    ).then(
      result => {
        // Verificamos que la linea speed se halla generado correctamente.
        if (!result) throw 'ERROR_GENERATE_LINE_SPEED';


        return true;
      }
    ).catch(
      err => {
        // Manejo el error
        let msg: string = this.languageService.GetMessage(this.translateCategory, 'ERROR_ON_LOAD');

        console.error(msg);
        console.dir(err);

        this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
        // Deshabilito el spinner de loading
        this.loadingService.Close();
        return true;
      }
    );

  }



  // Cuando le das click al boton exportar pdf
  private async ClickExportPDF() {


    await Promise.resolve(true).then(
      result => {

        // Exportar pdf
        // return this.ExportPDFVesselPerformance(this.data.voyages);
        return true
      }
    ).then(
      result => {
        if (!result) throw 'ERROR_EXPORT_PDF_VESSEL_PERFORMANCE';

        return true;
      }
    ).catch(
      err => {
        // Manejo el error
        let msg: string = this.languageService.GetMessage(this.translateCategory, 'ERROR_ON_LOAD');

        console.error(msg);
        console.dir(err);

        this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
        // Deshabilito el spinner de loading
        this.loadingService.Close();
        return true;
      }
    );


  }

  // Al dar click a Next desde el formulario pasamos al siguiente paso que seria View.
  public async ClickNext() {
    this.CheckFirstCompleted();

    // Solo si esta completado el primer paso verificmaos.
    if (this.isFirstCompleted) {
      // Esperamos unos segundos para que se actualice
      await this.CreateCustomTimeout(0.1)

      // Pasamos al siguiente paso
      this.StepperGoForward();
      // Iniciamos la promesa para generar nuestro PDF
      await Promise.resolve(true).then(
        result => {
          return this.GenerateViewPDF(this.data.voyages);
        }
      ).then(
        result => {
          if (!result) throw 'ERROR_EXPORT_PDF_VESSEL_PERFORMANCE';

          return true;
        }
      ).catch(
        err => {
          // Manejo el error
          let msg: string = this.languageService.GetMessage(this.translateCategory, 'ERROR_ON_LOAD');

          console.error(msg);
          console.dir(err);

          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
          // Deshabilito el spinner de loading
          this.loadingService.Close();
          return true;
        }
      );

    }
  }

  // Verifica si el primer paso esta completado.
  public CheckFirstCompleted() {
    this.isFirstCompleted = !(!(this.addOverallPerformance || this.addVoyageSummary || this.addBunkeringInformation || this.addChartVoyageSummary)
      || !(this.addInformationIFO || this.addInformationMGO)
      || !(this.addSailingInBallast || this.addSailingWithLaden))

  }

  // Paso anter
  private StepperGoBack() {
    this.myStepper.previous();
  }
  // Siguiente paso
  private StepperGoForward() {
    this.myStepper.next();
  }



  // GenerateChartOverallPerformanceLaden : generamos la linea del chart.
  private GenerateChartOverallPerformanceLaden(): boolean {
    console.log('GenerateChartOverallPerformanceLaden()');

    // Agregamos la configuracion del chartIFO.
    this.chartOverallPerformanceLaden.config = {
      type: 'line',
      data: {
        labels: [], // Lo pongo vacio por que en el update se colocara el valor.
        datasets: [{
          label: 'Daily Consumption', // Lo pongo vacio por que en el update se colocara el valor.
          // Le colocamos un id de identidad
          yAxisID: 'A',
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: [], // Lo pongo vacio por que en el update se colocara el valor.
          fill: false,
        }, {
          label: 'Speed AVG', // Lo pongo vacio por que en el update se colocara el valor.
          // Le colocamos un id de identidad
          yAxisID: 'B',
          backgroundColor: 'rgb(249, 46, 3)',
          borderColor: 'rgb(102, 227, 10)',
          data: [], // Lo pongo vacio por que en el update se colocara el valor.
          fill: false,
        }]
      },
      options: {
        // Habilitamos todos los tooltip esten abiertos.
        showAllTooltips: true,
        // Otras opciones dentro del Chart
        legend: {
          // La leyenda es el texto que esta arriva del cuadro.
          display: true,
          labels: {
            fontColor: 'rgb(255,255,255)', // Color de la leyenda.
            fontStyle: 'bold', // Tipo de texto de la leyenda.
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {}, // Lo pongo vacio por que en// Lo pongo vacio por que en el update se colocara el valor.
        scales: {
          // Le agregamos un id a los axes por que podremos 2 dataset con diferentes valores.
          yAxes: [
            {
              id: 'A',
              type: 'linear',
              position: 'left',
            }, {
              id: 'B',
              type: 'linear',
              position: 'right',
            }
          ]
        }
      },
      lineaMax: 0 // Lo pongo cero por que en el update se colocara el valor.
    };

    // Encapculamos el elemento del dom.
    let canvaLineSpeed: any = document.getElementById('lineOverallPerformanceLaden');
    // Convertimos el canvaLineIfo en 2d
    let ctxLineSpeed = canvaLineSpeed.getContext('2d');
    // 
    this.chartOverallPerformanceLaden.chart = new Chart(ctxLineSpeed, this.chartOverallPerformanceLaden.config);

    return true;
  }

  // GenerateChartOverallPerformanceBallast : generamos la linea del chart.
  private GenerateChartOverallPerformanceBallast(): boolean {
    console.log('GenerateChartOverallPerformanceBallast()');

    // Agregamos la configuracion del chartIFO.
    this.chartOverallPerformanceBallast.config = {
      type: 'line',
      data: {
        labels: [], // Lo pongo vacio por que en el update se colocara el valor.
        datasets: [{
          label: 'Daily Consumption', // Lo pongo vacio por que en el update se colocara el valor.
          // Le colocamos un id de identidad
          yAxisID: 'A',
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: [], // Lo pongo vacio por que en el update se colocara el valor.
          fill: false,
        }, {
          label: 'Speed AVG', // Lo pongo vacio por que en el update se colocara el valor.
          // Le colocamos un id de identidad
          yAxisID: 'B',
          backgroundColor: 'rgb(249, 46, 3)',
          borderColor: 'rgb(102, 227, 10)',
          data: [], // Lo pongo vacio por que en el update se colocara el valor.
          fill: false,
        }]
      },
      options: {
        // Habilitamos todos los tooltip esten abiertos.
        showAllTooltips: true,
        // Otras opciones dentro del Chart
        legend: {
          // La leyenda es el texto que esta arriva del cuadro.
          display: true,
          labels: {
            fontColor: 'rgb(255,255,255)', // Color de la leyenda.
            fontStyle: 'bold', // Tipo de texto de la leyenda.
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {}, // Lo pongo vacio por que en// Lo pongo vacio por que en el update se colocara el valor.
        scales: {
          // Le agregamos un id a los axes por que podremos 2 dataset con diferentes valores.
          yAxes: [
            {
              id: 'A',
              type: 'linear',
              position: 'left',
            }, {
              id: 'B',
              type: 'linear',
              position: 'right',
            }
          ]
        }
      },
      lineaMax: 0 // Lo pongo cero por que en el update se colocara el valor.
    };

    // Encapculamos el elemento del dom.
    let canvaLineSpeed: any = document.getElementById('lineOverallPerformanceBallast');
    // Convertimos el canvaLineIfo en 2d
    let ctxLineSpeed = canvaLineSpeed.getContext('2d');
    // 
    this.chartOverallPerformanceBallast.chart = new Chart(ctxLineSpeed, this.chartOverallPerformanceBallast.config);

    return true;
  }

  private async UpdateChartOverallPerformanceLaden(): Promise<boolean> {
    console.log('UpdateChartOverallPerformanceLaden()');

    // Actualizamos los labels
    this.chartOverallPerformanceLaden.config.data.labels = this.chartOverallPerformanceLaden.xLabelReport;

    // Actualizamos la data 
    this.chartOverallPerformanceLaden.config.data.datasets[0].data = this.chartOverallPerformanceLaden.data;

    this.chartOverallPerformanceLaden.config.data.datasets[1].data = this.chartOverallPerformanceLaden.data2;

    // Vaciamos la configuracion de las lines SPEED
    // La linea es el campo que agregamos en el plugin.
    this.chartOverallPerformanceLaden.config.options.lines = [];


    let maxConsumption = 0;
    if (this.addInformationIFO && this.selectUser.sailingLoadConsumptionIFO > maxConsumption) {
      maxConsumption = this.selectUser.sailingLoadConsumptionIFO;
    }
    if (this.addInformationMGO && this.selectUser.sailingLoadConsumptionMGO > maxConsumption) {
      maxConsumption = this.selectUser.sailingLoadConsumptionMGO;
    }

    let fontSizeTitle = (this.chartOverallPerformanceLaden.data.length * 3);
    // El tamaño minimo del font debe ser 14 
    fontSizeTitle = fontSizeTitle > 14 ? fontSizeTitle : 14;

    // grosor de l alinea.
    let AxesLineWidth = this.MathRoundDecimal(fontSizeTitle / 9, 0);

    this.chartOverallPerformanceLaden.config.data.datasets[0].borderWidth = this.MathRoundDecimal(fontSizeTitle / 7, 0);
    this.chartOverallPerformanceLaden.config.data.datasets[1].borderWidth = this.MathRoundDecimal(fontSizeTitle / 7, 0);

    // Si el consumo maximo es mayor a 0 lo pintamos si no, no haria falta.
    if (maxConsumption) {
      this.chartOverallPerformanceLaden.config.options.lines.push({
        yAxesID: 'A',
        type: 'horizontal',
        y: maxConsumption,
        color: 'red',
        label: '      Max',
        fontSize: (fontSizeTitle - (fontSizeTitle * 0.2)) + 'px Arial',
        lineWidth: AxesLineWidth
      });
    };

    let maxSpeed = 0;


    if (this.addInformationIFO && this.selectUser.contractSpeedSailingLadenIFO > maxSpeed) {
      maxSpeed = this.selectUser.contractSpeedSailingLadenIFO;
    }
    if (this.addInformationMGO && this.selectUser.contractSpeedSailingLadenMGO > maxSpeed) {
      maxSpeed = this.selectUser.contractSpeedSailingLadenMGO;
    }
    // Si el consumo maximo es mayor a 0 lo pintamos si no, no haria falta.
    if (maxSpeed) {
      this.chartOverallPerformanceLaden.config.options.lines.push({
        yAxesID: 'B',
        type: 'horizontal',
        y: maxSpeed,
        color: '#39FF14',
        label: 'Min      ',
        fontSize: (fontSizeTitle - (fontSizeTitle * 0.2)) + 'px Arial',
        lineWidth: AxesLineWidth
      });
    };

    // Configuracion Tooltips
    this.chartOverallPerformanceLaden.config.options.tooltips = this.GetToolTipConfig('OverallPerformanceLaden');

    if (this.chartOverallPerformanceLaden.config.lineaMax < this.selectUser.sailingBallastConsumptionIFO) {
      this.chartOverallPerformanceLaden.config.lineaMax = this.selectUser.sailingBallastConsumptionIFO;
    }

    this.chartOverallPerformanceLaden.config.options.legend = {
      display: true,
      labels: {
        fontSize: fontSizeTitle,
        fontStyle: "bold",
        fontColor: '#b8d1ff'
      }
    };


    // Agregamos la configuracion de las escalas.
    this.chartOverallPerformanceLaden.config.options.scales = this.ConfigScales(this.chartOverallPerformanceLaden.xLabelReport, true, mathRound(this.chartOverallPerformanceLaden.config.lineaMax, 0) + 2, fontSizeTitle);

    await this.chartOverallPerformanceLaden.chart.update();
    return true;
  }


  private async UpdateChartOverallPerformanceBallast(): Promise<boolean> {
    console.log('UpdateChartOverallPerformanceBallast()');

    // Actualizamos los labels
    this.chartOverallPerformanceBallast.config.data.labels = this.chartOverallPerformanceBallast.xLabelReport;

    // Actualizamos la data 
    this.chartOverallPerformanceBallast.config.data.datasets[0].data = this.chartOverallPerformanceBallast.data;

    this.chartOverallPerformanceBallast.config.data.datasets[1].data = this.chartOverallPerformanceBallast.data2;

    // Vaciamos la configuracion de las lines SPEED
    // La linea es el campo que agregamos en el plugin.
    this.chartOverallPerformanceBallast.config.options.lines = [];


    let maxConsumption = 0;
    // Verificamos quien tiene el mayor consumo
    if (this.addInformationIFO && this.selectUser.sailingBallastConsumptionIFO > maxConsumption) {
      maxConsumption = this.selectUser.sailingBallastConsumptionIFO;
    }

    if (this.addInformationMGO && this.selectUser.sailingBallastConsumptionMGO > maxConsumption) {
      maxConsumption = this.selectUser.sailingBallastConsumptionMGO;
    }


    let fontSizeTitle = (this.chartOverallPerformanceBallast.data.length * 3);
    // El tamaño minimo del font debe ser 14 
    fontSizeTitle = fontSizeTitle > 14 ? fontSizeTitle : 14;

    // grosor de l alinea.
    let AxesLineWidth = this.MathRoundDecimal(fontSizeTitle / 9, 0);

    this.chartOverallPerformanceBallast.config.data.datasets[0].borderWidth = this.MathRoundDecimal(fontSizeTitle / 7, 0);
    this.chartOverallPerformanceBallast.config.data.datasets[1].borderWidth = this.MathRoundDecimal(fontSizeTitle / 7, 0);

    // Si el consumo maximo es mayor a 0 lo pintamos si no, no haria falta.
    if (maxConsumption) {
      this.chartOverallPerformanceBallast.config.options.lines.push({
        yAxesID: 'A',
        type: 'horizontal',
        y: maxConsumption,
        color: 'red',
        label: '      Max',
        fontSize: (fontSizeTitle - (fontSizeTitle * 0.2)) + 'px Arial',
        lineWidth: AxesLineWidth
      });
    };

    let maxSpeed = 0;
    // Verificamos quien tiene el mayor consumo
    if (this.selectUser.contractSpeedSailingBallastIFO > maxSpeed) {
      maxSpeed = this.selectUser.contractSpeedSailingBallastIFO;
    }

    if (this.selectUser.contractSpeedSailingBallastMGO > maxSpeed) {
      maxConsumption = this.selectUser.contractSpeedSailingBallastMGO;
    }

    // Si el consumo maximo es mayor a 0 lo pintamos si no, no haria falta.
    if (maxSpeed) {
      this.chartOverallPerformanceBallast.config.options.lines.push({
        yAxesID: 'B',
        type: 'horizontal',
        y: maxSpeed,
        color: '#39FF14',
        label: 'Min      ',
        fontSize: (fontSizeTitle - (fontSizeTitle * 0.2)) + 'px Arial',
        lineWidth: AxesLineWidth
      });
    };

    // Configuracion Tooltips
    this.chartOverallPerformanceBallast.config.options.tooltips = this.GetToolTipConfig('OverallPerformanceBallast');

    if (this.chartOverallPerformanceBallast.config.lineaMax < this.selectUser.sailingBallastConsumptionIFO) {
      this.chartOverallPerformanceBallast.config.lineaMax = this.selectUser.sailingBallastConsumptionIFO;
    }

    this.chartOverallPerformanceBallast.config.options.legend = {
      display: true,
      labels: {
        fontSize: fontSizeTitle,
        fontStyle: "bold",
        fontColor: '#b8d1ff'
      }
    };


    // Agregamos la configuracion de las escalas.
    this.chartOverallPerformanceBallast.config.options.scales = this.ConfigScales(this.chartOverallPerformanceBallast.xLabelReport, true, mathRound(this.chartOverallPerformanceBallast.config.lineaMax, 0) + 2, fontSizeTitle);

    await this.chartOverallPerformanceBallast.chart.update();
    return true;
  }


  private GetToolTipConfig(configIFOorMGOorSPEED): Chart.ChartTooltipOptions {
    console.log('GetToolTipConfig(configIFOorMGOorSPEED)');

    // resultado de tooltip
    let tooltips: Chart.ChartTooltipOptions;

    // Revisar la configuracion del Tooltip, podriamos hacerlo mas pequeño.
    return tooltips = {
      // Establece qué elementos aparecen en la información sobre herramientas.
      mode: 'nearest',
      // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
      intersect: false,
      callbacks: {
        title: (tooltipItem: Chart.ChartTooltipItem[], data: Chart.ChartData) => {

          // Obtenemos la posicion del item.
          let index = tooltipItem[0].index;

          // Resultado que se mostrara en el titulo.
          let result: any = '';

          // DataSets.
          let dataSets: Chart.ChartDataSets = data.datasets[0];
          let chartPoint: Chart.ChartPoint = <Chart.ChartPoint>dataSets.data[index];

          // dos veces estamos aplicando el formato.
          result = chartPoint.x;

          return result;
        },
        label: (tooltipItem: Chart.ChartTooltipItem, data: Chart.ChartData) => {
          // No pondremos label.
          // En este tooltip se mostrara consumo y viaje.
          return '';
        },
        footer: (tooltipItem: Chart.ChartTooltipItem[], data: Chart.ChartData) => {
          // Obtenemos la posicion del item.
          let index = tooltipItem[0].index;

          // Resultado que se mostrara en el titulo.
          let result = [];
          if (configIFOorMGOorSPEED === 'OverallPerformanceLaden') {

            // DataSets.
            let dataSets: Chart.ChartDataSets = data.datasets[0];
            let chartPoint: Chart.ChartPoint = <Chart.ChartPoint>dataSets.data[index];

            let typeConsumptionSelectBuqueIFO = (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO');

            result.push('Daily Consump.: ' + mathRound(Number(chartPoint.y), 1) + ' mt');
            result.push('T. Consump.: ' + mathRound(chartPoint.totalConsumptionIFO + chartPoint.totalConsumptionMGO, 2) + ' mt');
            result.push('T. Time: ' + mathRound(chartPoint.speed.steamingTime, 2) + ' hrs');
            result.push('T. Distan.: ' + mathRound(chartPoint.speed.distance, 2) + ' mi');
            result.push('Speed AVG: ' + mathRound(chartPoint.speed.distance / chartPoint.speed.steamingTime, 2) + ' kn');
          } else if (configIFOorMGOorSPEED === 'OverallPerformanceBallast') {

            // DataSets.
            let dataSets: Chart.ChartDataSets = data.datasets[0];
            let chartPoint: Chart.ChartPoint = <Chart.ChartPoint>dataSets.data[index];

            let typeConsumptionSelectBuqueIFO = (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO');

            result.push('Daily Consump.: ' + mathRound(Number(chartPoint.y), 1) + ' mt');
            result.push('T. Consump.: ' + mathRound(chartPoint.totalConsumptionIFO + chartPoint.totalConsumptionMGO, 2) + ' mt');
            result.push('T. Time: ' + mathRound(chartPoint.speed.steamingTime, 2) + ' hrs');
            result.push('T. Distan.: ' + mathRound(chartPoint.speed.distance, 2) + ' mi');
            result.push('Speed AVG: ' + mathRound(chartPoint.speed.distance / chartPoint.speed.steamingTime, 2) + ' kn');
          } else {

            // DataSets.
            let dataSets: Chart.ChartDataSets = data.datasets[0];
            let chartPoint: Chart.ChartPoint = <Chart.ChartPoint>dataSets.data[index];
            let ubication = chartPoint.ubication;


            // Revisar esto lo podriamos desaparecer si se lo agregamos al
            // GenerateDataChart, los datos de la actividad y observaciones podrian estar en un atributo.
            let dataExtra = chartPoint.dataExtra;

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




            if (chartPoint.speed.steamingTime > 0) {
              result.push('T. Time : ' + mathRound(chartPoint.speed.steamingTime, 2));
            }
            if (chartPoint.speed.distance > 0) {
              result.push('T. Distance : ' + mathRound(chartPoint.speed.distance, 2));
            }

            if (configIFOorMGOorSPEED == 'IFO') {

              if (chartPoint.totalConsumptionIFO > 0) {
                result.push('T. Consumption : ' + mathRound(chartPoint.totalConsumptionIFO, 2));
              }

            }


          }
          return result;

        },
      }
    }

  }

  // Configuracaion Axes si son menos de 60 registro que muestre los dias caso contrario que muestre los meses
  // esta configuracion depente del selectSummary
  private ConfigScales(dataReport: Date[], isSpeed?: boolean, lineaMax?: number, ticksFontSize?: number) {

    // Variable que retornara la configuracion
    let config: any = {
      xAxes: [{
        ticks: {
          //only show large font size for 'Blue'
          fontSize: ticksFontSize - (ticksFontSize * 0.2),
          fontColor: '#b8d1ff',
        },
        gridLines: {
          display: true,
          color: '#b8d1ff'
        },
      }],
      yAxes: [
        {
          id: 'A',
          position: 'left',
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
            max: lineaMax,
            fontSize: ticksFontSize - (ticksFontSize * 0.2)
          },
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
          scaleLabel: {
            display: true,
            labelString: 'Consumption (MT)',
            fontSize: ticksFontSize - (ticksFontSize * 0.1),
            fontStyle: "bold",
            fontColor: '#b8d1ff',
          }
        },
        {
          id: 'B',
          position: 'right',
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
            max: lineaMax,
            fontSize: ticksFontSize - (ticksFontSize * 0.2)
          },
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
          scaleLabel: {
            display: true,
            labelString: 'Speed (KN)',
            fontSize: ticksFontSize - (ticksFontSize * 0.1),
            fontStyle: "bold",
            fontColor: '#b8d1ff',
          }
        }
      ]
    };

    /* config.xAxes[0].type = 'time';
    config.xAxes[0].time = {

      displayFormats: {
        day: 'MM/DD/YYYY'
      },
      tooltipFormat: 'MM/DD/YY',
      unit: 'day',

    } */


    return config;
  }

  // Obtiene el primer y ultimo reporte ingresado.
  private GetStartReportAndEndReportThePort(port: Port): any {

    let startReport: DailyReport;
    let endReport: DailyReport;

    if (port && port.dailyReports && port.dailyReports.length > 0) {

      startReport = port.dailyReports[0];
      endReport = port.dailyReports[port.dailyReports.length - 1];

    } else {
      throw 'There are no reports registered in this port.'
    }



    return {
      startReport: startReport,
      endReport: endReport,
    }

  }


  private SumaIfo(report: DailyReport): number {
    let ifo = report.mplaIfo + report.auxIfo + report.boilerIfo + report.otherIfo;
    return ifo;
  }

  private SumaMgo(report: DailyReport): number {
    let mgo = report.mplaMgo + report.auxMgo + report.boilerMgo + report.ppMgo + report.giMgo + report.otherMgo;
    return mgo;
  }

  public MathRoundDecimal(valor, cantDecimales: number) {

    if (!valor) { return 0; }

    let result = mathRound(valor, cantDecimales || 0)

    return result;
  }


  // Plugin de open tooltip
  private PluginChartDataLabels() {


    Chart.pluginService.register({
      beforeRender: function (chart: any) {
        if (chart.config.options.showAllTooltips) {
          // create an array of tooltips
          // we can't use the chart tooltip because there is only one tooltip per chart
          chart.pluginTooltips = [];
          chart.config.data.datasets.forEach(function (dataset, i) {

            // Solo quiero que muestre los tooltip de la primera linea.
            if (i === 0) {
              chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                // @ts-ignore
                chart.pluginTooltips.push(new Chart.Tooltip({
                  _chart: chart.chart,
                  _chartInstance: chart,
                  _data: chart.data,
                  _options: chart.options.tooltips,
                  _active: [sector]
                }, chart));
              });
            }

          });

          // turn off normal tooltips
          chart.options.tooltips.enabled = false;
        }
      },
      afterDraw: function (chart: any, easing) {
        if (chart.config.options.showAllTooltips) {
          // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
          if (!chart.allTooltipsOnce) {
            if (Number(easing) !== 1)
              return;
            chart.allTooltipsOnce = true;
          }

          // turn on tooltips
          chart.options.tooltips.enabled = true;
          Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
            tooltip.initialize();
            tooltip.update();
            // we don't actually need this since we are not animating tooltips
            tooltip.pivot();
            tooltip.transition(easing).draw();
          });
          chart.options.tooltips.enabled = false;
        }
      }
    })

  }



  // ExportPDFVesselPerformance() esta funcion genera el pdf.
  private async GenerateViewPDF(voyages: Voyage[]): Promise<boolean> {

    // Parseamos los viajes para que no se modifique.
    let parseVoyages: Voyage[] = JSON.parse(JSON.stringify(voyages));

    // Armamos el objeto de JSPDF
    const doc = new jsPDF();

    let sVPR: SummaryVesselPerformanceReport = new SummaryVesselPerformanceReport();

    // tamaño de pdf.
    const widthPDF = doc.internal.pageSize.getWidth();
    const heightPDF = doc.internal.pageSize.getHeight();

    let rolTraslate = this.languageService.GetMessage(this.translateCategory, this.selectUser.role);

    // Rango de fecha de inicio y fin
    // Esta variable nos ayudara saber cuando si nicio el reporte y cuando termino.
    let generalStartDate: String;
    let generalEndDate: String;

    // Resumen de todo el viaje.
    sVPR.logoTransgas = './assets/icons/logotransgas.png';
    sVPR.titleDocument = 'Vessel Performance Report';
    sVPR.preparedFor = rolTraslate + ' ' + this.selectUser.name;

    // Objeto del cuadro de resumen
    let gTTSOPA: GenerateTableTotalSummaryOverallPerformanceAnalisis = new GenerateTableTotalSummaryOverallPerformanceAnalisis();

    // Lista del resumen de viaje.
    let listGTSOPA_Ballast: GenerateTableSummaryOverallPerformanceAnalisis[] = [];
    let listGTSOPA_Laden: GenerateTableSummaryOverallPerformanceAnalisis[] = [];

    // Esta variable contendra todos los viajes.
    let listSummaryByVoyage: Voyage[] = [];

    // Reset los datos del label y la data del chart
    this.chartOverallPerformanceLaden.xLabelReport = [];
    this.chartOverallPerformanceLaden.data = [];
    this.chartOverallPerformanceLaden.data2 = [];

    // Reset los datos del label y la data del chart
    this.chartOverallPerformanceBallast.xLabelReport = [];
    this.chartOverallPerformanceBallast.data = [];
    this.chartOverallPerformanceBallast.data2 = [];

    // reset la info de info de combustible.
    let getInfoFuelStartEndByFilterDate: InfoFuelStartEndForDate = new InfoFuelStartEndForDate();
    // esta variable tendra toda la informacion del consumo y bunkering que se hizo en el viaje.
    let listGetInfoVoyageROBBunkering: GetInfoVoyageROBBunkering[] = []

    // Inicializamos sincrono.
    return await Promise.resolve(true)
      .then(
        result => {

          // Abrimos el componente Loading.
          this.loadingService.Open();

          // Recorremos todos los viajes.
          parseVoyages.forEach(
            voyage => {
              // Resumen de viaje, lo lo agregaremos al arreglo
              let gTSOPA_Ballast: GenerateTableSummaryOverallPerformanceAnalisis = new GenerateTableSummaryOverallPerformanceAnalisis();
              let gTSOPA_Laden: GenerateTableSummaryOverallPerformanceAnalisis = new GenerateTableSummaryOverallPerformanceAnalisis();


              // Esta variable nos ayudara para saber si ya contamos el viaje, una vez que lo sumamos lo ponemos false;
              let isNewVoyage: boolean = true;

              // esta variable obtendra los nuevos viajes.
              let newVoyage: Voyage = new Voyage();
              if (voyage.status) {

                // Agregamos el id y el numero del viaje.
                // BALLAST
                gTSOPA_Ballast.voyageId = voyage.id;
                gTSOPA_Ballast.voyageNumber = voyage.voyageNumber;
                // LADEN
                gTSOPA_Laden.voyageId = voyage.id;
                gTSOPA_Laden.voyageNumber = voyage.voyageNumber;


                // Recorremos todos los puertos
                voyage.ports.forEach(
                  port => {

                    // Esta variable nos ayudara para saber si ya contamos el puerto, una vez que lo sumamos lo ponemos false;
                    let isNewPort: boolean = true;
                    if (port.status) {

                      // recorremos todos los reportes
                      port.dailyReports.forEach(
                        dailyReport => {
                          if (dailyReport.status) {


                            if (
                              // Verificamos si se desea agregar la informacion de navegando en ballast o Laden
                              (
                                (this.addSailingInBallast && dailyReport.activityPerformed === 'SAILING_IN_BALLAST')
                                || (this.addSailingWithLaden && dailyReport.activityPerformed === 'SAILING_WITH_LADEN')
                                || (this.addSailingEconomical && dailyReport.activityPerformed === 'ECONOMICAL_NAVIGATION')
                              )
                              // Verificamos que las dos condiciones sean falsas para decir si el reporte esta dentro del rango de fecha.
                              && !(!IsAfter1Date(dailyReport.date, this.data.dateStart) || !IsPrevious1Date(dailyReport.date, this.data.dateEnd))
                            ) {

                              // Esta variable tienen el total de consumo
                              let totalIFO = this.SumaIfo(dailyReport);
                              let totalMGO = this.SumaMgo(dailyReport);

                              // verificamos que exista un consumo registrado 
                              // ademas que si se desea esa informacion
                              if (
                                (totalIFO && this.addInformationIFO)
                                || (totalMGO && this.addInformationMGO)) {



                                // Verifcamos si tenemos que sumar eli viaje.
                                if (isNewVoyage) {
                                  isNewVoyage = false;
                                  sVPR.totalVoyageSailing += 1;

                                  // Guardamos el ultimo viaje.
                                  sVPR.lastVoyageSailing = voyage.voyageNumber;


                                  // Agregamos los datos del viaje.
                                  newVoyage.id = voyage.id
                                  newVoyage.voyageNumber = voyage.voyageNumber;
                                  newVoyage.status = voyage.status;
                                }
                                // Verificamos si tenemos que sumar el puerto.
                                if (isNewPort) {
                                  isNewPort = false;
                                  sVPR.totalPortSailing += 1;

                                  // Armamos el nuevo puerto.
                                  let portSummary = new Port(port.id, port.userId, port.voyageId, port.portNumber, port.departurePort, port.arrivalPort, port.userIdCreated, port.dateCreated, port.userIdUpdated, port.dateUpdated, port.status);
                                  portSummary.dailyReports = [];
                                  // Agregamos el puerto al viaje.
                                  newVoyage.ports.push(portSummary);
                                }



                                // Nos ubicamos en el ultimo puerto
                                let lengthPort = newVoyage.ports.length;
                                let indexPort = lengthPort - 1;
                                newVoyage.ports[indexPort].dailyReports.push(dailyReport);

                                // Verificamos si es navegando con carga
                                if (this.addSailingInBallast && dailyReport.activityPerformed === 'SAILING_IN_BALLAST') {

                                  // Si existe la actividad in ballast agrego la distancia
                                  sVPR.totalDistanceBallast += dailyReport.distance;

                                  // Solo si hay consumo sumamos el tiempo, distancia y consumo
                                  if (this.addInformationIFO && totalIFO) {
                                    gTSOPA_Ballast.distanceIFO += dailyReport.distance;
                                    gTSOPA_Ballast.consumptionIFO += totalIFO;
                                    gTSOPA_Ballast.timeIFO += dailyReport.steamingTime;

                                    gTTSOPA.distanceIFOBallast += dailyReport.distance;
                                    gTTSOPA.timeIFOBallast += dailyReport.steamingTime;
                                    gTTSOPA.consumptionIFOBallast += totalIFO;
                                  }
                                  if (this.addInformationMGO && totalMGO) {
                                    gTSOPA_Ballast.distanceMGO += dailyReport.distance;
                                    gTSOPA_Ballast.consumptionMGO += totalMGO;
                                    gTSOPA_Ballast.timeMGO += dailyReport.steamingTime;

                                    gTTSOPA.distanceMGOBallast += dailyReport.distance;
                                    gTTSOPA.timeMGOBallast += dailyReport.steamingTime;
                                    gTTSOPA.consumptionMGOBallast += totalMGO;
                                  }




                                  // Verificamos si es la actividad navegando sin carga
                                } else if (this.addSailingWithLaden && dailyReport.activityPerformed === 'SAILING_WITH_LADEN') {

                                  // Si existe la actividad laden agrego la distancia.
                                  sVPR.totalDistanceLaden += dailyReport.distance;

                                  // Solo si hay consumo sumamos el tiempo, distancia y consumo
                                  if (this.addInformationIFO && totalIFO) {
                                    gTSOPA_Laden.distanceIFO += dailyReport.distance;
                                    gTSOPA_Laden.consumptionIFO += totalIFO;
                                    gTSOPA_Laden.timeIFO += dailyReport.steamingTime;

                                    gTTSOPA.distanceIFOLaden += dailyReport.distance;
                                    gTTSOPA.timeIFOLaden += dailyReport.steamingTime;
                                    gTTSOPA.consumptionIFOLaden += totalIFO;
                                  }
                                  if (this.addInformationMGO && totalMGO) {
                                    gTSOPA_Laden.distanceMGO += dailyReport.distance;
                                    gTSOPA_Laden.consumptionMGO += totalMGO;
                                    gTSOPA_Laden.timeMGO += dailyReport.steamingTime;

                                    gTTSOPA.distanceMGOLaden += dailyReport.distance;
                                    gTTSOPA.timeMGOLaden += dailyReport.steamingTime;
                                    gTTSOPA.consumptionMGOLaden += totalMGO;
                                  }

                                } else if (this.addSailingEconomical && dailyReport.activityPerformed === 'ECONOMICAL_NAVIGATION') {

                                }



                              }
                            }






                          }
                        }
                      )

                    }
                  }
                )
                // Verificamos que exista algun puerto para agregalo.
                console.log(newVoyage.ports.length)
                if (newVoyage.ports.length) {
                  listSummaryByVoyage.push(newVoyage);
                }

                // Solo si existen tiempo IFO o MGO
                // Agregamos a la lista
                if (gTSOPA_Ballast.timeIFO || gTSOPA_Ballast.timeMGO) {


                  // AQUI APLICAMOS LAS FORMULAS.

                  if (this.addInformationIFO) {

                    // Time
                    gTSOPA_Ballast.timeIFOCharter = this.selectUser.contractSpeedSailingBallastIFO ?
                      gTSOPA_Ballast.distanceIFO / this.selectUser.contractSpeedSailingBallastIFO : 0;

                    // Velocidad
                    gTSOPA_Ballast.speedIFO = gTSOPA_Ballast.timeIFO ?
                      gTSOPA_Ballast.distanceIFO / gTSOPA_Ballast.timeIFO : 0;

                    // Velocidad Charter
                    gTSOPA_Ballast.speedIFOCharter = this.selectUser.contractSpeedSailingBallastIFO;

                    // DailyConsumption IFO
                    gTSOPA_Ballast.dailyConsumptionIFO = gTSOPA_Ballast.timeIFO ?
                      (gTSOPA_Ballast.consumptionIFO * 24) / gTSOPA_Ballast.timeIFO : 0;

                    // DailyConsumption IFO Charter
                    gTSOPA_Ballast.dailyConsumptionCharterIFO = this.selectUser.sailingBallastConsumptionIFO;

                    // Consumo por charter
                    gTSOPA_Ballast.consumptionIFOCharter = (gTSOPA_Ballast.dailyConsumptionCharterIFO * gTSOPA_Ballast.timeIFOCharter) / 24;

                    // Consumo 
                  }

                  if (this.addInformationMGO) {


                    // Time
                    gTSOPA_Ballast.timeMGOCharter = this.selectUser.contractSpeedSailingBallastMGO ?
                      gTSOPA_Ballast.distanceMGO / this.selectUser.contractSpeedSailingBallastMGO : 0;


                    // Velocidad
                    gTSOPA_Ballast.speedMGO = gTSOPA_Ballast.timeMGO ?
                      gTSOPA_Ballast.distanceMGO / gTSOPA_Ballast.timeMGO : 0;


                    // Velocidad Charter
                    gTSOPA_Ballast.speedMGOCharter = this.selectUser.contractSpeedSailingBallastMGO;


                    // DailyConsumption MGO
                    gTSOPA_Ballast.dailyConsumptionMGO = gTSOPA_Ballast.timeMGO ?
                      (gTSOPA_Ballast.consumptionMGO * 24) / gTSOPA_Ballast.timeMGO : 0;

                    // DailyConsumption MGO Charter
                    gTSOPA_Ballast.dailyConsumptionCharterMGO = this.selectUser.sailingBallastConsumptionMGO;


                    // Consumo por charter
                    gTSOPA_Ballast.consumptionMGOCharter = (gTSOPA_Ballast.dailyConsumptionCharterMGO * gTSOPA_Ballast.timeMGOCharter) / 24;

                  }

                  // Sumamos el consumo IFO y MGO
                  let sumConsumption = (this.addInformationIFO ? gTSOPA_Ballast.consumptionIFO : 0) + (this.addInformationMGO ? gTSOPA_Ballast.consumptionMGO : 0);
                  // SUMAMOS EL TIEMPO
                  let sumTime = (this.addInformationIFO ? gTSOPA_Ballast.timeIFO : 0) + (this.addInformationMGO ? gTSOPA_Ballast.timeMGO : 0)
                  // Calculamos el daily consumption
                  let calcDaily = sumTime ? ((sumConsumption * 24) / sumTime) : 0;

                  let textLabel = 'V' + gTSOPA_Ballast.voyageNumber + '  Y' + voyage.year;
                  // SACAMOS EL DAILYCONSUMPTION
                  this.chartOverallPerformanceBallast.xLabelReport.push(textLabel)

                  let speedBallast = new Speed();
                  speedBallast.distanceIFO = gTSOPA_Ballast.distanceIFO;
                  speedBallast.distanceMGO = gTSOPA_Ballast.distanceMGO;
                  speedBallast.timeOperationIFO = gTSOPA_Ballast.timeIFO;
                  speedBallast.timeOperationMGO = gTSOPA_Ballast.timeMGO;

                  speedBallast.distance = speedBallast.distanceIFO + speedBallast.distanceMGO;
                  speedBallast.steamingTime = speedBallast.timeOperationIFO + speedBallast.timeOperationMGO;

                  this.chartOverallPerformanceBallast.data.push(
                    { x: textLabel, y: this.MathRoundDecimal(calcDaily, 1), totalConsumptionIFO: gTSOPA_Ballast.consumptionIFO, totalConsumptionMGO: gTSOPA_Ballast.consumptionMGO, speed: speedBallast }
                  );

                  // Sumo la distancia y calculo
                  let sumDistance = (this.addInformationIFO ? gTSOPA_Ballast.distanceIFO : 0) + (this.addInformationMGO ? gTSOPA_Ballast.distanceMGO : 0)
                  let calcSpeed = sumTime ? (sumDistance / sumTime) : 0;
                  // Agregar el speed al char Overall
                  this.chartOverallPerformanceBallast.data2.push(
                    { x: textLabel, y: this.MathRoundDecimal(calcSpeed, 1) }
                  );



                  listGTSOPA_Ballast.push(gTSOPA_Ballast)
                }

                if (gTSOPA_Laden.timeIFO || gTSOPA_Laden.timeMGO) {



                  // AQUI APLICAMOS LAS FORMULAS.

                  if (this.addInformationIFO) {

                    // Time
                    gTSOPA_Laden.timeIFOCharter = this.selectUser.contractSpeedSailingLadenIFO ?
                      gTSOPA_Laden.distanceIFO / this.selectUser.contractSpeedSailingLadenIFO : 0;


                    // Velocidad
                    gTSOPA_Laden.speedIFO = gTSOPA_Laden.timeIFO ?
                      gTSOPA_Laden.distanceIFO / gTSOPA_Laden.timeIFO : 0;


                    // Velocidad Charter
                    gTSOPA_Laden.speedIFOCharter = this.selectUser.contractSpeedSailingLadenIFO;


                    // DailyConsumption IFO
                    gTSOPA_Laden.dailyConsumptionIFO = gTSOPA_Laden.timeIFO ?
                      (gTSOPA_Laden.consumptionIFO * 24) / gTSOPA_Laden.timeIFO : 0;

                    // DailyConsumption IFO Charter
                    gTSOPA_Laden.dailyConsumptionCharterIFO = this.selectUser.sailingLoadConsumptionIFO;


                    // Consumo por charter
                    gTSOPA_Laden.consumptionIFOCharter = (gTSOPA_Laden.dailyConsumptionCharterIFO * gTSOPA_Laden.timeIFOCharter) / 24;


                  }

                  if (this.addInformationMGO) {


                    // Time
                    gTSOPA_Laden.timeMGOCharter = this.selectUser.contractSpeedSailingLadenMGO ?
                      gTSOPA_Laden.distanceMGO / this.selectUser.contractSpeedSailingLadenMGO : 0;


                    // Velocidad
                    gTSOPA_Laden.speedMGO = gTSOPA_Laden.timeMGO ?
                      gTSOPA_Laden.distanceMGO / gTSOPA_Laden.timeMGO : 0;


                    // Velocidad Charter
                    gTSOPA_Laden.speedMGOCharter = this.selectUser.contractSpeedSailingLadenMGO;


                    // DailyConsumption MGO
                    gTSOPA_Laden.dailyConsumptionMGO = gTSOPA_Laden.timeMGO ?
                      (gTSOPA_Laden.consumptionMGO * 24) / gTSOPA_Laden.timeMGO : 0;

                    // DailyConsumption MGO Charter
                    gTSOPA_Laden.dailyConsumptionCharterMGO = this.selectUser.sailingLoadConsumptionMGO;


                    // Consumo por charter
                    gTSOPA_Laden.consumptionMGOCharter = (gTSOPA_Laden.dailyConsumptionCharterMGO * gTSOPA_Laden.timeMGOCharter) / 24;

                  }

                  // Sumamos el consumo IFO y MGO
                  let sumConsumption = (this.addInformationIFO ? gTSOPA_Laden.consumptionIFO : 0) + (this.addInformationMGO ? gTSOPA_Laden.consumptionMGO : 0);
                  // SUMAMOS EL TIEMPO
                  let sumTime = (this.addInformationIFO ? gTSOPA_Laden.timeIFO : 0) + (this.addInformationMGO ? gTSOPA_Laden.timeMGO : 0)
                  // Calculamos el daily consumption
                  let calcDaily = sumTime ? ((sumConsumption * 24) / sumTime) : 0;

                  let textLabel = 'V' + gTSOPA_Laden.voyageNumber + '  Y' + voyage.year;
                  // SACAMOS EL DAILYCONSUMPTION
                  this.chartOverallPerformanceLaden.xLabelReport.push(textLabel)

                  let speedLaden = new Speed();
                  speedLaden.distanceIFO = gTSOPA_Laden.distanceIFO;
                  speedLaden.distanceMGO = gTSOPA_Laden.distanceMGO;
                  speedLaden.timeOperationIFO = gTSOPA_Laden.timeIFO;
                  speedLaden.timeOperationMGO = gTSOPA_Laden.timeMGO;

                  speedLaden.distance = speedLaden.distanceIFO + speedLaden.distanceMGO;
                  speedLaden.steamingTime = speedLaden.timeOperationIFO + speedLaden.timeOperationMGO;

                  this.chartOverallPerformanceLaden.data.push(
                    { x: textLabel, y: this.MathRoundDecimal(calcDaily, 1), totalConsumptionIFO: gTSOPA_Laden.consumptionIFO, totalConsumptionMGO: gTSOPA_Laden.consumptionMGO, speed: speedLaden }
                  );

                  // Sumo la distancia y calculo
                  let sumDistance = (this.addInformationIFO ? gTSOPA_Laden.distanceIFO : 0) + (this.addInformationMGO ? gTSOPA_Laden.distanceMGO : 0)
                  let calcSpeed = sumTime ? (sumDistance / sumTime) : 0;
                  // Agregar el speed al char Overall
                  this.chartOverallPerformanceLaden.data2.push(
                    { x: textLabel, y: this.MathRoundDecimal(calcSpeed, 1) }
                  );


                  /*  this.dataIFO.push(
                     { x: day, y: dayliConsumptionIFO, totalConsumptionIFO: totalConsumptionIFO, totalBunkeringIFO: totalBunkeringIFO, totalBunkeringMGO: totalBunkeringMGO, totalVoyage: 1, totalPort: 1, totalReport: 1, speed: newSpeed, dataExtra: dataExtra }
                   ) */
                  listGTSOPA_Laden.push(gTSOPA_Laden)
                }

              }
            }
          );


          // AQUI APLICAMOS LAS FORMULAS.
          // Ballast
          if (this.addSailingInBallast) {

            if (this.addInformationIFO) {
              // Validamos y calculamos el tiempo que debio aver navegado segun la velocidad del charter.
              gTTSOPA.timeCharterIFOBallast = this.selectUser.contractSpeedSailingBallastIFO ?
                gTTSOPA.distanceIFOBallast / this.selectUser.contractSpeedSailingBallastIFO : 0;


              // VELOCIDAD
              gTTSOPA.speedIFOBallast = gTTSOPA.timeIFOBallast ?
                gTTSOPA.distanceIFOBallast / gTTSOPA.timeIFOBallast : 0;


              // Velocidad Charter
              gTTSOPA.speedCharterIFOBallast = this.selectUser.contractSpeedSailingBallastIFO;


              // Daily Consumption IFO
              gTTSOPA.dailyConsumptionIFOBallast = gTTSOPA.timeIFOBallast ?
                (gTTSOPA.consumptionIFOBallast * 24) / gTTSOPA.timeIFOBallast : 0;


              // DailyConsumption IFO Charter
              gTTSOPA.dailyConsumptionCharterIFOBallast = this.selectUser.sailingBallastConsumptionIFO;


              // Consumo por charter
              gTTSOPA.consumptionCharterIFOBallast = (gTTSOPA.dailyConsumptionCharterIFOBallast * gTTSOPA.timeCharterIFOBallast) / 24;



              // Calculamos el time annotate
              gTTSOPA.anotateTimeBallastIFO = gTTSOPA.timeCharterIFOBallast ? gTTSOPA.timeCharterIFOBallast - gTTSOPA.timeIFOBallast : 0;
              gTTSOPA.anotateConsumptionBallastIFO = gTTSOPA.dailyConsumptionCharterIFOBallast ? gTTSOPA.dailyConsumptionCharterIFOBallast - gTTSOPA.dailyConsumptionIFOBallast : 0;

            }
            if (this.addInformationMGO) {
              // Validamos y calculamos el tiempo que debio aver navegado segun la velocidad del charter.
              gTTSOPA.timeCharterMGOBallast = this.selectUser.contractSpeedSailingBallastMGO ?
                gTTSOPA.distanceMGOBallast / this.selectUser.contractSpeedSailingBallastMGO : 0;


              // VELOCIDAD
              gTTSOPA.speedMGOBallast = gTTSOPA.timeMGOBallast ?
                gTTSOPA.distanceMGOBallast / gTTSOPA.timeMGOBallast : 0;


              // Velocidad Charter
              gTTSOPA.speedCharterMGOBallast = this.selectUser.contractSpeedSailingBallastMGO;


              // Daily Consumption MGO
              gTTSOPA.dailyConsumptionMGOBallast = gTTSOPA.timeMGOBallast ?
                (gTTSOPA.consumptionMGOBallast * 24) / gTTSOPA.timeMGOBallast : 0;


              // DailyConsumption MGO Charter
              gTTSOPA.dailyConsumptionCharterMGOBallast = this.selectUser.sailingBallastConsumptionMGO;

              // Consumo por charter
              gTTSOPA.consumptionCharterMGOBallast = (gTTSOPA.dailyConsumptionCharterMGOBallast * gTTSOPA.timeCharterMGOBallast) / 24;



              // Calculamos el time annotate
              gTTSOPA.anotateTimeBallastMGO = gTTSOPA.timeCharterMGOBallast ? gTTSOPA.timeCharterMGOBallast - gTTSOPA.timeMGOBallast : 0;
              gTTSOPA.anotateConsumptionBallastMGO = gTTSOPA.dailyConsumptionCharterMGOBallast ? gTTSOPA.dailyConsumptionCharterMGOBallast - gTTSOPA.dailyConsumptionMGOBallast : 0;
            }
          }
          // Laden
          if (this.addSailingWithLaden) {

            if (this.addInformationIFO) {
              // Validamos y calculamos el tiempo que debio aver navegado segun la velocidad del charter.
              gTTSOPA.timeCharterIFOLaden = this.selectUser.contractSpeedSailingLadenIFO ?
                gTTSOPA.distanceIFOLaden / this.selectUser.contractSpeedSailingLadenIFO : 0;


              // VELOCIDAD
              gTTSOPA.speedIFOLaden = gTTSOPA.timeIFOLaden ?
                gTTSOPA.distanceIFOLaden / gTTSOPA.timeIFOLaden : 0;


              // Velocidad Charter
              gTTSOPA.speedCharterIFOLaden = this.selectUser.contractSpeedSailingLadenIFO;



              // Daily Consumption MGO
              gTTSOPA.dailyConsumptionIFOLaden = gTTSOPA.timeIFOLaden ?
                (gTTSOPA.consumptionIFOLaden * 24) / gTTSOPA.timeIFOLaden : 0;




              // DailyConsumption IFO Charter
              gTTSOPA.dailyConsumptionCharterIFOLaden = this.selectUser.sailingLoadConsumptionIFO;


              // Conusmo diario calculado segun el charter.
              gTTSOPA.consumptionCharterIFOLaden = (gTTSOPA.dailyConsumptionCharterIFOLaden * gTTSOPA.timeCharterIFOLaden) / 24;



              // Anotate TIME
              gTTSOPA.anotateTimeLadenIFO = gTTSOPA.timeCharterIFOLaden ? gTTSOPA.timeCharterIFOLaden - gTTSOPA.timeIFOLaden : 0;

              // Anotate Laden
              gTTSOPA.anotateConsumptionLadenIFO = gTTSOPA.dailyConsumptionCharterIFOLaden ? gTTSOPA.dailyConsumptionCharterIFOLaden - gTTSOPA.dailyConsumptionIFOLaden : 0;

            }
            if (this.addInformationMGO) {
              // Validamos y calculamos el tiempo que debio aver navegado segun la velocidad del charter.
              gTTSOPA.timeCharterMGOLaden = this.selectUser.contractSpeedSailingLadenMGO ?
                gTTSOPA.distanceMGOLaden / this.selectUser.contractSpeedSailingLadenMGO : 0;


              // VELOCIDAD
              gTTSOPA.speedMGOLaden = gTTSOPA.timeMGOLaden ?
                gTTSOPA.distanceMGOLaden / gTTSOPA.timeMGOLaden : 0;


              // Velocidad Charter
              gTTSOPA.speedCharterMGOLaden = this.selectUser.contractSpeedSailingLadenMGO;



              // Daily Consumption MGO
              gTTSOPA.dailyConsumptionMGOLaden = gTTSOPA.timeMGOLaden ?
                (gTTSOPA.consumptionMGOLaden * 24) / gTTSOPA.timeMGOLaden : 0;



              // DailyConsumption MGO Charter
              gTTSOPA.dailyConsumptionCharterMGOLaden = this.selectUser.sailingLoadConsumptionMGO;



              // Consumo MGO Charter
              gTTSOPA.consumptionCharterMGOLaden = (gTTSOPA.dailyConsumptionCharterMGOLaden * gTTSOPA.timeCharterMGOLaden) / 24;

              // Anotate TIME
              gTTSOPA.anotateTimeLadenMGO = gTTSOPA.timeCharterMGOLaden ? gTTSOPA.timeCharterMGOLaden - gTTSOPA.timeMGOLaden : 0;

              // Anotate Laden
              gTTSOPA.anotateConsumptionLadenMGO = gTTSOPA.dailyConsumptionCharterMGOLaden ? gTTSOPA.dailyConsumptionCharterMGOLaden - gTTSOPA.dailyConsumptionMGOLaden : 0;

            }

          }

          gTTSOPA.anotateTimeBallast = gTTSOPA.anotateTimeBallastIFO + gTTSOPA.anotateTimeBallastMGO;
          gTTSOPA.anotateTimeLaden = gTTSOPA.anotateTimeLadenIFO + gTTSOPA.anotateTimeLadenMGO;


          gTTSOPA.anotateConsumptionBallast = gTTSOPA.anotateConsumptionBallastIFO + gTTSOPA.anotateConsumptionBallastMGO;
          gTTSOPA.anotateConsumptionLaden = gTTSOPA.anotateConsumptionLadenIFO + gTTSOPA.anotateConsumptionLadenMGO;


          // Fecha de inicio.
          sVPR.startDate = this.data.dateStart;
          // Fecha del fin.
          sVPR.endDate = this.data.dateEnd;

          // Fecha de inicio.
          sVPR.dateStart = FormatDateUTCToDateHour(sVPR.startDate);
          // Fecha del fin.
          sVPR.dateEnd = FormatDateUTCToDateHour(sVPR.endDate);

          // Agregamos la fecha de inicio y la fecha fin.
          sVPR.atdAndAta = FormatDate(this.data.dateStart) + ' To ' + FormatDate(this.data.dateEnd)

          // Le damos un tamaño a la pagina.
          $('#dash-line-Overall-Performance-Laden').css({
            width: 180 * listGTSOPA_Laden.length,
            height: 99 * listGTSOPA_Laden.length
          });


          // Le damos un tamaño a la pagina.
          $('#dash-line-Overall-Performance-Ballast').css({
            width: 180 * listGTSOPA_Ballast.length,
            height: 99 * listGTSOPA_Ballast.length
          });
          // Actualizamos el chart.
          this.UpdateChartOverallPerformanceLaden();
          this.UpdateChartOverallPerformanceBallast();

          // Buscamos la informacion del combustible de inicio y fin segun la fecha.
          return this.GetInfoFuelStartEndByFilterDate(this.selectUser.id, sVPR.startDate.toString(), sVPR.endDate.toString()).pipe().toPromise();
        })
      .then(
        (resultGetInfoFuelStartEndByFilterDate: InfoFuelStartEndForDate) => {

          // Incio de combustible.
          sVPR.startFuelIFO = resultGetInfoFuelStartEndByFilterDate.infoFuelStart.total_ifo;
          sVPR.startFuelMGO = resultGetInfoFuelStartEndByFilterDate.infoFuelStart.total_mgo;
          // Con cuanto termino
          sVPR.endFuelIFO = resultGetInfoFuelStartEndByFilterDate.infoFuelEnd.total_ifo;
          sVPR.endFuelMGO = resultGetInfoFuelStartEndByFilterDate.infoFuelEnd.total_mgo;

          // Guardamos el resultado.
          getInfoFuelStartEndByFilterDate = resultGetInfoFuelStartEndByFilterDate;

          let dateStart = this.data.dateStart;
          let dateEnd = this.data.dateEnd;

          // Revisar como esta consultando esto.
          // Consultamos la informacion de combustible segun viaje
          return this.GetInfoVoyageROBAndBunkeringByBuqueAndDate(this.selectUser.id, dateStart.toString(), dateEnd.toString()).pipe().toPromise();

        })
      // Primera pagina Resumen total.
      .then(
        (result: GetInfoVoyageROBBunkering[]) => {

          // Guardamos los resultados.
          listGetInfoVoyageROBBunkering = result;

          // Agregamos la primera pagina,
          // El cual tiene resumido todo el reporte.
          // ademas nos retorna la posicion del page.
          let positionHeight = this.AddOnePage(doc, sVPR, gTTSOPA);

          return positionHeight;
        })
      // overall performance
      .then(
        positionHeight => {

          // Se desea agregar el overall performance?
          if (this.addOverallPerformance) {
            // Si se desea agregar el analisis general lo reseteamos en 0 la altura.
            positionHeight = 0;

            // Los dos cuadros entran en una hora
            let isChartInOnePage = false;
            // Calculamos el tamaño que ocupara nuestros cuadros que deseamos agregar.
            let contentTableBallast = 0;
            let contentTableLaden = 0;

            // Agregar viaje Ballast
            if (this.addSailingInBallast) {
              // Le sumamos el espacio de la cabecera de la tabla.
              contentTableBallast += 19.9;
              // Cada fila ocupa lo siguiente.
              contentTableBallast += (6.25 * listGTSOPA_Ballast.length);
              // FOTTER de la tabla
              contentTableBallast += 25.8;
            }

            // Agregar viaje Laden
            if (this.addSailingWithLaden) {
              // Le sumamos el espacio de la cabecera de la tabla.
              contentTableLaden += 19.9;
              // Cada fila ocupa lo siguiente.
              contentTableLaden += (6.25 * listGTSOPA_Laden.length);
              // FOTTER de la tabla
              contentTableLaden += 25.8;
            }

            // El tamaño del header por el momento es 35.
            // El footer 10

            //Entonces 
            if (
              this.addSailingInBallast && this.addSailingWithLaden &&
              (

                // SUMAMOS LO Tamaños por defecto y se lo restamos al tamaño de la hoja.
                (heightPDF - (35 + 10 + 20))
                // esto debe de ser mayor a la suma de los 2 cuadros
                // Para que los dos cuadros entren.
                > (contentTableBallast + contentTableLaden)

              )
            ) {
              // Si es asi le pongo true.
              isChartInOnePage = true;
            }


            // Ahora verificamos si los dos cuadros entrarian en una hoja.
            // La suma de los dos cuadros deben de ser menor al tamaño que nos permite la hoja.


            if (this.addSailingInBallast) {
              // Agregamos una nueva pagina
              doc.addPage();

              let isViewBallast = true;
              let isViewLaden = false;

              positionHeight += 10;
              let positionWidth = 10;
              let title: string = 'Overall Performance Analysis';
              if (isChartInOnePage) {
                title += '(Ballast / Laden)';
              } else {
                title += '(Ballast)';
              }
              // Agregamos la cabecera a la pagina.
              positionHeight = this.AddHeaderPage(doc, widthPDF, positionHeight, title);

              ///////////////////////////////////////
              ///////// Inicio del 1° Cuadro ////////
              ///////////////////////////////////////

              // Colocamos el rectangulo
              //  positionHeight += 5.5;
              positionWidth = 5;
              positionHeight += 10;
              // Generamos todo el resumen por viajes.
              positionHeight += this.GenerateTableOverallPerformanceAnalysis(doc, widthPDF, heightPDF, positionWidth, positionHeight, listGTSOPA_Ballast, gTTSOPA, isViewBallast, isViewLaden);

              // agrgamos 1 al paginador.
              this.AddFoter(doc, widthPDF, heightPDF)
            }
            if (this.addSailingWithLaden) {

              let positionWidth = 0;
              if (!isChartInOnePage) {
                positionHeight = 0;
                doc.addPage();

                positionHeight += 10;
                positionWidth = 10;
                let title: string = 'Overall Performance Analysis (Laden)';
                // Agregamos la cabecera a la pagina.
                positionHeight = this.AddHeaderPage(doc, widthPDF, positionHeight, title);
                this.AddFoter(doc, widthPDF, heightPDF)
                // Le sumo 5 por que abajo le volvere a sumar 5
                positionHeight += 5;
              }
              // Agregamos una nueva pagina
              let isViewBallast = false;
              let isViewLaden = true;

              // Le sumo 5 mas.
              positionHeight += 5;
              positionWidth = 5;
              // Generamos todo el resumen por viajes.
              positionHeight += this.GenerateTableOverallPerformanceAnalysis(doc, widthPDF, heightPDF, positionWidth, positionHeight, listGTSOPA_Laden, gTTSOPA, isViewBallast, isViewLaden);

            }
          }

          return positionHeight;
        }
      )
      // AddChart
      .then(
        (positionHeight: number) => {

          // Verificamos si se desea agregar los graficos.
          if (this.addChartVoyageSummary) {

            // Esta variable nos ayudara a saber si entra en la misma pagina
            let isChartInOnePage: boolean = false;

            // Solo debe estar seleccionado un grafico
            // Caso contrario que agrege una nueva pagina.
            if (
              // solo debe estar seleccionada una actividad.
              !(this.addSailingInBallast && this.addSailingWithLaden)
            ) {

              // un cuadro chart mide 114
              let heightChart = 114
              let heightfooter = 20

              let masEspacioTitle = 10;

              // Sumamos todas las posiciones que que hay para agregar el chart.
              let sumChartPosition = positionHeight + masEspacioTitle + heightChart + heightfooter;

              // La posicion del charth deberia ser menore que el tamaño de la hoja.
              let spaceSobrante = heightPDF > sumChartPosition;

              // Si la suma de la posicion es mayor a 10
              if (heightPDF > sumChartPosition) {
                // le sumamos 10 mas
                // Es el espacion que le dara el titulo.
                positionHeight += masEspacioTitle;
                // Si es asi le pongo true.
                isChartInOnePage = true;
              }

            }

            // Si no entran en una pagina , que se agrege la cabecera y el footer.
            if (!isChartInOnePage) {

              // reset positionHeight
              positionHeight = 0;

              doc.addPage();
              positionHeight += 10;

              let title: string = '';

              // Agregamos la cabecera a la pagina.
              positionHeight = this.AddHeaderPage(doc, widthPDF, positionHeight, title);


              // A la cabecera le sumamos 10
              positionHeight += 5;

              // Si es una nueva pagina, le tenemos que agregar el footer.
              this.AddFoter(doc, widthPDF, heightPDF)
            }

            let positionWidth = 10;



            // Agregamos el cuadro chart.
            return this.AddChart(doc, widthPDF, heightPDF, positionWidth, positionHeight, isChartInOnePage);

          } else {

            // caso contrario continuamos.
            return true;
          }
        }
      )
      // Generamos el resumen de viaje
      .then(
        (result: boolean) => {

          // Inicializamos el height en 0,
          let positionHeight = 0;

          let isViewBallast: boolean = this.addSailingInBallast;
          let isViewLaden: boolean = this.addSailingWithLaden;
          if (this.addVoyageSummary) {
            this.GenerateVoyageSumary(doc, widthPDF, heightPDF, positionHeight, listSummaryByVoyage, isViewBallast, isViewLaden)
          }
          return true;
        }
      )
      // Obtenemos la informacion del Combustible
      .then(
        result => {

          // Inicializamos el height en 0,
          let positionHeight = 0;

          // Se desea agregar informacion de combustible.
          if (this.addBunkeringInformation) {

            doc.addPage();

            // Inicializamos el height en 0,
            positionHeight = 0;

            // El generarl solo es por una actividad.
            let title: string = 'Summary of fuel by voyages';
            let positionWidth = 5;

            positionHeight += 10;
            // Agregamos la cabecera a la pagina.
            positionHeight = this.AddHeaderPage(doc, widthPDF, positionHeight, title);

            // agrgamos 1 al paginador.
            this.AddFoter(doc, widthPDF, heightPDF);

            positionHeight += 10;

            return this.GenerateTableInfoConsumptionBunkering(doc, widthPDF, heightPDF, positionWidth, positionHeight, listGetInfoVoyageROBBunkering, sVPR.startFuelIFO, sVPR.startFuelMGO);
          } else {

            return positionHeight;
          }
        }
      )
      // Obtenemos el blob del doc.
      .then(
        result => {

          // doc.save(this.selectUser.name + ".odt")
          // Convertimos en Blob el html
          return new Blob([doc.output('blob'), 'application/pdf']);
        }
      ).then(
        blobPDF => {

          // Blob Pdf
          if (!blobPDF) alert('ERROR');

          // Agregamos el blob al componente ademas le damos refresh para que se vea.
          this.pdfViewerOnDemand.pdfSrc = blobPDF; // pdfSrc can be Blob or Uint8Array
          this.pdfViewerOnDemand.downloadFileName = this.selectUser.name;
          this.pdfViewerOnDemand.refresh();

          this.loadingService.Close();
          return true;
        }
      );

  }

  // agrega la primera Hoja con el resumen general.
  private AddOnePage(doc: jsPDF, sVPR: SummaryVesselPerformanceReport, gTSOPA: GenerateTableTotalSummaryOverallPerformanceAnalisis): number {
    let typeConsumptionSelectBuqueIFO = (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO');

    // Posicion de altura del height.
    let positionHeight: number = 0;
    // tamaño de pdf.
    const widthPDF = doc.internal.pageSize.getWidth();
    const heightPDF = doc.internal.pageSize.getHeight();

    // Calculamos todo el alto que se pintara para poder centrarlo.
    let contentOnePage: number = 0;
    // Tamaño del logo
    contentOnePage += 65;
    contentOnePage += 10; // titulo
    contentOnePage += 12; // Nombre del buque
    contentOnePage += 14; // Fecha de inicio
    contentOnePage += 6; // Combustible.

    contentOnePage += 10; // Total Voyage o Numero Voyage
    contentOnePage += 8; // Total Port

    contentOnePage += 10; // ATD
    contentOnePage += 6; // combustible fin.
    contentOnePage += 14; // combustible fin.
    contentOnePage += 98.5; //  Table sresumen overall


    // calculamos el tamaño del Contenido de la pagina
    // con el tamaño del pdf y o dividimos para que
    // tenga el mismo margen en la altura y bottom
    positionHeight += (heightPDF - contentOnePage) / 2;
    // Revisar Eliminar esto, es solo com referencia.
    /*     doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.rect(5, positionHeight, widthPDF - (5 * 2), contentOnePage, "FD");
     */
    // ubicamos la imagen con un tamaño de 50 x 50
    let widthImage = 50;
    let heightImage = 50;
    let centerPDF = widthPDF / 2;
    let widthMedium = (widthPDF - 50) / 2;
    doc.addImage(sVPR.logoTransgas, "JPEG", widthMedium, positionHeight, widthImage, heightImage)


    // Agregamos el titulo del pdf
    positionHeight += 65;
    doc.setFontSize(35);
    doc.setTextColor(22, 33, 77);
    doc.setFont('Helvetica', 'bold');
    doc.text(sVPR.titleDocument, widthPDF / 2, positionHeight, { align: 'center' })


    // Preparado por
    positionHeight += 10;
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont('Helvetica', 'bold');
    doc.text('Prepared For:', widthPDF / 2, positionHeight, { align: 'center' })


    // Agregamos el nombre del Buque
    positionHeight += 12;
    doc.setFontSize(30);
    doc.setTextColor(22, 33, 77);
    doc.setFont('Helvetica', 'bold');
    doc.text(sVPR.preparedFor, centerPDF, positionHeight, { align: 'center' })

    // Fecha en el cual inicia el reporte
    positionHeight += 14;
    doc.setFontSize(15);
    doc.setTextColor(40);
    doc.setFont('Helvetica', 'bold');
    doc.text(
      sVPR.dateStart,
      centerPDF, positionHeight,
      { align: 'center' }
    );
    let ROBDateStart = '';
    if (this.addInformationIFO) {
      ROBDateStart = typeConsumptionSelectBuqueIFO + ': ' + sVPR.startFuelIFO;
      if (this.addInformationMGO) { ROBDateStart += '     '; }
    }
    if (this.addInformationMGO) {
      ROBDateStart += 'MGO: ' + sVPR.startFuelMGO;
    }
    positionHeight += 6;
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFont('Helvetica', 'bold');
    doc.text(
      ROBDateStart,
      centerPDF, positionHeight,
      { align: 'center' }
    );
    // Agregamos la cantidad o el numero de viaje.
    positionHeight += 10;
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont('Helvetica', 'bold');
    if (sVPR.totalVoyageSailing > 1) {
      doc.text('Total Voyages Sailed: ' + sVPR.totalVoyageSailing, centerPDF, positionHeight, { align: 'center' })
    } else {
      doc.text('N° Voyage: ' + sVPR.lastVoyageSailing, centerPDF, positionHeight, { align: 'center' })
    }


    // Agregamos el total de puertos que hay en ese viaje.
    positionHeight += 8;
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont('Helvetica', 'bold');
    doc.text('Total Ports Sailed: ' + sVPR.totalPortSailing, centerPDF, positionHeight, { align: 'center' })


    // Fecha del analisi startdate y endDate
    positionHeight += 10;
    doc.setFontSize(15);
    doc.setTextColor(40);
    doc.setFont('Helvetica', 'bold');
    doc.text(
      sVPR.dateEnd,
      centerPDF, positionHeight,
      { align: 'center' }
    );

    let ROBDateEnd = '';
    if (this.addInformationIFO) {
      ROBDateEnd = typeConsumptionSelectBuqueIFO + ': ' + sVPR.endFuelIFO;
      if (this.addInformationMGO) { ROBDateEnd += '     '; }
    }
    if (this.addInformationMGO) {
      ROBDateEnd += 'MGO: ' + sVPR.endFuelMGO;
    }
    positionHeight += 6;
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFont('Helvetica', 'bold');
    doc.text(
      ROBDateEnd,
      centerPDF, positionHeight,
      { align: 'center' }
    );

    positionHeight += 14;
    let positionWidth = 10;

    // Como es el resumen, verificamos que se a
    let isViewBallast = this.addSailingInBallast;
    let isViewLaden = this.addSailingWithLaden;

    let titleTable = 'Overall Performance Analysis';
    this.GenerateTableTotalOverallPerformanceAnalisis(doc, widthPDF, heightPDF, positionWidth, positionHeight, gTSOPA, isViewBallast, isViewLaden, titleTable)

    return positionHeight;
  }


  // Esta funcion agrega el cudro de resumen por viaje.
  private GenerateSummaryTableByVoyage(doc: jsPDF, startY: number, listSummarySpeedCondition: SummarySpeedCondition[]) {
    let titleTable = 'Report Summary - Speed Conditions (Laden, Ballast)';
    // Agregar la formula para saber si es IFO VLSFO LSFO
    let typeConsumptionSelectBuqueIFO = (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO');
    var data: RowInput[] = [

      // Primera Fila titulo
      [{ "content": titleTable, "colSpan": 9 }],
      // Segunda Fila
      [
        { "content": "Departure to Arrival", "colSpan": 2, "rowSpan": 2 },
        { "content": "Condition", "colSpan": 1, "rowSpan": 2 },
        { "content": "Distance\n(MI)", "colSpan": 2 },
        { "content": "Time\n(HRS)", "colSpan": 2 },
        { "content": "Speed\n(AVG)", "colSpan": 2 }
      ],
      [
        { "content": typeConsumptionSelectBuqueIFO, "colSpan": 1 },
        { "content": "MGO", "colSpan": 1 },
        { "content": typeConsumptionSelectBuqueIFO, "colSpan": 1 },
        { "content": "MGO", "colSpan": 1 },
        { "content": typeConsumptionSelectBuqueIFO, "colSpan": 1 },
        { "content": "MGO", "colSpan": 1 }
      ],

    ];

    listSummarySpeedCondition.forEach(summarySpeedCondition => {
      data.push(
        [

          // departure to arrival
          { "content": summarySpeedCondition.departureToArrival, "colSpan": 2, "rowSpan": 1 },
          // Condicion de navegacion
          { "content": summarySpeedCondition.condition + '/eco', "colSpan": 1, "rowSpan": 1 },

          // Distancia
          { "content": summarySpeedCondition.distanceIFO, "colSpan": 1 },
          { "content": summarySpeedCondition.distanceMGO, "colSpan": 1 },

          // Time
          { "content": summarySpeedCondition.timeIFO, "colSpan": 1 },
          { "content": summarySpeedCondition.timeMGO, "colSpan": 1 },

          //Speed
          { "content": summarySpeedCondition.speedIFO, "colSpan": 1 },
          { "content": summarySpeedCondition.speedMGO, "colSpan": 1 }

        ]
      )
    });

    // Opciones como usuario al generar un table.
    let userOptions: UserOptions = {};
    // Agregamos en que altura del documento se puede
    userOptions.startY = startY;
    //userOptions.head = head;
    userOptions.body = data;
    userOptions.margin = { left: 10 }

    userOptions.didParseCell = (data: CellHookData) => {

      let section = data.section;
      let cell: Cell = data.cell;
      if (cell == undefined) { return; }


      if (section == 'body') {
        let rowIndex = data.row.index;
        let columIndex = data.column.index;
        let raw = data.row.raw;
        // Primera cabecera de la tabla Titulo
        if (rowIndex == 0) {

          if (columIndex == 0) {

            cell.styles.fillColor = '#375f9a'
            cell.styles.textColor = '#ffffff';
            cell.styles.fontSize = 10;
          }
        }

        // SEgunda linea
        if (rowIndex == 1) {
          // la primera columna Departure To Arrival, estara alineada en el medio 
          if (columIndex == 0) {
            cell.styles.valign = 'middle';
          }
          // La tercera columna Condition(Laden Blalast) alineada en el medio
          if (columIndex == 2) {
            cell.styles.valign = 'middle';
          }
        }


        // REvisar esto parece que ya no iria.
        if (rowIndex == 5) {
          if (columIndex == 0) {
            cell.styles.valign = 'middle';
          }
        }
        // En la fila 7
        if (rowIndex == 6) {


          if (columIndex == 3) {

            if (Number(cell.text) >= Number(raw[3].content)) {
              cell.styles.fillColor = [133, 252, 97];
            } else {
              cell.styles.fillColor = [255, 123, 123];
            }

          }
          if (columIndex == 6) {
            if (Number(cell.text) <= Number(raw[6].content)) {
              cell.styles.fillColor = [133, 252, 97];
            } else {
              cell.styles.fillColor = [255, 123, 123];
            }
          }

        }
        // Fin de la revision


      }


    };

    userOptions.columnStyles = {
      0: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 55,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      1: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 9,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      2: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 18,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      3: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 18,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      4: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 18,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      5: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 18,
        lineWidth: 0.2,
        lineColor: [22, 33, 77]
      },
      6: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 18,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      7: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 18,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      8: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 18,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      }
    };

    userOptions.headStyles = {
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.15,
      lineColor: [22, 33, 77],
      fillColor: '#375f9a',
      fontSize: 8
    };


    autoTable(doc, userOptions);

  }


  private OverallPerformanceAnalysis(doc: jsPDF, widthPDF: number, heightPDF: number, positionHeight: number, listGTSOPA: GenerateTableSummaryOverallPerformanceAnalisis[], gTTSOPA: GenerateTableTotalSummaryOverallPerformanceAnalisis, isViewBallast: boolean, isViewLaden: boolean) {



  }

  // esta funcion agrega la cabecera al documento.
  private AddHeaderPage(doc: jsPDF, widthPDF: number, positionHeight: number, HeaderTitle: string): number {

    // Posicion del widht de los elementos,
    // Nos ayuda a ubicar en el ancho del documento.
    let positionWidthDragPage = 10;

    //Agregamos el logo.
    // tamaño de la imagen
    let widthImage = 17;
    let heightImage = 17;
    doc.addImage("./assets/icons/logotransgas.png", "JPEG", positionWidthDragPage, positionHeight, widthImage, heightImage);

    // Bajamos un poco para agregar el titulo.
    positionHeight += 5;
    positionWidthDragPage = 60;
    // Texto
    doc.setFontSize(18);
    doc.setTextColor(22, 33, 77);
    doc.setFont('Helvetica', 'bolditalic');
    doc.text("Vessel Performance Report", positionWidthDragPage, positionHeight, { align: 'left' })

    // Debajo del titulo agregamos una linea.
    positionHeight += 2;
    doc.setDrawColor(22, 33, 77);
    doc.setFillColor(22, 33, 77);
    doc.rect(positionWidthDragPage, positionHeight, widthPDF - positionWidthDragPage - 10, 0.5, "FD");

    // Numeros de telefono y correo.
    positionHeight += 10;
    doc.setFontSize(10);
    doc.setTextColor(22, 33, 77);
    doc.setFont('Helvetica', 'bold');
    doc.text("Lima Phone: +51-1-716-7600       Miami Phone: +1 954-575-1414       Email: transgas@transgas.com.pe", widthPDF - 10, positionHeight, { align: 'right' })

    // Raya debajo de los numeros de telefono.
    positionHeight += 2;
    positionWidthDragPage = 10;
    doc.setDrawColor(22, 33, 77);
    doc.setFillColor(22, 33, 77);
    doc.rect(10, positionHeight, widthPDF - 20, 0.5, "FD");



    // Titulo del pdf.
    positionHeight += 6;
    doc.setFontSize(15);
    doc.setTextColor(22, 33, 77);
    doc.setFont('Helvetica', 'bold');
    doc.text(HeaderTitle, widthPDF / 2, positionHeight, { align: 'center' })


    return positionHeight;
  }

  // Genera la tabla performanve.
  private GenerateSummaryTableOverallPerformanceAnalisis(doc: jsPDF, widthPDF: number, heightPDF: number, positionWidth: number, positionHeight: number, gSTOPA: GenerateSummaryTableOverallPerformanceAnalisis) {
    // title
    let titleTable = gSTOPA.title;
    // Agregar la formula para saber si es IFO VLSFO LSFO
    let typeConsumptionSelectBuqueIFO = (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO');
    var data: RowInput[] = [

      // Segunda Fila
      [
        { "content": "Voyage N°" + gSTOPA.numberVoyage + '\n' + "Total Ports " + gSTOPA.totalPort, "colSpan": 2, "rowSpan": 2 },
        { "content": "Laden", "colSpan": 2 },
        { "content": "Charter", "colSpan": 2 },
        { "content": "Ballast", "colSpan": 2 },
        { "content": "Charter", "colSpan": 2 }
      ],
      [
        { "content": typeConsumptionSelectBuqueIFO, "colSpan": 1 },
        { "content": "MGO", "colSpan": 1 },
        { "content": typeConsumptionSelectBuqueIFO, "colSpan": 1 },
        { "content": "MGO", "colSpan": 1 },
        { "content": typeConsumptionSelectBuqueIFO, "colSpan": 1 },
        { "content": "MGO", "colSpan": 1 },
        { "content": typeConsumptionSelectBuqueIFO, "colSpan": 1 },
        { "content": "MGO", "colSpan": 1 }
      ],



      [
        { "content": "Distance", "colSpan": 2 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
      [
        { "content": "Time", "colSpan": 2 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
      [
        { "content": "Consumption", "colSpan": 2 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
      [
        { "content": "Daily Consumption", "colSpan": 2 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
      [
        { "content": "Speed", "colSpan": 2 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
    ];


    // Opciones como usuario al generar un table.
    let userOptions: UserOptions = {};
    // Agregamos en que altura del documento podnra la tabla
    userOptions.startY = positionHeight;
    // estructura del cuerpo
    userOptions.body = data;
    // Margen que tendra nuestra tabla.
    userOptions.margin = { left: positionWidth }
    // Tamaño de nuestra tabla
    userOptions.tableWidth = 136;

    // Recorremos todas las celdas para ponerle un color o un diseño o condicion.
    userOptions.didParseCell = (data: CellHookData) => {

      let section = data.section;
      let cell: Cell = data.cell;
      if (cell == undefined) { return; }


      if (section == 'body') {
        let rowIndex = data.row.index;
        let columIndex = data.column.index;
        let raw = data.row.raw;
        // Primera cabecera de la tabla Titulo
        if (rowIndex == 0) {

          if (columIndex == 0) {

            cell.styles.fillColor = '#375f9a'
            cell.styles.textColor = '#ffffff';
            cell.styles.fontSize = 10;
          }
        }

        // SEgunda linea
        if (rowIndex == 1) {
          // la primera columna Departure To Arrival, estara alineada en el medio 
          if (columIndex == 0) {
            cell.styles.valign = 'middle';
          }
          // La tercera columna Condition(Laden Blalast) alineada en el medio
          if (columIndex == 2) {
            cell.styles.valign = 'middle';
          }
        }


        // REvisar esto parece que ya no iria.
        if (rowIndex == 5) {
          if (columIndex == 0) {
            cell.styles.valign = 'middle';
          }
        }
        // En la fila 7
        if (rowIndex == 6) {


          if (columIndex == 3) {

            if (Number(cell.text) >= Number(raw[3].content)) {
              cell.styles.fillColor = [133, 252, 97];
            } else {
              cell.styles.fillColor = [255, 123, 123];
            }

          }
          if (columIndex == 6) {
            if (Number(cell.text) <= Number(raw[6].content)) {
              cell.styles.fillColor = [133, 252, 97];
            } else {
              cell.styles.fillColor = [255, 123, 123];
            }
          }

        }
        // Fin de la revision


      }


    };

    // Total suma 136, pero el widt es 136 hay que revisar.
    userOptions.columnStyles = {
      0: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 15,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      1: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 15,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      2: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 14,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      3: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 12.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      4: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 14,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      5: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 12.5,
        lineWidth: 0.2,
        lineColor: [22, 33, 77]
      },
      6: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 14,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      7: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 12.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      8: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 14,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      9: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 12.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      }
    };


    // Agregamos la tabla.
    autoTable(doc, userOptions);

  }


  // Genera el cuadro de 
  // Overall Performance Analysis
  // retorna el tamaño de la tabla
  private GenerateTableOverallPerformanceAnalysis(doc: jsPDF, widthPDF: number, heightPDF: number, positionWidth: number, positionHeight: number, listGTSOPA: GenerateTableSummaryOverallPerformanceAnalisis[], gTTSOPA: GenerateTableTotalSummaryOverallPerformanceAnalisis, isViewBallast: boolean, isViewLaden: boolean): number {

    // El generarl solo es por una actividad.
    let titleTable: string = 'Summary by Voyage';
    if (isViewBallast) {
      titleTable += '\n(Ballast)'
    }
    if (isViewLaden) {
      titleTable += '\n(Laden)'
    }

    let contentHeightTable = 0;
    // Le sumamos el espacio de la cabecera de la tabla.
    contentHeightTable += 19.9;
    // Cada fila ocupa lo siguiente.
    contentHeightTable += (6.25 * listGTSOPA.length);
    // FOTTER de la tabla
    contentHeightTable += 25.8;

    // Revisar Eliminar esto, es solo com referencia.
    /*   doc.setDrawColor(0);
      doc.setFillColor(255, 255, 255);
      doc.rect(2, positionHeight, widthPDF - (2 * 2), contentHeightTable, "FD");
   */

    // Agregar la formula para saber si es IFO VLSFO LSFO
    let typeConsumptionSelectBuqueIFO = (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO');


    var data: RowInput[] = [

      // PRimera Fila
      [
        { "content": titleTable, "colSpan": 2, "rowSpan": 2 },
        { "content": "Total Time\n(HRS)", "colSpan": 2 },
        { "content": "Total Distance\n(MI)", "colSpan": 2 },
        { "content": "Average Speed\n(KN)", "colSpan": 2 },
        { "content": "Average Speed\n(KN)\n(Charter)", "colSpan": 2 },
        { "content": "Total Consumption\n(MT)", "colSpan": 2 },
        { "content": "Daily Consumption\n(MT)", "colSpan": 2 },
        { "content": "Daily Consumption\n(MT)\n(Charter)", "colSpan": 2 },
        { "content": "Sailing Time\n(HRS)\n(Charter)", "colSpan": 2 },
        { "content": "Total Consumption\n(MT)\n(Charter)", "colSpan": 2 }
      ]
    ];

    let rowHeader2 = [];
    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    data.push(rowHeader2);

    listGTSOPA.forEach(
      gTSOPA => {

        let rowGenerit = [];
        rowGenerit.push({ "content": 'Voyage ' + gTSOPA.voyageNumber, "colSpan": 2 });

        // Time
        if (this.addInformationIFO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.timeIFO, 1), "colSpan": this.addInformationMGO ? 1 : 2 });
        }
        if (this.addInformationMGO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.timeMGO, 1), "colSpan": this.addInformationIFO ? 1 : 2 });
        }


        // Distance
        if (this.addInformationIFO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.distanceIFO, 1), "colSpan": this.addInformationMGO ? 1 : 2 });
        }
        if (this.addInformationMGO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.distanceMGO, 1), "colSpan": this.addInformationIFO ? 1 : 2 });
        }


        // Speed
        if (this.addInformationIFO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.speedIFO, 1), "colSpan": this.addInformationMGO ? 1 : 2 });
        }
        if (this.addInformationMGO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.speedMGO, 1), "colSpan": this.addInformationIFO ? 1 : 2 });
        }


        // Speed Charter
        if (this.addInformationIFO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.speedIFOCharter, 1), "colSpan": this.addInformationMGO ? 1 : 2 });
        }
        if (this.addInformationMGO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.speedIFOCharter, 1), "colSpan": this.addInformationIFO ? 1 : 2 });
        }


        // Consumption
        if (this.addInformationIFO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.consumptionIFO, 1), "colSpan": this.addInformationMGO ? 1 : 2 });
        }
        if (this.addInformationMGO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.consumptionMGO, 1), "colSpan": this.addInformationIFO ? 1 : 2 });
        }


        // daily Consumption
        if (this.addInformationIFO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.dailyConsumptionIFO, 1), "colSpan": this.addInformationMGO ? 1 : 2 });
        }
        if (this.addInformationMGO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.dailyConsumptionMGO, 1), "colSpan": this.addInformationIFO ? 1 : 2 });
        }

        // daily Consumption Charter
        if (this.addInformationIFO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.dailyConsumptionCharterIFO, 1), "colSpan": this.addInformationMGO ? 1 : 2 });
        }
        if (this.addInformationMGO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.dailyConsumptionCharterMGO, 1), "colSpan": this.addInformationIFO ? 1 : 2 });
        }


        // Time Charter
        if (this.addInformationIFO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.timeIFOCharter, 1), "colSpan": this.addInformationMGO ? 1 : 2 });
        }
        if (this.addInformationMGO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.timeMGOCharter, 1), "colSpan": this.addInformationIFO ? 1 : 2 });
        }



        // Consumption Charter
        if (this.addInformationIFO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.consumptionIFOCharter, 1), "colSpan": this.addInformationMGO ? 1 : 2 });
        }
        if (this.addInformationMGO) {
          rowGenerit.push({ "content": this.MathRoundDecimal(gTSOPA.consumptionMGOCharter, 1), "colSpan": this.addInformationIFO ? 1 : 2 });
        }







        data.push(rowGenerit);

      }
    );

    // Posicion donde inicia el header
    let positionHeader = 2 + listGTSOPA.length;

    let rowHeaderTotal2 = [];
    rowHeaderTotal2.push(
      { "content": "Total Calculation", "colSpan": 2, "rowSpan": 4 },
    )

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }
    data.push(rowHeaderTotal2);



    // VEr el resumen ballast
    if (isViewBallast) {


      let totalCaculate = [];
      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.timeIFOBallast, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.timeMGOBallast, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.distanceIFOBallast, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.distanceMGOBallast, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.speedIFOBallast, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.speedMGOBallast, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.speedCharterIFOBallast, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.speedCharterMGOBallast, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.consumptionIFOBallast, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.consumptionMGOBallast, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionIFOBallast, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionMGOBallast, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionCharterIFOBallast, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionCharterMGOBallast, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.timeCharterIFOBallast, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.timeCharterMGOBallast, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.consumptionCharterIFOBallast, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.consumptionCharterMGOBallast, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }
      data.push(totalCaculate);

      let textAnnotateTime = gTTSOPA.anotateTimeBallast;
      data.push([{ "content": textAnnotateTime, "colSpan": 18 }]);

      let textAnnotateConsumption = gTTSOPA.anotateConsumptionBallast;
      data.push([{ "content": textAnnotateConsumption, "colSpan": 18 }]);
    }


    if (isViewLaden) {


      let totalCaculate = [];
      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.timeIFOLaden, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.timeMGOLaden, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.distanceIFOLaden, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.distanceMGOLaden, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.speedIFOLaden, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.speedMGOLaden, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.speedCharterIFOLaden, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.speedCharterMGOLaden, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.consumptionIFOLaden, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.consumptionMGOLaden, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionIFOLaden, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionMGOLaden, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionCharterIFOLaden, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionCharterMGOLaden, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.timeCharterIFOLaden, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.timeCharterMGOLaden, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      if (this.addInformationIFO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.consumptionCharterIFOLaden, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        totalCaculate.push({ "content": this.MathRoundDecimal(gTTSOPA.consumptionCharterMGOLaden, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
      }
      data.push(totalCaculate);

      let textAnnotateTime = gTTSOPA.anotateTimeLaden;
      data.push([{ "content": textAnnotateTime, "colSpan": 18 }]);

      let textAnnotateConsumption = gTTSOPA.anotateConsumptionLaden;
      data.push([{ "content": textAnnotateConsumption, "colSpan": 18 }]);

    }

    // Opciones como usuario al generar un table.
    let userOptions: UserOptions = {};
    // Agregamos en que altura del documento podnra la tabla
    userOptions.startY = positionHeight;
    // estructura del cuerpo
    userOptions.body = data;
    // Margen que tendra nuestra tabla.
    userOptions.margin = { left: positionWidth }
    // Tamaño de nuestra tabla
    userOptions.tableWidth = 200;


    userOptions.didParseCell = (data: CellHookData) => {

      // Secction : head, body, footer
      let section = data.section;
      // guardamos la celda y verificamos que no sea underfiend
      let cell: Cell = data.cell;
      if (cell == undefined) { return; }

      // trabajaremos con el body.
      if (section == 'body') {

        // ubicacion del la fila
        let rowIndex = data.row.index;
        // ubicacion de la columna.
        let columIndex = data.column.index;
        // Raw ?????? <= agregar descripcion no lo se?
        let raw = data.row.raw;




        // Primera cabecera de la tabla Titulo
        if (rowIndex == 0) {
          // le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorWhite;
            cell.styles.textColor = this.colorTextHedear;
            cell.styles.fontSize = 9;
            cell.styles.cellPadding = 1;
          }
          if (columIndex >= 2) {
            cell.styles.fillColor = this.colorWhite;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 7;
            cell.styles.cellPadding = {
              top: 1,
              right: 0,
              bottom: 1,
              left: 0
            };
          }
          // solo las celdas que son la suma de datos ingresados por el capitan el Blue1
          if (columIndex == 2 || columIndex == 4 || columIndex == 10) {
            cell.styles.fillColor = this.colorBlueTable1;
          }
          // Solo las celdas que tienen formulas se pintan de blue2
          if (columIndex == 6 || columIndex == 12) {
            cell.styles.fillColor = this.colorBlueTable2;
          }
          // Solo las celdas que tienen datos del charter son de locor blue3
          if (columIndex == 8 || columIndex == 14 || columIndex == 14 || columIndex == 16 || columIndex == 18) {
            cell.styles.fillColor = this.colorBlueTable3;
          }
        }
        // Segunda cabecera 
        if (rowIndex == 1) {
          // le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorWhite;
            cell.styles.textColor = this.colorTextHedear;
            //cell.styles.fontSize = 9;
            cell.styles.cellPadding = 1;
          }

          if (columIndex >= 2) {
            cell.styles.fillColor = this.colorWhite;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 7;
            cell.styles.cellPadding = {
              top: 1,
              right: 0,
              bottom: 1,
              left: 0
            };
          }
          // solo las celdas que son la suma de datos ingresados por el capitan el Blue1
          if (columIndex == 2 || columIndex == 4 || columIndex == 10) {
            cell.styles.fillColor = this.colorBlueTable1;
          }
          // Solo las celdas que tienen formulas se pintan de blue2
          if (columIndex == 6 || columIndex == 12) {
            cell.styles.fillColor = this.colorBlueTable2;
          }
          // Solo las celdas que tienen datos del charter son de locor blue3
          if (columIndex == 8 || columIndex == 14 || columIndex == 16 || columIndex == 18) {
            cell.styles.fillColor = this.colorBlueTable3;
          }


          // VERIFICAMOS SI ES PARA EL 2
          if (this.addInformationIFO && this.addInformationMGO) {

            // solo las celdas que son la suma de datos ingresados por el capitan el Blue1
            if (columIndex == 3 || columIndex == 5 || columIndex == 11) {
              cell.styles.fillColor = this.colorBlueTable1;
            }
            // Solo las celdas que tienen formulas se pintan de blue2
            if (columIndex == 7 || columIndex == 13) {
              cell.styles.fillColor = this.colorBlueTable2;
            }
            // Solo las celdas que tienen datos del charter son de locor blue3
            if (columIndex == 9 || columIndex == 15 || columIndex == 17 || columIndex == 19) {
              cell.styles.fillColor = this.colorBlueTable3;
            }
          }

        }



        // de qui para adelante son los viajes.
        if (rowIndex > 1 && rowIndex < positionHeader) {

          // nombre del viaje y numero.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorBlueTable1;
            cell.styles.textColor = this.colorWhite;
            // cell.styles.fontSize = 9;
            cell.styles.cellPadding = {
              top: 1.5,
              right: 0,
              bottom: 1.5,
              left: 0
            };
          }

          if (columIndex >= 2) {
            cell.styles.fillColor = this.colorGris;
            cell.styles.fontSize = 7;
            cell.styles.cellPadding = {
              top: 1,
              right: 0,
              bottom: 1,
              left: 0
            };
          }

          if (
            (this.addInformationIFO && !this.addInformationMGO)
            || (this.addInformationMGO && !this.addInformationIFO)
          ) {

            // Time
            if (columIndex == 2) {
              let valorCell = Number(cell.text);
              // Time charter
              let valorCharter = Number(raw[8].content);
              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }

            // Speed
            if (columIndex == 6) {
              let valorCell = Number(cell.text);
              // speed
              let valorCharter = Number(raw[4].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }


            // total consumo
            if (columIndex == 10) {
              let valorCell = Number(cell.text);
              // total ocnsumo charter 
              let valorCharter = Number(raw[9].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }



            // daily consumo
            if (columIndex == 12) {
              let valorCell = Number(cell.text);
              // total daily consumption charter
              let valorCharter = Number(raw[7].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }

          }

          // Si se selecciona los dos tipos de combustible.
          if (this.addInformationIFO && this.addInformationMGO) {

            // Time
            if (columIndex == 2) {
              let valorCell = Number(cell.text);
              // Time charter
              let valorCharter = Number(raw[15].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }
            if (columIndex == 3) {
              let valorCell = Number(cell.text);
              // Time charter
              let valorCharter = Number(raw[16].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }

            // Speed
            if (columIndex == 6) {
              let valorCell = Number(cell.text);
              // speed
              let valorCharter = Number(raw[7].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }
            if (columIndex == 7) {
              let valorCell = Number(cell.text);
              // speed
              let valorCharter = Number(raw[8].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }



            // total consumo
            if (columIndex == 10) {
              let valorCell = Number(cell.text);
              // total ocnsumo charter 
              let valorCharter = Number(raw[17].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }
            if (columIndex == 11) {
              let valorCell = Number(cell.text);
              // total ocnsumo charter 
              let valorCharter = Number(raw[18].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }



            // Daily Consumo
            if (columIndex == 12) {
              let valorCell = Number(cell.text);
              // total daily consumption charter
              let valorCharter = Number(raw[13].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }
            if (columIndex == 13) {
              let valorCell = Number(cell.text);
              // total daily consumption charter
              let valorCharter = Number(raw[14].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }

          }


        }


        // Verificamos que el row este en la posicion del header.
        if (rowIndex == positionHeader) {
          // le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorWhite;
            cell.styles.textColor = this.colorTextHedear;
            cell.styles.fontSize = 9;
            cell.styles.cellPadding = 1;
          }
          if (columIndex >= 2) {
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 7;
            cell.styles.cellPadding = {
              top: 1.5,
              right: 0,
              bottom: 1.5,
              left: 0
            };
          }

          // solo las celdas que son la suma de datos ingresados por el capitan el Blue1
          if (columIndex == 2 || columIndex == 4 || columIndex == 10) {
            cell.styles.fillColor = this.colorBlueTable1;
          }
          // Solo las celdas que tienen formulas se pintan de blue2
          if (columIndex == 6 || columIndex == 12) {
            cell.styles.fillColor = this.colorBlueTable2;
          }
          // Solo las celdas que tienen datos del charter son de locor blue3
          if (columIndex == 8 || columIndex == 14 || columIndex == 16 || columIndex == 18) {
            cell.styles.fillColor = this.colorBlueTable3;
          }


          // VERIFICAMOS SI ES PARA EL 2
          if (this.addInformationIFO && this.addInformationMGO) {

            // solo las celdas que son la suma de datos ingresados por el capitan el Blue1
            if (columIndex == 3 || columIndex == 5 || columIndex == 11) {
              cell.styles.fillColor = this.colorBlueTable1;
            }
            // Solo las celdas que tienen formulas se pintan de blue2
            if (columIndex == 7 || columIndex == 13) {
              cell.styles.fillColor = this.colorBlueTable2;
            }
            // Solo las celdas que tienen datos del charter son de locor blue3
            if (columIndex == 9 || columIndex == 15 || columIndex == 17 || columIndex == 19) {
              cell.styles.fillColor = this.colorBlueTable3;
            }
          }
        }

        if (rowIndex == (positionHeader + 1)) {
          // le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex >= 2) {
            cell.styles.fillColor = this.colorGris;
            cell.styles.fontSize = 7;
            cell.styles.cellPadding = {
              top: 1,
              right: 0,
              bottom: 1,
              left: 0
            };
          }
          if (
            (this.addInformationIFO && !this.addInformationMGO)
            || (this.addInformationMGO && !this.addInformationIFO)
          ) {

            // Time
            if (columIndex == 2) {
              let valorCell = Number(cell.text);
              // Time charter
              let valorCharter = Number(raw[7].content);
              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }

            // Speed
            if (columIndex == 6) {
              let valorCell = Number(cell.text);
              // speed
              let valorCharter = Number(raw[3].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }


            // total consumo
            if (columIndex == 10) {
              let valorCell = Number(cell.text);
              // total ocnsumo charter 
              let valorCharter = Number(raw[8].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }



            // daily consumo
            if (columIndex == 12) {
              let valorCell = Number(cell.text);
              // total daily consumption charter
              let valorCharter = Number(raw[6].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }

          }

          // Si se selecciona los dos tipos de combustible.
          if (this.addInformationIFO && this.addInformationMGO) {

            // Time
            if (columIndex == 2) {
              let valorCell = Number(cell.text);
              // Time charter
              let valorCharter = Number(raw[14].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }
            if (columIndex == 3) {
              let valorCell = Number(cell.text);
              // Time charter
              let valorCharter = Number(raw[15].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }

            // Speed
            if (columIndex == 6) {
              let valorCell = Number(cell.text);
              // speed
              let valorCharter = Number(raw[6].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }
            if (columIndex == 7) {
              let valorCell = Number(cell.text);
              // speed
              let valorCharter = Number(raw[7].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }



            // total consumo
            if (columIndex == 10) {
              let valorCell = Number(cell.text);
              // total ocnsumo charter 
              let valorCharter = Number(raw[16].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }
            if (columIndex == 11) {
              let valorCell = Number(cell.text);
              // total ocnsumo charter 
              let valorCharter = Number(raw[17].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }



            // Daily Consumo
            if (columIndex == 12) {
              let valorCell = Number(cell.text);
              // total daily consumption charter
              let valorCharter = Number(raw[12].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }
            if (columIndex == 13) {
              let valorCell = Number(cell.text);
              // total daily consumption charter
              let valorCharter = Number(raw[13].content);

              // Verificamos si existe un valor en el charter.
              if (valorCharter && valorCell) {
                if (valorCell < valorCharter) {
                  cell.styles.textColor = this.colorTextSuccess;
                }
                if (valorCell > valorCharter) {
                  cell.styles.textColor = this.colorTextWarning;
                }
              }
            }

          }


        }



        if (rowIndex == (positionHeader + 2)) {
          if (columIndex == 2) {
            cell.styles.fillColor = this.colorGris;
            cell.styles.fontSize = 10;
            let valorCell = Number(cell.text);
            if (valorCell < 0) {
              cell.styles.textColor = this.colorTextWarning;
              cell.text = [this.MathRoundDecimal(-valorCell, 1) + " Hours Lost"];
            }
            if (valorCell > 0) {
              cell.styles.textColor = this.colorTextSuccess;
              cell.text = [this.MathRoundDecimal(valorCell, 1) + " Hours Saved"];
            }
            if (valorCell == 0) {
              cell.text = ["-----"];
            }
          }
        }


        if (rowIndex == (positionHeader + 3)) {
          if (columIndex == 2) {
            cell.styles.fillColor = this.colorGris;
            cell.styles.fontSize = 10;
            let valorCell = Number(cell.text);
            if (valorCell < 0) {
              cell.styles.textColor = this.colorTextWarning;
              cell.text = ["Consumption Outside The Guaranteed Limits"];
            }
            if (valorCell > 0) {
              cell.styles.textColor = this.colorTextSuccess;
              cell.text = ["Consumption Within The Guaranteed Limits"];

            }
            if (valorCell == 0) {
              cell.text = ["-----"];
            }
          }
        }
      }


    }


    // Total suma 136, pero el widt es 136 hay que revisar.
    userOptions.columnStyles = {
      0: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      1: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      2: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      3: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      4: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      5: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.2,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      6: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      7: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      8: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      9: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      10: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      11: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      12: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      13: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      14: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      15: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      16: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      17: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      18: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      19: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      }
    };


    // Agregamos la tabla.
    autoTable(doc, userOptions);


    return contentHeightTable;
  }

  // Resumen general, overall Performance
  private GenerateTableTotalOverallPerformanceAnalisis(doc: jsPDF, widthPDF: number, heightPDF: number, positionWidth: number, positionHeight: number, gTTSOPA: GenerateTableTotalSummaryOverallPerformanceAnalisis, isViewBallast: boolean, isViewLaden: boolean, titleTable: string): number {

    let contTextTitle = '';

    if (isViewBallast) {
      contTextTitle += '( Ballast';
      if (!isViewLaden) {
        contTextTitle += ' )';
      }
    }

    if (isViewLaden) {
      if (!isViewBallast) {
        contTextTitle += '( Laden )';
      } else {

        contTextTitle += ' / Laden )';
      }
    }
    let title = titleTable + '\n' + contTextTitle;

    let contentHeightTable = 0;
    // Le sumamos el espacio de la cabecera de la tabla.
    contentHeightTable += 14.3;

    contentHeightTable += (6.8 * 9)

    // Linea vacia
    contentHeightTable += 4;
    // Linea Calcul result
    contentHeightTable += 19;


    //RevisarEliminar esto, es solo com referencia.
    /*     doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.rect(5, positionHeight, widthPDF - (5 * 2), contentHeightTable, "FD");
     */

    // title
    // Agregar la formula para saber si es IFO VLSFO LSFO
    let typeConsumptionSelectBuqueIFO = (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO');

    var data: RowInput[] = [];

    let headerTable = [];
    headerTable.push(
      { "content": title, "colSpan": 4, "rowSpan": 2 }
    );
    if (isViewBallast) {
      headerTable.push(
        { "content": "Ballast", "colSpan": isViewBallast && isViewLaden ? 2 : 4 }
      );
    }
    if (isViewLaden) {
      headerTable.push(
        { "content": "Laden", "colSpan": isViewLaden && isViewBallast ? 2 : 4 }
      );
    }
    // Agregamos la cabecera
    data.push(headerTable);


    let header2Table = [];
    // Ballast
    if (isViewBallast) {
      if (this.addInformationIFO) {
        header2Table.push(
          {
            "content": typeConsumptionSelectBuqueIFO, "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        header2Table.push(
          {
            "content": 'MGO', "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    if (isViewLaden) {
      if (this.addInformationIFO) {
        header2Table.push(
          {
            "content": typeConsumptionSelectBuqueIFO, "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        header2Table.push(
          {
            "content": 'MGO', "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    data.push(header2Table);


    // Time
    let rowTransitTime = [];
    rowTransitTime.push(
      { "content": "Transit Time (HRS)", "colSpan": 4 }
    );
    // Ballast
    if (isViewBallast) {
      if (this.addInformationIFO) {
        rowTransitTime.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.timeIFOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowTransitTime.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.timeMGOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    if (isViewLaden) {
      if (this.addInformationIFO) {
        rowTransitTime.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.timeIFOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowTransitTime.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.timeMGOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    data.push(rowTransitTime);




    // Distance
    let rowDistance = [];
    rowDistance.push(
      { "content": "Transit Distance (MI)", "colSpan": 4 }
    );
    // Ballast
    if (isViewBallast) {
      if (this.addInformationIFO) {
        rowDistance.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.distanceIFOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowDistance.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.distanceMGOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    if (isViewLaden) {
      if (this.addInformationIFO) {
        rowDistance.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.distanceIFOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowDistance.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.distanceMGOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    data.push(rowDistance);



    // Average Speed
    let rowAverageSpeed = [];
    rowAverageSpeed.push(
      { "content": "Average Speed (KN)", "colSpan": 4 }
    );
    // Ballast
    if (isViewBallast) {
      if (this.addInformationIFO) {
        rowAverageSpeed.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.speedIFOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowAverageSpeed.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.speedMGOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    if (isViewLaden) {
      if (this.addInformationIFO) {
        rowAverageSpeed.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.speedIFOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowAverageSpeed.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.speedMGOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    data.push(rowAverageSpeed);






    let rowCharterSpeed = [];
    rowCharterSpeed.push(
      { "content": "Allowable Charter Speed (KN)", "colSpan": 4 }
    );
    // Ballast
    if (isViewBallast) {
      if (this.addInformationIFO) {
        rowCharterSpeed.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.speedCharterIFOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowCharterSpeed.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.speedCharterMGOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    if (isViewLaden) {
      if (this.addInformationIFO) {
        rowCharterSpeed.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.speedCharterIFOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowCharterSpeed.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.speedCharterMGOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    data.push(rowCharterSpeed);





    let rowTotalConsumption = [];
    rowTotalConsumption.push(
      { "content": "Actual Total Consumption (MT)", "colSpan": 4 }
    );
    // Ballast
    if (isViewBallast) {
      if (this.addInformationIFO) {
        rowTotalConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.consumptionIFOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowTotalConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.consumptionMGOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    if (isViewLaden) {
      if (this.addInformationIFO) {
        rowTotalConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.consumptionIFOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowTotalConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.consumptionMGOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    data.push(rowTotalConsumption);





    let rowDailyConsumption = [];
    rowDailyConsumption.push(
      { "content": "Daily Consumption (MT)", "colSpan": 4 }
    );
    // Ballast
    if (isViewBallast) {
      if (this.addInformationIFO) {
        rowDailyConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionIFOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowDailyConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionMGOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    if (isViewLaden) {
      if (this.addInformationIFO) {
        rowDailyConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionIFOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowDailyConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionMGOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    data.push(rowDailyConsumption);






    let rowActualCharterDailyConsumption = [];
    rowActualCharterDailyConsumption.push(
      { "content": "Allowable Charter Daily Consumption (MT)", "colSpan": 4 }
    );
    // Ballast
    if (isViewBallast) {
      if (this.addInformationIFO) {
        rowActualCharterDailyConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionCharterIFOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowActualCharterDailyConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionCharterMGOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    if (isViewLaden) {
      if (this.addInformationIFO) {
        rowActualCharterDailyConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionCharterIFOLaden, 2), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowActualCharterDailyConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.dailyConsumptionCharterMGOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    data.push(rowActualCharterDailyConsumption);






    let rowCharterTime = [];
    rowCharterTime.push(
      { "content": "Allowable Charter Time (HRS)", "colSpan": 4 }
    );
    // Ballast
    if (isViewBallast) {
      if (this.addInformationIFO) {
        rowCharterTime.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.timeCharterIFOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowCharterTime.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.timeCharterMGOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    if (isViewLaden) {
      if (this.addInformationIFO) {
        rowCharterTime.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.timeCharterIFOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowCharterTime.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.timeCharterMGOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    data.push(rowCharterTime);
















    let rowWarrantedConsumption = [];
    rowWarrantedConsumption.push(
      { "content": "Warranted Total Consumption (MT)", "colSpan": 4 }
    );
    // Ballast
    if (isViewBallast) {
      if (this.addInformationIFO) {
        rowWarrantedConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.consumptionCharterIFOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowWarrantedConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.consumptionCharterMGOBallast, 1), "colSpan":
              isViewLaden ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    if (isViewLaden) {
      if (this.addInformationIFO) {
        rowWarrantedConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.consumptionCharterIFOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
      if (this.addInformationMGO) {
        rowWarrantedConsumption.push(
          {
            "content": this.MathRoundDecimal(gTTSOPA.consumptionCharterMGOLaden, 1), "colSpan":
              isViewBallast ? (this.addInformationIFO && this.addInformationMGO ? 1 : 2) : (this.addInformationIFO && this.addInformationMGO ? 2 : 4)
          }
        );
      }
    }
    data.push(rowWarrantedConsumption);



    let rowEmpty = [];
    rowEmpty.push(
      { "content": "", "colSpan": 8 }
    );
    data.push(rowEmpty);





    let rowAnotateTime = [];
    rowAnotateTime.push(
      { "content": "Calculation Results", "colSpan": 4, "rowSpan": 2 }
    );

    if (isViewBallast && isViewLaden) {
      rowAnotateTime.push(
        { "content": this.MathRoundDecimal(gTTSOPA.anotateTimeBallast, 1), "colSpan": 2 }
      );
      rowAnotateTime.push(
        { "content": this.MathRoundDecimal(gTTSOPA.anotateTimeLaden, 1), "colSpan": 2 }
      );
    }

    if (isViewBallast && !isViewLaden) {
      if (this.addInformationIFO && !this.addInformationMGO) {
        rowAnotateTime.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateTimeBallastIFO, 1), "colSpan": 4 }
        );
      }
      if (this.addInformationMGO && !this.addInformationIFO) {
        rowAnotateTime.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateTimeBallastMGO, 1), "colSpan": 4 }
        );
      }


      if (this.addInformationMGO && this.addInformationIFO) {
        rowAnotateTime.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateTimeBallastIFO, 1), "colSpan": 2 }
        );
        rowAnotateTime.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateTimeBallastMGO, 1), "colSpan": 2 }
        );
      }

    }


    if (isViewLaden && !isViewBallast) {
      if (this.addInformationIFO && !this.addInformationMGO) {
        rowAnotateTime.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateTimeLadenIFO, 1), "colSpan": 4 }
        );
      }
      if (this.addInformationMGO && !this.addInformationIFO) {
        rowAnotateTime.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateTimeLadenMGO, 1), "colSpan": 4 }
        );
      }


      if (this.addInformationMGO && this.addInformationIFO) {
        rowAnotateTime.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateTimeLadenIFO, 1), "colSpan": 2 }
        );
        rowAnotateTime.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateTimeLadenMGO, 1), "colSpan": 2 }
        );
      }

    }
    data.push(rowAnotateTime);



    let rowAnotateConsumption = [];


    if (isViewBallast && isViewLaden) {
      rowAnotateConsumption.push(
        { "content": this.MathRoundDecimal(gTTSOPA.anotateConsumptionBallast, 1), "colSpan": 2 }
      );
      rowAnotateConsumption.push(
        { "content": this.MathRoundDecimal(gTTSOPA.anotateConsumptionLaden, 1), "colSpan": 2 }
      );
    }

    if (isViewBallast && !isViewLaden) {
      if (this.addInformationIFO && !this.addInformationMGO) {
        rowAnotateConsumption.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateConsumptionBallastIFO, 1), "colSpan": 4 }
        );
      }
      if (this.addInformationMGO && !this.addInformationIFO) {
        rowAnotateConsumption.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateConsumptionBallastMGO, 1), "colSpan": 4 }
        );
      }


      if (this.addInformationMGO && this.addInformationIFO) {
        rowAnotateConsumption.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateConsumptionBallastIFO, 1), "colSpan": 2 }
        );
        rowAnotateConsumption.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateConsumptionBallastMGO, 1), "colSpan": 2 }
        );
      }

    }


    if (isViewLaden && !isViewBallast) {
      if (this.addInformationIFO && !this.addInformationMGO) {
        rowAnotateConsumption.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateConsumptionLadenIFO, 1), "colSpan": 4 }
        );
      }
      if (this.addInformationMGO && !this.addInformationIFO) {
        rowAnotateConsumption.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateConsumptionLadenMGO, 1), "colSpan": 4 }
        );
      }


      if (this.addInformationMGO && this.addInformationIFO) {
        rowAnotateConsumption.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateConsumptionLadenIFO, 1), "colSpan": 2 }
        );
        rowAnotateConsumption.push(
          { "content": this.MathRoundDecimal(gTTSOPA.anotateConsumptionLadenMGO, 1), "colSpan": 2 }
        );
      }

    }
    data.push(rowAnotateConsumption);




    // Opciones como usuario al generar un table.
    let userOptions: UserOptions = {};
    // Agregamos en que altura del documento podnra la tabla
    userOptions.startY = positionHeight;
    // estructura del cuerpo
    userOptions.body = data;
    // Margen que tendra nuestra tabla.
    userOptions.margin = { left: positionWidth }
    // Tamaño de nuestra tabla
    userOptions.tableWidth = 190;
    userOptions.bodyStyles = { lineColor: [0, 0, 0] }


    // Recorremos todas las celdas para ponerle un color o un diseño o condicion.
    userOptions.didParseCell = (data: CellHookData) => {

      // Secction : head, body, footer
      let section = data.section;
      // guardamos la celda y verificamos que no sea underfiend
      let cell: Cell = data.cell;
      if (cell == undefined) { return; }

      // trabajaremos con el body.
      if (section == 'body') {
        // ubicacion del la fila
        let rowIndex = data.row.index;
        // ubicacion de la columna.
        let columIndex = data.column.index;
        // Raw ?????? <= agregar descripcion no lo se?
        let raw = data.row.raw;



        // Primera cabecera de la tabla Titulo
        if (rowIndex == 0) {
          // le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorWhite;
            cell.styles.textColor = this.colorTextHedear;
            cell.styles.fontSize = 10;
          }
          // caso sea Ballas o Laden
          // siempre la columna tendra la posicion 4
          if (isViewBallast || isViewLaden) {
            if (columIndex == 4) {
              cell.styles.fillColor = this.colorTextHedear;
              cell.styles.textColor = this.colorYellowTransgas;
              cell.styles.fontSize = 10;
            }
          }
          // Solo si las dos opciones estan activadas,  la segunda opcion tendra la posicion 6
          if (isViewBallast && isViewLaden) {
            if (columIndex == 6) {
              cell.styles.fillColor = this.colorTextHedear;
              cell.styles.textColor = this.colorYellowTransgas;
              cell.styles.fontSize = 10;
            }
          }

        }


        // Segunda linea cabecera 2
        if (rowIndex == 1) {

          // solo si se mostrara un tipo de navegacion 
          // Solo se usaria la celda 4 y 6 dependiendo del IFO Y MGO
          if (
            (isViewBallast && !isViewLaden)
            ||
            (isViewLaden && !isViewBallast)
          ) {


            if (this.addInformationIFO || this.addInformationMGO) {
              if (columIndex == 4) {
                cell.styles.fillColor = this.colorBlueTable1;
                cell.styles.textColor = this.colorWhite;
                cell.styles.fontSize = 8;
              }
            }
            if (this.addInformationMGO && this.addInformationMGO) {
              if (columIndex == 6) {
                cell.styles.fillColor = this.colorBlueTable1;
                cell.styles.textColor = this.colorWhite;
                cell.styles.fontSize = 8;
              }
            }

          }

          // Si se desea mostrar las 2 informaciones
          // Se usara la celda 4,5,6,7 depndendiendo del ifo y mgo.
          if (isViewBallast && isViewLaden) {


            if (this.addInformationIFO || this.addInformationMGO) {
              if (columIndex == 4) {
                cell.styles.fillColor = this.colorBlueTable1;
                cell.styles.textColor = this.colorWhite;
                cell.styles.fontSize = 8;
              }
              if (columIndex == 6) {
                cell.styles.fillColor = this.colorBlueTable1;
                cell.styles.textColor = this.colorWhite;
                cell.styles.fontSize = 8;
              }
            }


            if (this.addInformationIFO && this.addInformationMGO) {
              if (columIndex == 5) {
                cell.styles.fillColor = this.colorBlueTable1;
                cell.styles.textColor = this.colorWhite;
                cell.styles.fontSize = 8;
              }
              if (columIndex == 7) {
                cell.styles.fillColor = this.colorBlueTable1;
                cell.styles.textColor = this.colorWhite;
                cell.styles.fontSize = 8;
              }
            }
          }



        }


        // 2 linea Time
        if (rowIndex == 2) {
          // Le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorBlueTable1;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }

          // Solo si se mostrara un tipo de navegacion 
          // Solo se usaria la celda 4 y 6 dependiendo del IFO Y MGO
          if (
            (isViewBallast && !isViewLaden)
            ||
            (isViewLaden && !isViewBallast)
          ) {


            if (this.addInformationIFO || this.addInformationMGO) {

              if (columIndex == 4) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[9].raw[1].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
            }
            if (this.addInformationMGO && this.addInformationMGO) {


              if (columIndex == 6) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[9].raw[2].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }
          }

          // Si se desea mostrar las 2 informaciones
          // Se usara la celda 4,5,6,7 depndendiendo del ifo y mgo.
          if (isViewBallast && isViewLaden) {


            if (
              (this.addInformationIFO && !this.addInformationMGO)
              || (this.addInformationMGO && !this.addInformationIFO)
            ) {

              if (columIndex == 4) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[9].raw[1].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 6) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[9].raw[2].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }


            if (this.addInformationIFO && this.addInformationMGO) {

              if (columIndex == 4) {

                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[9].raw[1].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 5) {

                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[9].raw[2].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
              if (columIndex == 6) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[9].raw[3].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[3].content)
              }
              if (columIndex == 7) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[9].raw[4].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);
                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;

                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[4].content)
              }
            }
          }



        }


        // 3 linea Distance
        if (rowIndex == 3) {
          // Le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorBlueTable1;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }



          // Solo si se mostrara un tipo de navegacion 
          // Solo se usaria la celda 4 y 6 dependiendo del IFO Y MGO
          if (
            (isViewBallast && !isViewLaden)
            ||
            (isViewLaden && !isViewBallast)
          ) {


            if (this.addInformationIFO || this.addInformationMGO) {

              if (columIndex == 4) {

                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
            }
            if (this.addInformationMGO && this.addInformationMGO) {


              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }
          }

          // Si se desea mostrar las 2 informaciones
          // Se usara la celda 4,5,6,7 depndendiendo del ifo y mgo.
          if (isViewBallast && isViewLaden) {


            if (
              (this.addInformationIFO && !this.addInformationMGO)
              || (this.addInformationMGO && !this.addInformationIFO)
            ) {

              if (columIndex == 4) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                cell.styles.fontSize = 8;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }


            if (this.addInformationIFO && this.addInformationMGO) {

              if (columIndex == 4) {

                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 5) {

                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[3].content)
              }
              if (columIndex == 7) {
                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[4].content)
              }
            }
          }


        }



        // 4 linea Speed
        if (rowIndex == 4) {
          // Le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorBlueTable2;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }

          // Solo si se mostrara un tipo de navegacion 
          // Solo se usaria la celda 4 y 6 dependiendo del IFO Y MGO
          if (
            (isViewBallast && !isViewLaden)
            ||
            (isViewLaden && !isViewBallast)
          ) {


            if (this.addInformationIFO || this.addInformationMGO) {

              if (columIndex == 4) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[5].raw[1].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;

                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime > allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }

                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
            }
            if (this.addInformationMGO && this.addInformationMGO) {


              if (columIndex == 6) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[5].raw[2].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime > allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }
          }

          // Si se desea mostrar las 2 informaciones
          // Se usara la celda 4,5,6,7 depndendiendo del ifo y mgo.
          if (isViewBallast && isViewLaden) {


            if (
              (this.addInformationIFO && !this.addInformationMGO)
              || (this.addInformationMGO && !this.addInformationIFO)
            ) {

              if (columIndex == 4) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[5].raw[1].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime > allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 6) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[5].raw[2].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime > allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }


            if (this.addInformationIFO && this.addInformationMGO) {

              if (columIndex == 4) {

                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[5].raw[1].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime > allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 5) {

                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[5].raw[2].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime > allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
              if (columIndex == 6) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[5].raw[3].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime > allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[3].content)
              }
              if (columIndex == 7) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[5].raw[4].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);
                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime > allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;

                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[4].content)
              }
            }
          }



        }

        // 5 Allowable Charter Speed
        if (rowIndex == 5) {
          // Le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorBlueTable3;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }



          // Solo si se mostrara un tipo de navegacion 
          // Solo se usaria la celda 4 y 6 dependiendo del IFO Y MGO
          if (
            (isViewBallast && !isViewLaden)
            ||
            (isViewLaden && !isViewBallast)
          ) {


            if (this.addInformationIFO || this.addInformationMGO) {

              if (columIndex == 4) {

                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
            }
            if (this.addInformationMGO && this.addInformationMGO) {


              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }
          }

          // Si se desea mostrar las 2 informaciones
          // Se usara la celda 4,5,6,7 depndendiendo del ifo y mgo.
          if (isViewBallast && isViewLaden) {


            if (
              (this.addInformationIFO && !this.addInformationMGO)
              || (this.addInformationMGO && !this.addInformationIFO)
            ) {

              if (columIndex == 4) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }


            if (this.addInformationIFO && this.addInformationMGO) {

              if (columIndex == 4) {

                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 5) {

                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[3].content)
              }
              if (columIndex == 7) {
                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[4].content)
              }
            }
          }

        }

        // 6 total consumption
        if (rowIndex == 6) {
          // Le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorBlueTable1;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }

          // Solo si se mostrara un tipo de navegacion 
          // Solo se usaria la celda 4 y 6 dependiendo del IFO Y MGO
          if (
            (isViewBallast && !isViewLaden)
            ||
            (isViewLaden && !isViewBallast)
          ) {


            if (this.addInformationIFO || this.addInformationMGO) {

              if (columIndex == 4) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[10].raw[1].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;

                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }

                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
            }
            if (this.addInformationMGO && this.addInformationMGO) {


              if (columIndex == 6) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[10].raw[2].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }
          }

          // Si se desea mostrar las 2 informaciones
          // Se usara la celda 4,5,6,7 depndendiendo del ifo y mgo.
          if (isViewBallast && isViewLaden) {


            if (
              (this.addInformationIFO && !this.addInformationMGO)
              || (this.addInformationMGO && !this.addInformationIFO)
            ) {

              if (columIndex == 4) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[10].raw[1].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 6) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[10].raw[2].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }


            if (this.addInformationIFO && this.addInformationMGO) {

              if (columIndex == 4) {

                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[10].raw[1].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 5) {

                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[10].raw[2].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
              if (columIndex == 6) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[10].raw[3].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[3].content)
              }
              if (columIndex == 7) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[10].raw[4].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);
                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;

                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[4].content)
              }
            }
          }



        }

        // 7 Daily consumption
        if (rowIndex == 7) {
          // Le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorBlueTable2;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }

          // Solo si se mostrara un tipo de navegacion 
          // Solo se usaria la celda 4 y 6 dependiendo del IFO Y MGO
          if (
            (isViewBallast && !isViewLaden)
            ||
            (isViewLaden && !isViewBallast)
          ) {


            if (this.addInformationIFO || this.addInformationMGO) {

              if (columIndex == 4) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[8].raw[1].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }

                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
            }
            if (this.addInformationMGO && this.addInformationMGO) {


              if (columIndex == 6) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[8].raw[2].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }
          }

          // Si se desea mostrar las 2 informaciones
          // Se usara la celda 4,5,6,7 depndendiendo del ifo y mgo.
          if (isViewBallast && isViewLaden) {


            if (
              (this.addInformationIFO && !this.addInformationMGO)
              || (this.addInformationMGO && !this.addInformationIFO)
            ) {

              if (columIndex == 4) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[8].raw[1].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 6) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[8].raw[2].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }


            if (this.addInformationIFO && this.addInformationMGO) {

              if (columIndex == 4) {

                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[8].raw[1].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 5) {

                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[8].raw[2].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
              if (columIndex == 6) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[8].raw[3].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);

                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[3].content)
              }
              if (columIndex == 7) {
                // Obtenemos los datos de la fila 9
                let allowableCharterTime = Number(data.table.body[8].raw[4].content);
                // Guardamos los datos actuales de la celda
                let transitTime = Number(cell.text);
                cell.styles.fillColor = this.colorGris;
                if (transitTime && allowableCharterTime) {
                  cell.styles.textColor = transitTime < allowableCharterTime ? this.colorTextSuccess : this.colorTextWarning;
                }
                cell.styles.fontSize = 8;

                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[4].content)
              }
            }
          }



        }

        // 8 Allowable Charter Daily Consumption
        if (rowIndex == 8) {
          // Le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorBlueTable3;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }



          // Solo si se mostrara un tipo de navegacion 
          // Solo se usaria la celda 4 y 6 dependiendo del IFO Y MGO
          if (
            (isViewBallast && !isViewLaden)
            ||
            (isViewLaden && !isViewBallast)
          ) {


            if (this.addInformationIFO || this.addInformationMGO) {

              if (columIndex == 4) {

                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
            }
            if (this.addInformationMGO && this.addInformationMGO) {


              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }
          }

          // Si se desea mostrar las 2 informaciones
          // Se usara la celda 4,5,6,7 depndendiendo del ifo y mgo.
          if (isViewBallast && isViewLaden) {


            if (
              (this.addInformationIFO && !this.addInformationMGO)
              || (this.addInformationMGO && !this.addInformationIFO)
            ) {

              if (columIndex == 4) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }


            if (this.addInformationIFO && this.addInformationMGO) {

              if (columIndex == 4) {

                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 5) {

                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[3].content)
              }
              if (columIndex == 7) {
                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[4].content)
              }
            }
          }

        }

        // 9 Allowable Charter Time 
        if (rowIndex == 9) {
          // Le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorBlueTable3;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }



          // Solo si se mostrara un tipo de navegacion 
          // Solo se usaria la celda 4 y 6 dependiendo del IFO Y MGO
          if (
            (isViewBallast && !isViewLaden)
            ||
            (isViewLaden && !isViewBallast)
          ) {


            if (this.addInformationIFO || this.addInformationMGO) {

              if (columIndex == 4) {

                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
            }
            if (this.addInformationMGO && this.addInformationMGO) {


              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }
          }

          // Si se desea mostrar las 2 informaciones
          // Se usara la celda 4,5,6,7 depndendiendo del ifo y mgo.
          if (isViewBallast && isViewLaden) {


            if (
              (this.addInformationIFO && !this.addInformationMGO)
              || (this.addInformationMGO && !this.addInformationIFO)
            ) {

              if (columIndex == 4) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }


            if (this.addInformationIFO && this.addInformationMGO) {

              if (columIndex == 4) {

                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 5) {

                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[3].content)
              }
              if (columIndex == 7) {
                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[4].content)
              }
            }
          }

        }

        // 10 Warranted Total Consumption 
        if (rowIndex == 10) {
          // Le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorBlueTable3;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }



          // Solo si se mostrara un tipo de navegacion 
          // Solo se usaria la celda 4 y 6 dependiendo del IFO Y MGO
          if (
            (isViewBallast && !isViewLaden)
            ||
            (isViewLaden && !isViewBallast)
          ) {


            if (this.addInformationIFO || this.addInformationMGO) {

              if (columIndex == 4) {

                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
            }
            if (this.addInformationMGO && this.addInformationMGO) {


              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }
          }

          // Si se desea mostrar las 2 informaciones
          // Se usara la celda 4,5,6,7 depndendiendo del ifo y mgo.
          if (isViewBallast && isViewLaden) {


            if (
              (this.addInformationIFO && !this.addInformationMGO)
              || (this.addInformationMGO && !this.addInformationIFO)
            ) {

              if (columIndex == 4) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
            }


            if (this.addInformationIFO && this.addInformationMGO) {

              if (columIndex == 4) {

                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[1].content)
              }
              if (columIndex == 5) {

                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[2].content)
              }
              if (columIndex == 6) {
                cell.styles.fillColor = this.colorGris;
                //console.log(cell.text + '----' + data.table.body[rowIndex].raw[3].content)
              }
              if (columIndex == 7) {
                cell.styles.fillColor = this.colorGris;
                // console.log(cell.text + '----' + data.table.body[rowIndex].raw[4].content)
              }
            }
          }

        }

        // 11 Linea vacia
        if (rowIndex == 11) {
          // Le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorWhite;
            cell.styles.minCellHeight = 2;
            cell.styles.fontSize = 1;
          }



        }

        // 12 Time calcu
        if (rowIndex == 12) {

          // le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorWhite;
            cell.styles.textColor = this.colorTextHedear;
            cell.styles.fontSize = 10;
          }


          if (this.addInformationIFO || this.addInformationMGO) {
            if (columIndex == 4) {
              cell.styles.fillColor = this.colorGris;
              cell.styles.fontSize = 10;
              let valorCell = Number(cell.text);
              if (valorCell < 0) {
                cell.styles.textColor = this.colorTextWarning;
                cell.text = [this.MathRoundDecimal(-valorCell, 1) + " Hours Lost"];
              }
              if (valorCell > 0) {
                cell.styles.textColor = this.colorTextSuccess;
                cell.text = [this.MathRoundDecimal(valorCell, 1) + " Hours Saved"];
              }
              if (valorCell == 0) {
                cell.text = ["-----"];
              }
            }
          }
          if (this.addInformationMGO && this.addInformationMGO) {
            if (columIndex == 6) {
              cell.styles.fillColor = this.colorGris;
              cell.styles.fontSize = 10;
              let valorCell = Number(cell.text);
              if (valorCell < 0) {
                cell.styles.textColor = this.colorTextWarning;
                cell.text = [this.MathRoundDecimal(-valorCell, 1) + " Hours Lost"];
              }
              if (valorCell > 0) {
                cell.styles.textColor = this.colorTextSuccess;
                cell.text = [this.MathRoundDecimal(valorCell, 1) + " Hours Saved"];
              }
              if (valorCell == 0) {
                cell.text = ["-----"];
              }
            }
          }
          // Solo si las dos opciones estan activadas,  la segunda opcion tendra la posicion 6
          if (isViewBallast && isViewLaden) {
            if (columIndex == 4) {
              cell.styles.fillColor = this.colorGris;
              cell.styles.fontSize = 10;
              let valorCell = Number(cell.text);
              if (valorCell < 0) {
                cell.styles.textColor = this.colorTextWarning;
                cell.text = [this.MathRoundDecimal(-valorCell, 1) + " Hours Lost"];
              }
              if (valorCell > 0) {
                cell.styles.textColor = this.colorTextSuccess;
                cell.text = [this.MathRoundDecimal(valorCell, 1) + " Hours Saved"];
              }
              if (valorCell == 0) {
                cell.text = ["-----"];
              }
            }
            if (columIndex == 6) {
              cell.styles.fillColor = this.colorGris;
              cell.styles.fontSize = 10;
              let valorCell = Number(cell.text);
              if (valorCell < 0) {
                cell.styles.textColor = this.colorTextWarning;
                cell.text = [this.MathRoundDecimal(-valorCell, 1) + " Hours Lost"];
              }
              if (valorCell > 0) {
                cell.styles.textColor = this.colorTextSuccess;
                cell.text = [this.MathRoundDecimal(valorCell, 1) + " Hours Saved"];
              }
              if (valorCell == 0) {
                cell.text = ["-----"];
              }
            }
          }
        }

        // 12 cONSUMPTION calcu
        if (rowIndex == 13) {

          // le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorWhite;
            cell.styles.textColor = this.colorTextHedear;
            cell.styles.fontSize = 10;
          }


          if (this.addInformationIFO || this.addInformationMGO) {

            if (columIndex == 4) {
              cell.styles.fillColor = this.colorGris;
              cell.styles.fontSize = 10;
              let valorCell = Number(cell.text);
              if (valorCell < 0) {
                cell.styles.textColor = this.colorTextWarning;
                cell.text = ["Consumption Outside The Guaranteed Limits"];
              }
              if (valorCell > 0) {
                cell.styles.textColor = this.colorTextSuccess;
                cell.text = ["Consumption Within The Guaranteed Limits"];

              }

              if (valorCell == 0) {
                cell.text = ["-----"];
              }
            }
          }
          if (this.addInformationMGO && this.addInformationMGO) {


            if (columIndex == 6) {
              cell.styles.fillColor = this.colorGris;
              cell.styles.fontSize = 10;
              let valorCell = Number(cell.text);
              if (valorCell < 0) {
                cell.styles.textColor = this.colorTextWarning;
                cell.text = ["Consumption Outside The Guaranteed Limits"];
              }
              if (valorCell > 0) {
                cell.styles.textColor = this.colorTextSuccess;
                cell.text = ["Consumption Within The Guaranteed Limits"];

              }

              if (valorCell == 0) {
                cell.text = ["-----"];
              }
            }


          }
          // Solo si las dos opciones estan activadas,  la segunda opcion tendra la posicion 6
          if (isViewBallast && isViewLaden) {
            if (columIndex == 4) {
              cell.styles.fillColor = this.colorGris;
              cell.styles.fontSize = 10;
              let valorCell = Number(cell.text);
              if (valorCell < 0) {
                cell.styles.textColor = this.colorTextWarning;
                cell.text = ["Consumption Outside The Guaranteed Limits"];
              }
              if (valorCell > 0) {
                cell.styles.textColor = this.colorTextSuccess;
                cell.text = ["Consumption Within The Guaranteed Limits"];

              }

              if (valorCell == 0) {
                cell.text = ["-----"];
              }
            }
            if (columIndex == 6) {
              cell.styles.fillColor = this.colorGris;
              cell.styles.fontSize = 10;
              let valorCell = Number(cell.text);
              if (valorCell < 0) {
                cell.styles.textColor = this.colorTextWarning;
                cell.text = ["Consumption Outside The Guaranteed Limits"];
              }
              if (valorCell > 0) {
                cell.styles.textColor = this.colorTextSuccess;
                cell.text = ["Consumption Within The Guaranteed Limits"];

              }

              if (valorCell == 0) {
                cell.text = ["-----"];
              }
            }
          }



        }



        /* 
        
                // REvisar esto parece que ya no iria.
                if (rowIndex == 5) {
                  if (columIndex == 0) {
                    cell.styles.valign = 'middle';
                  }
                }
                // En la fila 7
                if (rowIndex == 6) {
        
        
                  if (columIndex == 3) {
        
                    if (Number(cell.text) >= Number(raw[3].content)) {
                      cell.styles.fillColor = [133, 252, 97];
                    } else {
                      cell.styles.fillColor = [255, 123, 123];
                    }
        
                  }
                  if (columIndex == 6) {
                    if (Number(cell.text) <= Number(raw[6].content)) {
                      cell.styles.fillColor = [133, 252, 97];
                    } else {
                      cell.styles.fillColor = [255, 123, 123];
                    }
                  }
        
                }
                // Fin de la revision 
                */


      }
    };

    // Total suma 190, pero el widt es 136 hay que revisar.
    userOptions.columnStyles = {
      0: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 8,
        lineWidth: 0.15,
        valign: 'middle',
      },
      1: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 8,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      2: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 29,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      3: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 29,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      4: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 29,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      5: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 29,
        lineWidth: 0.2,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      6: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 29,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      7: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 29,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
    };


    // Agregamos la tabla.
    autoTable(doc, userOptions);

    return contentHeightTable;
  }

  // Mejorar deberia retornar el tamaño donde se esta quedando.
  private AddPreparedVessel(doc: jsPDF, widthPDF: number, heightPDF: number, positionWidth: number, positionHeight: number) {

    // BUQUE
    positionHeight += 20;
    doc.setFontSize(13);
    doc.setTextColor(22, 33, 77);
    doc.setFont('Helvetica', 'bold');
    doc.text("M/V", 10, positionHeight, { align: 'left' })
    doc.setFontSize(17);
    doc.text(this.selectUser.name, 20, positionHeight, { align: 'left' })

    // Prepared for
    positionHeight += 8;
    doc.setFontSize(8);
    doc.setTextColor(22, 33, 77);
    doc.setFont('Helvetica', 'italic');
    doc.text("Prepared for", 10, positionHeight, { align: 'left' })

    // Transgas Shipping
    positionHeight += 4.5;
    doc.setFontSize(13);
    doc.setTextColor(22, 33, 77);
    doc.setFont('Helvetica', 'bold');
    doc.text("Transgas Shipping", 10, positionHeight, { align: 'left' });

    // 27
  }


  // Resumen del viaje, todos los puerto que se navego en el viaje.
  private GenerateVoyageSumary(doc: jsPDF, widthPDF: number, heightPDF: number, positionHeight: number, listSummaryByVoyage: Voyage[], isViewBallast: boolean, isViewLaden: boolean) {


    listSummaryByVoyage.forEach(
      iVoyage => {
        // revisar si deberia ir
        positionHeight = 0;

        // Agregamos una nueva pagina
        doc.addPage();

        positionHeight += 10;
        let positionWidth = 10;

        let title: string = 'Voyage ' + iVoyage.voyageNumber + ' Summary';
        if (isViewBallast && isViewLaden) {
          title += ' (Ballast/Laden)'
        } else if (isViewBallast) {
          title += ' (Ballast)'
        } else if (isViewLaden) {
          title += ' (Laden)'
        }
        // Agregamos la cabecera a la pagina.
        positionHeight = this.AddHeaderPage(doc, widthPDF, positionHeight, title);

        ///////////////////////////////////////
        ///////// Inicio del 1° Cuadro ////////
        ///////////////////////////////////////

        // Colocamos el rectangulo
        positionHeight += 5.5;
        //positionWidth = 63;
        positionWidth = 5;

        positionHeight += this.GenerateTableSumaryVoyage(doc, widthPDF, heightPDF, positionWidth, positionHeight, iVoyage, isViewBallast, isViewLaden);


        let titleTable = 'Voyage ' + iVoyage.voyageNumber + ' Summary';
        //this.GenerateTableTotalOverallPerformanceAnalisis(doc, widthPDF, heightPDF, positionWidth, positionHeight, gTTSOPA, isViewBallast, isViewLaden, titleTable)

        this.AddFoter(doc, widthPDF, heightPDF);
      }
    )
  }

  // genera la tabla de resumen que hay dentro de un viaje.
  private GenerateTableSumaryVoyage(doc: jsPDF, widthPDF: number, heightPDF: number, positionWidth: number, positionHeight: number, voyage: Voyage, isViewBallast: boolean, isViewLaden: boolean): number {

    let title: string = 'Voyage ' + voyage.voyageNumber + ' Summary\n';
    if (isViewBallast && isViewLaden) {
      title += ' (Ballast/Laden)'
    } else if (isViewBallast) {
      title += ' (Ballast)'
    } else if (isViewLaden) {
      title += ' (Laden)'
    }


    let contentHeightTable = 0;
    // Le sumamos el espacio de la cabecera de la tabla.
    contentHeightTable += 21;

    // Si solo hay un reporte en el puerto se suma 10.6
    //contentHeightTable += 10.6;
    // SI hay mas reporter lo multiplicamos
    //contentHeightTable += 6.4*2;

    // recorreoms los viajes para saber el tamaño que tendra la tabla.
    voyage.ports.forEach(
      iPort => {


        // Calculamos la altura de la tabla
        if (iPort.dailyReports.length == 1) {
          // Si solo hay un reporte la fila tendra un tamañp de departure arriva y ballas
          // 10.6
          contentHeightTable += 10.6;
        } else {
          contentHeightTable += 6.4 * iPort.dailyReports.length;
        }

      });

    // Revisar Eliminar esto, es solo com referencia.
    /*     doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.rect(2, positionHeight, widthPDF - (2 * 2), contentHeightTable, "FD");
     */


    // Agregar la formula para saber si es IFO VLSFO LSFO
    let typeConsumptionSelectBuqueIFO = (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO');





    var data: RowInput[] = [

      // Segunda Fila
      [
        { "content": "Departure to Arrival", "colSpan": 2, "rowSpan": 2 },
        { "content": "Total Time\n(HRS)", "colSpan": 2 },
        { "content": "Total Distance\n(MI)", "colSpan": 2 },
        { "content": "Average Speed\n(KN)", "colSpan": 2 },
        { "content": "Average Speed\n(KN)\n(Charter)", "colSpan": 2 },
        { "content": "Total Consumption\n(MT)", "colSpan": 2 },
        { "content": "Daily Consumption\n(MT)", "colSpan": 2 },
        { "content": "Daily Consumption\n(MT)\n(Charter)", "colSpan": 2 },
        { "content": "Sailing Time\n(HRS)\n(Charter)", "colSpan": 2 },
        { "content": "Total Consumption\n(MT)\n(Charter)", "colSpan": 2 },
        { "content": "B\nE\nF\nO\nU\nR\nT", "colSpan": 1, "rowSpan": 2 }
      ]
    ];

    // segundo header con el calculo total.
    let rowHeader2 = [];
    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    data.push(rowHeader2);


    // esta variable nos ayudara a saber cuantas filas tendra la tabla.
    let countRow = 1;
    voyage.ports.forEach(
      iPort => {

        iPort.dailyReports.forEach(
          (iDailyReport, index, array) => {

            // Contador de filas.
            countRow += 1;

            // Tipo de navegacion
            let typeNavigation = '';
            if (iDailyReport.activityPerformed === 'SAILING_IN_BALLAST') {
              typeNavigation = '(Ballast/'+this.languageService.GetMessage(this.translateCategory, iDailyReport.speedStraction)+')';
            } else if (iDailyReport.activityPerformed === 'SAILING_WITH_LADEN') {
              typeNavigation = '(Laden/'+this.languageService.GetMessage(this.translateCategory, iDailyReport.speedStraction)+')';
            }
            let rowGenerit = [];

            // Guardamos el todal de consumo.
            let totalIFO = this.SumaIfo(iDailyReport);
            let totalMGO = this.SumaMgo(iDailyReport);

            // Obtenemos la velocidad real.
            let speedReal = iDailyReport.steamingTime ? iDailyReport.distance / iDailyReport.steamingTime : 0;

            // Obtenemos la velocidad por charter IFO y MGO
            let speedCharterIFO: number = 0;
            let speedCharterMGO: number = 0;
            if (iDailyReport.activityPerformed == 'SAILING_IN_BALLAST') {
              if (totalIFO) {
                speedCharterIFO = speedReal ? this.selectUser.contractSpeedSailingBallastIFO : 0;
              }
              if (totalMGO) {
                speedCharterMGO = speedReal ? this.selectUser.contractSpeedSailingBallastMGO : 0;
              }
            } else if (iDailyReport.activityPerformed == 'SAILING_WITH_LADEN') {
              if (totalIFO) {
                speedCharterIFO = speedReal ? this.selectUser.contractSpeedSailingLadenIFO : 0;
              }
              if (totalMGO) {
                speedCharterMGO = speedReal ? this.selectUser.contractSpeedSailingLadenMGO : 0;
              }
            }


            // Daily Consumption
            let dailyConsumptionIFO = 0;
            let dailyConsumptionMGO = 0;
            if (totalIFO) {
              dailyConsumptionIFO = iDailyReport.steamingTime ?
                (totalIFO * 24) / iDailyReport.steamingTime : 0;
            }
            if (totalMGO) {
              dailyConsumptionMGO = iDailyReport.steamingTime ?
                (totalMGO * 24) / iDailyReport.steamingTime : 0;
            }




            // Daily Consumption Charter
            let dailyConsumptionCharterIFO = 0;
            let dailyConsumptionCharterMGO = 0;
            if (iDailyReport.activityPerformed == 'SAILING_IN_BALLAST') {
              if (totalIFO) {
                dailyConsumptionCharterIFO = dailyConsumptionIFO ? this.selectUser.sailingBallastConsumptionIFO : 0;
              }
              if (totalMGO) {
                dailyConsumptionCharterMGO = dailyConsumptionMGO ? this.selectUser.sailingBallastConsumptionMGO : 0;
              }
            } else if (iDailyReport.activityPerformed == 'SAILING_WITH_LADEN') {
              if (totalIFO) {
                dailyConsumptionCharterIFO = dailyConsumptionIFO ? this.selectUser.sailingLoadConsumptionIFO : 0;
              }
              if (totalMGO) {
                dailyConsumptionCharterMGO = dailyConsumptionMGO ? this.selectUser.sailingLoadConsumptionMGO : 0;
              }
            }

            // Time Charter
            let timeCharterIFO = 0;
            let timeCharterMGO = 0;
            if (iDailyReport.activityPerformed == 'SAILING_IN_BALLAST') {
              if (totalIFO) {
                timeCharterIFO = this.selectUser.contractSpeedSailingBallastIFO ?
                  iDailyReport.distance / this.selectUser.contractSpeedSailingBallastIFO : 0;
              }
              if (totalMGO) {
                timeCharterMGO = this.selectUser.contractSpeedSailingBallastMGO ?
                  iDailyReport.distance / this.selectUser.contractSpeedSailingBallastMGO : 0;
              }
            } else if (iDailyReport.activityPerformed == 'SAILING_WITH_LADEN') {
              if (totalIFO) {
                timeCharterIFO = this.selectUser.contractSpeedSailingLadenIFO ?
                  iDailyReport.distance / this.selectUser.contractSpeedSailingLadenIFO : 0;
              }
              if (totalMGO) {
                timeCharterMGO = this.selectUser.contractSpeedSailingLadenMGO ?
                  iDailyReport.distance / this.selectUser.contractSpeedSailingLadenMGO : 0;
              }
            }


            // Consumption Charter
            let consumptionCharterIFO = 0;
            let consumptionCharterMGO = 0;
            if (totalIFO) {
              consumptionCharterIFO = (dailyConsumptionCharterIFO * timeCharterIFO) / 24;
            }
            if (totalMGO) {
              consumptionCharterMGO = (dailyConsumptionCharterMGO * timeCharterMGO) / 24;
            }

            // INICAMOS AGREGANDO EL ROW GENERIC

            // departure to arribal
            if (index == 0) {
              rowGenerit.push({ "content": iPort.departurePort + '\n' + iPort.arrivalPort + '\n' + typeNavigation, "colSpan": 2, "rowSpan": array.length });
            }

            // Time
            if (this.addInformationIFO) {
              rowGenerit.push({ "content": totalIFO ? this.MathRoundDecimal(iDailyReport.steamingTime, 1) || '' : '', "colSpan": this.addInformationMGO ? 1 : 2 });
            }
            if (this.addInformationMGO) {
              rowGenerit.push({ "content": totalMGO ? this.MathRoundDecimal(iDailyReport.steamingTime, 1) || '' : '', "colSpan": this.addInformationIFO ? 1 : 2 });
            }


            // Distance
            if (this.addInformationIFO) {
              rowGenerit.push({ "content": totalIFO ? this.MathRoundDecimal(iDailyReport.distance, 1) || '' : '', "colSpan": this.addInformationMGO ? 1 : 2 });
            }
            if (this.addInformationMGO) {
              rowGenerit.push({ "content": totalMGO ? this.MathRoundDecimal(iDailyReport.distance, 1) || '' : '', "colSpan": this.addInformationIFO ? 1 : 2 });
            }


            // Speed
            if (this.addInformationIFO) {
              rowGenerit.push({ "content": totalIFO ? this.MathRoundDecimal(speedReal, 1) || '' : '', "colSpan": this.addInformationMGO ? 1 : 2 });
            }
            if (this.addInformationMGO) {
              rowGenerit.push({ "content": totalMGO ? this.MathRoundDecimal(speedReal, 1) || '' : '', "colSpan": this.addInformationIFO ? 1 : 2 });
            }


            // Speed Charter
            if (this.addInformationIFO) {
              rowGenerit.push({ "content": totalIFO ? this.MathRoundDecimal(speedCharterIFO, 1) || '' : '', "colSpan": this.addInformationMGO ? 1 : 2 });
            }
            if (this.addInformationMGO) {
              rowGenerit.push({ "content": totalMGO ? this.MathRoundDecimal(speedCharterMGO, 1) || '' : '', "colSpan": this.addInformationIFO ? 1 : 2 });
            }


            // Consumption
            if (this.addInformationIFO) {
              rowGenerit.push({ "content": totalIFO ? this.MathRoundDecimal(totalIFO, 1) || '' : '', "colSpan": this.addInformationMGO ? 1 : 2 });
            }
            if (this.addInformationMGO) {
              rowGenerit.push({ "content": totalMGO ? this.MathRoundDecimal(totalMGO, 1) || '' : '', "colSpan": this.addInformationIFO ? 1 : 2 });
            }


            // daily Consumption
            if (this.addInformationIFO) {
              rowGenerit.push({ "content": totalIFO ? this.MathRoundDecimal(dailyConsumptionIFO, 1) || '' : '', "colSpan": this.addInformationMGO ? 1 : 2 });
            }
            if (this.addInformationMGO) {
              rowGenerit.push({ "content": totalMGO ? this.MathRoundDecimal(dailyConsumptionMGO, 1) || '' : '', "colSpan": this.addInformationIFO ? 1 : 2 });
            }

            // daily Consumption Charter
            if (this.addInformationIFO) {
              rowGenerit.push({ "content": totalIFO ? this.MathRoundDecimal(dailyConsumptionCharterIFO, 1) || '' : '', "colSpan": this.addInformationMGO ? 1 : 2 });
            }
            if (this.addInformationMGO) {
              rowGenerit.push({ "content": totalMGO ? this.MathRoundDecimal(dailyConsumptionCharterMGO, 1) || '' : '', "colSpan": this.addInformationIFO ? 1 : 2 });
            }


            // Time Charter
            if (this.addInformationIFO) {
              rowGenerit.push({ "content": totalIFO ? this.MathRoundDecimal(timeCharterIFO, 1) || '' : '', "colSpan": this.addInformationMGO ? 1 : 2 });
            }
            if (this.addInformationMGO) {
              rowGenerit.push({ "content": totalMGO ? this.MathRoundDecimal(timeCharterMGO, 1) || '' : '', "colSpan": this.addInformationIFO ? 1 : 2 });
            }



            // Consumption Charter
            if (this.addInformationIFO) {
              rowGenerit.push({ "content": totalIFO ? this.MathRoundDecimal(consumptionCharterIFO, 1) || '' : '', "colSpan": this.addInformationMGO ? 1 : 2 });
            }
            if (this.addInformationMGO) {
              rowGenerit.push({ "content": totalMGO ? this.MathRoundDecimal(consumptionCharterMGO, 1) || '' : '', "colSpan": this.addInformationIFO ? 1 : 2 });
            }
            rowGenerit.push({ "content": iDailyReport.beaufour, "colSpan": 1 });



            data.push(rowGenerit);
          }
        );




      }
    );

    // este row tiene el tota.
    let rowHeaderTotal2 = [];
    rowHeaderTotal2.push(
      { "content": "Total Calculation", "colSpan": 2, "rowSpan": 1 },
    )

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    if (this.addInformationIFO) {
      rowHeaderTotal2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }
    rowHeaderTotal2.push({ "content": "", "colSpan": 1 });
    data.push(rowHeaderTotal2);


    let SummaryVoyage: GenerateTableTotalSummaryOverallPerformanceAnalisis = this.GenerateSummaryOneVoyage(voyage);

    if (this.addSailingWithLaden) {

      let rowCalcTotalLaden = [];
      rowCalcTotalLaden.push(
        { "content": "Laden", "colSpan": 2, "rowSpan": 2 },
      )

      //Tiempo total
      if (this.addInformationIFO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.timeIFOLaden ? this.MathRoundDecimal(SummaryVoyage.timeIFOLaden, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.timeMGOLaden ? this.MathRoundDecimal(SummaryVoyage.timeMGOLaden, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Distancia toal
      if (this.addInformationIFO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.distanceIFOLaden ? this.MathRoundDecimal(SummaryVoyage.distanceIFOLaden, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.distanceMGOLaden ? this.MathRoundDecimal(SummaryVoyage.distanceMGOLaden, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Velocidad promedio
      if (this.addInformationIFO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.speedIFOLaden ? this.MathRoundDecimal(SummaryVoyage.speedIFOLaden, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.speedMGOLaden ? this.MathRoundDecimal(SummaryVoyage.speedMGOLaden, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Velocidad charter
      if (this.addInformationIFO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.speedIFOLaden ? this.MathRoundDecimal(SummaryVoyage.speedCharterIFOLaden, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.speedMGOLaden ? this.MathRoundDecimal(SummaryVoyage.speedCharterMGOLaden, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Consumo total
      if (this.addInformationIFO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.consumptionIFOLaden ? this.MathRoundDecimal(SummaryVoyage.consumptionIFOLaden, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.consumptionMGOLaden ? this.MathRoundDecimal(SummaryVoyage.consumptionMGOLaden, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Daily consumption
      if (this.addInformationIFO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.dailyConsumptionIFOLaden ? this.MathRoundDecimal(SummaryVoyage.dailyConsumptionIFOLaden, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.dailyConsumptionMGOLaden ? this.MathRoundDecimal(SummaryVoyage.dailyConsumptionMGOLaden, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Daily consumption charter
      if (this.addInformationIFO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.dailyConsumptionIFOLaden ? this.MathRoundDecimal(SummaryVoyage.dailyConsumptionCharterIFOLaden, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.dailyConsumptionMGOLaden ? this.MathRoundDecimal(SummaryVoyage.dailyConsumptionCharterMGOLaden, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Sialing time charter
      if (this.addInformationIFO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.timeCharterIFOLaden ? this.MathRoundDecimal(SummaryVoyage.timeCharterIFOLaden, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.timeCharterMGOLaden ? this.MathRoundDecimal(SummaryVoyage.timeCharterMGOLaden, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Total consumption segun charter
      if (this.addInformationIFO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.consumptionCharterIFOLaden ? this.MathRoundDecimal(SummaryVoyage.consumptionCharterIFOLaden, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalLaden.push({ "content": SummaryVoyage.consumptionCharterMGOLaden ? this.MathRoundDecimal(SummaryVoyage.consumptionCharterMGOLaden, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }
      rowCalcTotalLaden.push({ "content": "", "colSpan": 1 });
      data.push(rowCalcTotalLaden);

      // agregamos las anotaciones.
      data.push([
        { "content": SummaryVoyage.anotateTimeLaden, "colSpan": 9 },
        { "content": SummaryVoyage.anotateConsumptionLaden, "colSpan": 11 }
      ]);
    }

    if (this.addSailingInBallast) {

      let rowCalcTotalBallast = [];
      rowCalcTotalBallast.push(
        { "content": "Ballast", "colSpan": 2, "rowSpan": 2 },
      )

      //Tiempo total
      if (this.addInformationIFO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.timeIFOBallast ? this.MathRoundDecimal(SummaryVoyage.timeIFOBallast, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.timeMGOBallast ? this.MathRoundDecimal(SummaryVoyage.timeMGOBallast, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Distancia toal
      if (this.addInformationIFO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.distanceIFOBallast ? this.MathRoundDecimal(SummaryVoyage.distanceIFOBallast, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.distanceMGOBallast ? this.MathRoundDecimal(SummaryVoyage.distanceMGOBallast, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Velocidad promedio
      if (this.addInformationIFO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.speedIFOBallast ? this.MathRoundDecimal(SummaryVoyage.speedIFOBallast, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.speedMGOBallast ? this.MathRoundDecimal(SummaryVoyage.speedMGOBallast, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Velocidad charter
      if (this.addInformationIFO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.speedIFOBallast ? this.MathRoundDecimal(SummaryVoyage.speedCharterIFOBallast, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.speedMGOBallast ? this.MathRoundDecimal(SummaryVoyage.speedCharterMGOBallast, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Consumo total
      if (this.addInformationIFO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.consumptionIFOBallast ? this.MathRoundDecimal(SummaryVoyage.consumptionIFOBallast, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.consumptionMGOBallast ? this.MathRoundDecimal(SummaryVoyage.consumptionMGOBallast, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Daily consumption
      if (this.addInformationIFO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.dailyConsumptionIFOBallast ? this.MathRoundDecimal(SummaryVoyage.dailyConsumptionIFOBallast, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.dailyConsumptionMGOBallast ? this.MathRoundDecimal(SummaryVoyage.dailyConsumptionMGOBallast, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Daily consumption charter
      if (this.addInformationIFO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.dailyConsumptionIFOBallast ? this.MathRoundDecimal(SummaryVoyage.dailyConsumptionCharterIFOBallast, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.dailyConsumptionMGOBallast ? this.MathRoundDecimal(SummaryVoyage.dailyConsumptionCharterMGOBallast, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Sialing time charter
      if (this.addInformationIFO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.timeCharterIFOBallast ? this.MathRoundDecimal(SummaryVoyage.timeCharterIFOBallast, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.timeCharterMGOBallast ? this.MathRoundDecimal(SummaryVoyage.timeCharterMGOBallast, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }

      // Total consumption segun charter
      if (this.addInformationIFO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.consumptionCharterIFOBallast ? this.MathRoundDecimal(SummaryVoyage.consumptionCharterIFOBallast, 1) : '', "colSpan": this.addInformationMGO ? 1 : 2 })
      }
      if (this.addInformationMGO) {
        rowCalcTotalBallast.push({ "content": SummaryVoyage.consumptionCharterMGOBallast ? this.MathRoundDecimal(SummaryVoyage.consumptionCharterMGOBallast, 1) : '', "colSpan": this.addInformationIFO ? 1 : 2 })
      }
      rowCalcTotalBallast.push({ "content": "", "colSpan": 1 });
      data.push(rowCalcTotalBallast);

      // agregamos las anotaciones.
      data.push([
        { "content": SummaryVoyage.anotateTimeBallast, "colSpan": 9 },
        { "content": SummaryVoyage.anotateConsumptionBallast, "colSpan": 11 }
      ]);
    }

    // Opciones como usuario al generar un table.
    let userOptions: UserOptions = {};
    // Agregamos en que altura del documento podnra la tabla
    userOptions.startY = positionHeight;
    // estructura del cuerpo
    userOptions.body = data;
    // Margen que tendra nuestra tabla.
    userOptions.margin = { left: positionWidth }
    // Tamaño de nuestra tabla
    userOptions.tableWidth = 200;



    userOptions.didParseCell = (data: CellHookData) => {

      // Secction : head, body, footer
      let section = data.section;
      // guardamos la celda y verificamos que no sea underfiend
      let cell: Cell = data.cell;
      if (cell == undefined) { return; }


      // trabajaremos con el body.
      if (section == 'body') {

        // ubicacion del la fila
        let rowIndex = data.row.index;
        // ubicacion de la columna.
        let columIndex = data.column.index;
        // Raw ?????? <= agregar descripcion no lo se?
        let raw = data.row.raw;




        // Primera cabecera de la tabla Titulo
        if (rowIndex == 0) {
          // le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorWhite;
            cell.styles.textColor = this.colorTextHedear;
            cell.styles.fontSize = 9;
            cell.styles.cellPadding = 1;
          }
          if (
            columIndex == 2
            || columIndex == 4
            || columIndex == 6
            || columIndex == 8
            || columIndex == 10
            || columIndex == 12
            || columIndex == 14
            || columIndex == 16
            || columIndex == 18
          ) {
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 6;
            cell.styles.cellPadding = 1
          }
          // solo las celdas que son la suma de datos ingresados por el capitan el Blue1
          if (columIndex == 2 || columIndex == 4 || columIndex == 10) {
            cell.styles.fillColor = this.colorBlueTable1;
          }
          // Solo las celdas que tienen formulas se pintan de blue2
          if (columIndex == 6 || columIndex == 12) {
            cell.styles.fillColor = this.colorBlueTable2;
          }
          // Solo las celdas que tienen datos del charter son de locor blue3
          if (columIndex == 8 || columIndex == 14 || columIndex == 14 || columIndex == 16 || columIndex == 18) {
            cell.styles.fillColor = this.colorBlueTable3;
          }
          if (columIndex == 20) {
            cell.styles.fillColor = this.colorBlueTable3;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 6;
            cell.styles.cellPadding = 1;
          }
        }
        // Segunda cabecera y la cabecera del total.
        if (rowIndex == 1 || rowIndex == (countRow + 1)) {
          // le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorWhite;
            cell.styles.textColor = this.colorTextHedear;
            cell.styles.fontSize = 9;
            cell.styles.cellPadding = 1;
          }
          if (
            columIndex >= 2) {
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 6;
            cell.styles.cellPadding = 1
          }
          // solo las celdas que son la suma de datos ingresados por el capitan el Blue1
          if (columIndex == 2 || columIndex == 3 || columIndex == 4 || columIndex == 5 || columIndex == 10 || columIndex == 11) {
            cell.styles.fillColor = this.colorBlueTable1;
          }
          // Solo las celdas que tienen formulas se pintan de blue2
          if (columIndex == 6 || columIndex == 7 || columIndex == 12 || columIndex == 13) {
            cell.styles.fillColor = this.colorBlueTable2;
          }
          // Solo las celdas que tienen datos del charter son de locor blue3
          if (columIndex == 8 || columIndex == 9 || columIndex == 14 || columIndex == 15 || columIndex == 16 || columIndex == 17 || columIndex == 18 || columIndex == 19) {
            cell.styles.fillColor = this.colorBlueTable3;
          }
          if (columIndex == 20) {
            cell.styles.fillColor = this.colorBlueTable3;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 6;
            cell.styles.cellPadding = 1;
          }

        }


        // de aqui para adelante son los viajes.
        if ((rowIndex > 1 && rowIndex <= countRow) || (rowIndex == (countRow + 2) || rowIndex == (countRow + 4))) {

          let rawLength = Object.keys(raw).length;



          if (columIndex == 20) {
            let text = String(cell.text);
            let number = Number(text.replace('S', ''));
            if (number) {

              if (number >= 4) {

                cell.styles.textColor = this.colorTextWarning;
              }
            }
          }

          if (rawLength == 20 || rawLength == 11) {

            // nombre del viaje y numero.
            if (columIndex == 0) {
              cell.styles.fillColor = this.colorBlueTable1;
              cell.styles.textColor = this.colorWhite;
              cell.styles.fontSize = 7;
              cell.styles.cellPadding = 1;
            }
            if (
              (this.addInformationIFO && !this.addInformationMGO)
              || (this.addInformationMGO && !this.addInformationIFO)
            ) {
              // Desde la columna 2 para adelante lo pintamos de gris.
              if (columIndex >= 2) {
                cell.styles.fillColor = this.colorGris;
              }

              // Time
              if (columIndex == 2) {
                let valorCell = Number(cell.text);
                // Time charter
                let valorCharter = Number(raw[8].content);
                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }

              // Speed
              if (columIndex == 6) {
                let valorCell = Number(cell.text);
                // speed
                let valorCharter = Number(raw[4].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }


              // total consumo
              if (columIndex == 10) {
                let valorCell = Number(cell.text);
                // total ocnsumo charter 
                let valorCharter = Number(raw[9].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }



              // daily consumo
              if (columIndex == 12) {
                let valorCell = Number(cell.text);
                // total daily consumption charter
                let valorCharter = Number(raw[7].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }

            }

            // Si se selecciona los dos tipos de combustible.
            if (this.addInformationIFO && this.addInformationMGO) {
              // Desde la columna 2 para adelante lo pintamos de gris.
              if (columIndex >= 2) {
                cell.styles.fillColor = this.colorGris;
              }

              // Time
              if (columIndex == 2) {
                let valorCell = Number(cell.text);
                // Time charter
                let valorCharter = Number(raw[15].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }
              if (columIndex == 3) {
                let valorCell = Number(cell.text);
                // Time charter
                let valorCharter = Number(raw[16].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }

              // Speed
              if (columIndex == 6) {
                let valorCell = Number(cell.text);
                // speed
                let valorCharter = Number(raw[7].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }
              if (columIndex == 7) {
                let valorCell = Number(cell.text);
                // speed
                let valorCharter = Number(raw[8].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }



              // total consumo
              if (columIndex == 10) {
                let valorCell = Number(cell.text);
                // total ocnsumo charter 
                let valorCharter = Number(raw[17].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }
              if (columIndex == 11) {
                let valorCell = Number(cell.text);
                // total ocnsumo charter 
                let valorCharter = Number(raw[18].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }



              // Daily Consumo
              if (columIndex == 12) {
                let valorCell = Number(cell.text);
                // total daily consumption charter
                let valorCharter = Number(raw[13].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }
              if (columIndex == 13) {
                let valorCell = Number(cell.text);
                // total daily consumption charter
                let valorCharter = Number(raw[14].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }

            }


          } else if (rawLength == 19 || rawLength == 10) {

            // nombre del viaje y numero.
            if (columIndex == 0) {
              cell.styles.fillColor = this.colorBlueTable1;
              cell.styles.textColor = this.colorWhite;
              cell.styles.fontSize = 7;
              cell.styles.cellPadding = 1;
            }
            if (
              (this.addInformationIFO && !this.addInformationMGO)
              || (this.addInformationMGO && !this.addInformationIFO)
            ) {
              // Desde la columna 2 para adelante lo pintamos de gris.
              if (columIndex >= 2) {
                cell.styles.fillColor = this.colorGris;
              }

              // Time
              if (columIndex == 2) {
                let valorCell = Number(cell.text);
                // Time charter
                let valorCharter = Number(raw[7].content);
                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }

              // Speed
              if (columIndex == 6) {
                let valorCell = Number(cell.text);
                // speed
                let valorCharter = Number(raw[3].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }


              // total consumo
              if (columIndex == 10) {
                let valorCell = Number(cell.text);
                // total ocnsumo charter 
                let valorCharter = Number(raw[8].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }



              // daily consumo
              if (columIndex == 12) {
                let valorCell = Number(cell.text);
                // total daily consumption charter
                let valorCharter = Number(raw[6].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }

            }

            // Si se selecciona los dos tipos de combustible.
            if (this.addInformationIFO && this.addInformationMGO) {
              // Desde la columna 2 para adelante lo pintamos de gris.
              if (columIndex >= 2) {
                cell.styles.fillColor = this.colorGris;
              }

              // Time
              if (columIndex == 2) {
                let valorCell = Number(cell.text);
                // Time charter
                let valorCharter = Number(raw[14].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }
              if (columIndex == 3) {
                let valorCell = Number(cell.text);
                // Time charter
                let valorCharter = Number(raw[15].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }

              // Speed
              if (columIndex == 6) {
                let valorCell = Number(cell.text);
                // speed
                let valorCharter = Number(raw[6].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }
              if (columIndex == 7) {
                let valorCell = Number(cell.text);
                // speed
                let valorCharter = Number(raw[7].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }



              // total consumo
              if (columIndex == 10) {
                let valorCell = Number(cell.text);
                // total ocnsumo charter 
                let valorCharter = Number(raw[16].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }
              if (columIndex == 11) {
                let valorCell = Number(cell.text);
                // total ocnsumo charter 
                let valorCharter = Number(raw[17].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }



              // Daily Consumo
              if (columIndex == 12) {
                let valorCell = Number(cell.text);
                // total daily consumption charter
                let valorCharter = Number(raw[12].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }
              if (columIndex == 13) {
                let valorCell = Number(cell.text);
                // total daily consumption charter
                let valorCharter = Number(raw[13].content);

                // Verificamos si existe un valor en el charter.
                if (valorCharter && valorCell) {
                  if (valorCell < valorCharter) {
                    cell.styles.textColor = this.colorTextSuccess;
                  }
                  if (valorCell > valorCharter) {
                    cell.styles.textColor = this.colorTextWarning;
                  }
                }
              }

            }
          }


        }

        // Aqui esta la primera fila con el total.
        if (rowIndex == (countRow + 2)) {


        }
        // AQUI ESTA ANOTATE TIme Consumotion
        if (rowIndex == (countRow + 3) || rowIndex == (countRow + 5)) {
          cell.styles.cellPadding = {
            top: 1.5,
            right: 0,
            bottom: 1.5,
            left: 0
          };
          if (columIndex == 2) {
            cell.styles.fillColor = this.colorGris;
            cell.styles.fontSize = 10;
            let valorCell = Number(cell.text);
            if (valorCell < 0) {
              cell.styles.textColor = this.colorTextWarning;
              cell.text = [this.MathRoundDecimal(-valorCell, 1) + " Hours Lost"];
            }
            if (valorCell > 0) {
              cell.styles.textColor = this.colorTextSuccess;
              cell.text = [this.MathRoundDecimal(valorCell, 1) + " Hours Saved"];
            }
            if (valorCell == 0) {
              cell.text = ["-----"];
            }
          }


          if (columIndex == 11) {
            cell.styles.fillColor = this.colorGris;
            cell.styles.fontSize = 10;
            let valorCell = Number(cell.text);
            if (valorCell < 0) {
              cell.styles.textColor = this.colorTextWarning;
              cell.text = ["Consumption Outside The Guaranteed Limits"];
            }
            if (valorCell > 0) {
              cell.styles.textColor = this.colorTextSuccess;
              cell.text = ["Consumption Within The Guaranteed Limits"];

            }

            if (valorCell == 0) {
              cell.text = ["-----"];
            }
          }
        }
        // aqui esta la ultima fila


















      }


    }




    // Total suma 136, pero el widt es 136 hay que revisar.
    userOptions.columnStyles = {
      0: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      1: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      2: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      3: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      4: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      5: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.2,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      6: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      7: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      8: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      9: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      10: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      11: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      12: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      13: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      14: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      15: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      16: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      17: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      18: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      19: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      20: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 9.5,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      }
    };



    autoTable(doc, userOptions);


    return contentHeightTable;
  }

  // Retorna el resumen de un viaje.
  private GenerateSummaryOneVoyage(iVoyage: Voyage): GenerateTableTotalSummaryOverallPerformanceAnalisis {


    let gTTSOPA: GenerateTableTotalSummaryOverallPerformanceAnalisis = new GenerateTableTotalSummaryOverallPerformanceAnalisis();




    // recorreoms los viajes para saber el tamaño que tendra la tabla.
    iVoyage.ports.forEach(
      iPort => {
        iPort.dailyReports.forEach(
          dailyReport => {

            let totalIFO = this.SumaIfo(dailyReport);
            let totalMGO = this.SumaMgo(dailyReport);
            // Verificamos si es navegando con carga
            if (this.addSailingInBallast && dailyReport.activityPerformed === 'SAILING_IN_BALLAST') {
              // Solo si hay consumo sumamos el tiempo, distancia y consumo
              if (this.addInformationIFO && totalIFO) {
                gTTSOPA.distanceIFOBallast += dailyReport.distance;
                gTTSOPA.timeIFOBallast += dailyReport.steamingTime;
                gTTSOPA.consumptionIFOBallast += totalIFO;
              }
              if (this.addInformationMGO && totalMGO) {
                gTTSOPA.distanceMGOBallast += dailyReport.distance;
                gTTSOPA.timeMGOBallast += dailyReport.steamingTime;
                gTTSOPA.consumptionMGOBallast += totalMGO;
              }
              // Verificamos si es la actividad navegando sin carga
            } else if (this.addSailingWithLaden && dailyReport.activityPerformed === 'SAILING_WITH_LADEN') {

              // Solo si hay consumo sumamos el tiempo, distancia y consumo
              if (this.addInformationIFO && totalIFO) {
                gTTSOPA.distanceIFOLaden += dailyReport.distance;
                gTTSOPA.timeIFOLaden += dailyReport.steamingTime;
                gTTSOPA.consumptionIFOLaden += totalIFO;
              }
              if (this.addInformationMGO && totalMGO) {
                gTTSOPA.distanceMGOLaden += dailyReport.distance;
                gTTSOPA.timeMGOLaden += dailyReport.steamingTime;
                gTTSOPA.consumptionMGOLaden += totalMGO;
              }
            }
          }
        )
      });


    if (this.addSailingInBallast) {

      if (this.addInformationIFO) {
        // Validamos y calculamos el tiempo que debio aver navegado segun la velocidad del charter.
        gTTSOPA.timeCharterIFOBallast = this.selectUser.contractSpeedSailingBallastIFO ?
          gTTSOPA.distanceIFOBallast / this.selectUser.contractSpeedSailingBallastIFO : 0;


        // VELOCIDAD
        gTTSOPA.speedIFOBallast = gTTSOPA.timeIFOBallast ?
          gTTSOPA.distanceIFOBallast / gTTSOPA.timeIFOBallast : 0;


        // Velocidad Charter
        gTTSOPA.speedCharterIFOBallast = this.selectUser.contractSpeedSailingBallastIFO;


        // Daily Consumption IFO
        gTTSOPA.dailyConsumptionIFOBallast = gTTSOPA.timeIFOBallast ?
          (gTTSOPA.consumptionIFOBallast * 24) / gTTSOPA.timeIFOBallast : 0;


        // DailyConsumption IFO Charter
        gTTSOPA.dailyConsumptionCharterIFOBallast = this.selectUser.sailingBallastConsumptionIFO;


        // Consumo por charter
        gTTSOPA.consumptionCharterIFOBallast = (gTTSOPA.dailyConsumptionCharterIFOBallast * gTTSOPA.timeCharterIFOBallast) / 24;



        // Calculamos el time annotate
        gTTSOPA.anotateTimeBallastIFO = gTTSOPA.timeCharterIFOBallast ? gTTSOPA.timeCharterIFOBallast - gTTSOPA.timeIFOBallast : 0;
        gTTSOPA.anotateConsumptionBallastIFO = gTTSOPA.dailyConsumptionCharterIFOBallast ? gTTSOPA.dailyConsumptionCharterIFOBallast - gTTSOPA.dailyConsumptionIFOBallast : 0;

      }
      if (this.addInformationMGO) {
        // Validamos y calculamos el tiempo que debio aver navegado segun la velocidad del charter.
        gTTSOPA.timeCharterMGOBallast = this.selectUser.contractSpeedSailingBallastMGO ?
          gTTSOPA.distanceMGOBallast / this.selectUser.contractSpeedSailingBallastMGO : 0;


        // VELOCIDAD
        gTTSOPA.speedMGOBallast = gTTSOPA.timeMGOBallast ?
          gTTSOPA.distanceMGOBallast / gTTSOPA.timeMGOBallast : 0;


        // Velocidad Charter
        gTTSOPA.speedCharterMGOBallast = this.selectUser.contractSpeedSailingBallastMGO;


        // Daily Consumption MGO
        gTTSOPA.dailyConsumptionMGOBallast = gTTSOPA.timeMGOBallast ?
          (gTTSOPA.consumptionMGOBallast * 24) / gTTSOPA.timeMGOBallast : 0;


        // DailyConsumption MGO Charter
        gTTSOPA.dailyConsumptionCharterMGOBallast = this.selectUser.sailingBallastConsumptionMGO;

        // Consumo por charter
        gTTSOPA.consumptionCharterMGOBallast = (gTTSOPA.dailyConsumptionCharterMGOBallast * gTTSOPA.timeCharterMGOBallast) / 24;



        // Calculamos el time annotate
        gTTSOPA.anotateTimeBallastMGO = gTTSOPA.timeCharterMGOBallast ? gTTSOPA.timeCharterMGOBallast - gTTSOPA.timeMGOBallast : 0;
        gTTSOPA.anotateConsumptionBallastMGO = gTTSOPA.dailyConsumptionCharterMGOBallast ? gTTSOPA.dailyConsumptionCharterMGOBallast - gTTSOPA.dailyConsumptionMGOBallast : 0;
      }
    }
    // Laden
    if (this.addSailingWithLaden) {

      if (this.addInformationIFO) {
        // Validamos y calculamos el tiempo que debio aver navegado segun la velocidad del charter.
        gTTSOPA.timeCharterIFOLaden = this.selectUser.contractSpeedSailingLadenIFO ?
          gTTSOPA.distanceIFOLaden / this.selectUser.contractSpeedSailingLadenIFO : 0;


        // VELOCIDAD
        gTTSOPA.speedIFOLaden = gTTSOPA.timeIFOLaden ?
          gTTSOPA.distanceIFOLaden / gTTSOPA.timeIFOLaden : 0;


        // Velocidad Charter
        gTTSOPA.speedCharterIFOLaden = this.selectUser.contractSpeedSailingLadenIFO;



        // Daily Consumption MGO
        gTTSOPA.dailyConsumptionIFOLaden = gTTSOPA.timeIFOLaden ?
          (gTTSOPA.consumptionIFOLaden * 24) / gTTSOPA.timeIFOLaden : 0;




        // DailyConsumption IFO Charter
        gTTSOPA.dailyConsumptionCharterIFOLaden = this.selectUser.sailingLoadConsumptionIFO;


        // Conusmo diario calculado segun el charter.
        gTTSOPA.consumptionCharterIFOLaden = (gTTSOPA.dailyConsumptionCharterIFOLaden * gTTSOPA.timeCharterIFOLaden) / 24;



        // Anotate TIME
        gTTSOPA.anotateTimeLadenIFO = gTTSOPA.timeCharterIFOLaden ? gTTSOPA.timeCharterIFOLaden - gTTSOPA.timeIFOLaden : 0;

        // Anotate Laden
        gTTSOPA.anotateConsumptionLadenIFO = gTTSOPA.dailyConsumptionCharterIFOLaden ? gTTSOPA.dailyConsumptionCharterIFOLaden - gTTSOPA.dailyConsumptionIFOLaden : 0;

      }
      if (this.addInformationMGO) {
        // Validamos y calculamos el tiempo que debio aver navegado segun la velocidad del charter.
        gTTSOPA.timeCharterMGOLaden = this.selectUser.contractSpeedSailingLadenMGO ?
          gTTSOPA.distanceMGOLaden / this.selectUser.contractSpeedSailingLadenMGO : 0;


        // VELOCIDAD
        gTTSOPA.speedMGOLaden = gTTSOPA.timeMGOLaden ?
          gTTSOPA.distanceMGOLaden / gTTSOPA.timeMGOLaden : 0;


        // Velocidad Charter
        gTTSOPA.speedCharterMGOLaden = this.selectUser.contractSpeedSailingLadenMGO;



        // Daily Consumption MGO
        gTTSOPA.dailyConsumptionMGOLaden = gTTSOPA.timeMGOLaden ?
          (gTTSOPA.consumptionMGOLaden * 24) / gTTSOPA.timeMGOLaden : 0;



        // DailyConsumption MGO Charter
        gTTSOPA.dailyConsumptionCharterMGOLaden = this.selectUser.sailingLoadConsumptionMGO;



        // Consumo MGO Charter
        gTTSOPA.consumptionCharterMGOLaden = (gTTSOPA.dailyConsumptionCharterMGOLaden * gTTSOPA.timeCharterMGOLaden) / 24;

        // Anotate TIME
        gTTSOPA.anotateTimeLadenMGO = gTTSOPA.timeCharterMGOLaden ? gTTSOPA.timeCharterMGOLaden - gTTSOPA.timeMGOLaden : 0;

        // Anotate Laden
        gTTSOPA.anotateConsumptionLadenMGO = gTTSOPA.dailyConsumptionCharterMGOLaden ? gTTSOPA.dailyConsumptionCharterMGOLaden - gTTSOPA.dailyConsumptionMGOLaden : 0;

      }

    }

    gTTSOPA.anotateTimeBallast = gTTSOPA.anotateTimeBallastIFO + gTTSOPA.anotateTimeBallastMGO;
    gTTSOPA.anotateTimeLaden = gTTSOPA.anotateTimeLadenIFO + gTTSOPA.anotateTimeLadenMGO;


    gTTSOPA.anotateConsumptionBallast = gTTSOPA.anotateConsumptionBallastIFO + gTTSOPA.anotateConsumptionBallastMGO;
    gTTSOPA.anotateConsumptionLaden = gTTSOPA.anotateConsumptionLadenIFO + gTTSOPA.anotateConsumptionLadenMGO;

    return gTTSOPA;
  }

  // agrega un fotter al final de la hora.
  private AddFoter(doc: jsPDF, widthPDF: number, heightPDF: number) {

    this.numberPage += 1;
    let pageFooter = heightPDF - 10;

    doc.setDrawColor(22, 33, 77);
    doc.setFillColor(22, 33, 77);
    doc.rect(10, pageFooter, widthPDF - 20, 0.5, "FD");
    pageFooter += 4;

    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(22, 33, 77);

    doc.text('Page ' + this.numberPage, 10, pageFooter, { align: 'left' });
    doc.text('Transgas Shipping Lines All Rights Reserved. © 2021', widthPDF - 10, pageFooter, { align: 'right' });

  }

  // Opcion para agregar un chart.
  private async AddChart(doc: jsPDF, widthPDF: number, heightPDF: number, positionWidth: number, positionHeight: number, isChartInOnePage: boolean) {


    return await Promise.resolve(true).then(
      (result: boolean) => {


        // Esperamos una milesima de un segundo para tomar la captura al html
        // esto se debe a un problema del renderizado.
        return this.CreateCustomTimeout(0.1);

      }
    ).then(
      (result: boolean) => {
        // Verificamos si se tiene que agregar el cuadro ballast
        if (this.addSailingInBallast) {
          // Agregamos el cuadro.
          return this.ChartBallast(doc, widthPDF, positionHeight);
        } else {
          return positionHeight;
        }

      }
    ).then(
      (resultPositionActualt: number) => {

        // Verificamos si se tiene que agregar el cuadro laden
        if (this.addSailingWithLaden) {
          // Verificamos si se agrego el cuadro ballast.
          // Para sumarle +10
          if (this.addSailingInBallast) { positionHeight = resultPositionActualt + 10; }
          // Agregamos el cuadro.
          return this.ChartLaden(doc, widthPDF, positionHeight);
        } else {
          return positionHeight;
        }

      }
    ).then(
      (resultPositionActualt: number) => {
        return true;
      }
    );
  }


  // El chart tiene un tamaño de 113
  // Retorna la pocion luefo de agregar el chart,
  private async ChartBallast(doc: jsPDF, widthPDF: number, positionHeight: number): Promise<number> {
    return await Promise.resolve(true).then(
      (result: boolean) => {

        doc.setFontSize(15);
        doc.setTextColor(22, 33, 77);
        doc.setFont('Helvetica', 'bold');
        doc.text('Performance Analysis Graph (Ballast)', widthPDF / 2, positionHeight, { align: 'center' })
        positionHeight += 3;

        // Revisar AQUI DEBERIAMOS DE VIALIDAR SI LA IMAGEN DEVERIA IR A UNA NUEVA PGINA
        const options = {
          background: 'black',
          scale: 1
        };

        let elementlineaSpeed: HTMLElement = document.getElementById('dash-line-Overall-Performance-Ballast');

        return html2canvas(elementlineaSpeed, options);
      }
    ).then(
      (canvas: any) => {

        // Si el elemento canvas existe.de
        if (canvas) {
          // Obtenemos la imagen
          let img = canvas.toDataURL('image/PNG');

          let mgProps = (doc as any).getImageProperties(img);

          // Calculamos un tamaño para el pdf.
          let widthDash = widthPDF - 10;// Tamaño del pdf menos el margen
          let HeightDash = 110;// Tamaño del pdf menos el margen

          // Agregamos la imagen al pdf.
          doc.addImage(img, 'PNG', 5, positionHeight, widthDash, HeightDash, undefined, 'FAST');
          /*
          doc.setDrawColor(0);
             doc.setFillColor(255, 255, 255);
             doc.rect(5, positionHeight, widthDash, HeightDash, "FD"); */
          positionHeight += HeightDash;

          return positionHeight;
        }
      });
  }

  // El chart tiene un tamaño de 113
  // Retorna la pocion luefo de agregar el chart,
  private async ChartLaden(doc: jsPDF, widthPDF: number, positionHeight: number): Promise<number> {
    return await Promise.resolve(true).then(
      (result: boolean) => {

        doc.setFontSize(15);
        doc.setTextColor(22, 33, 77);
        doc.setFont('Helvetica', 'bold');
        doc.text('Performance Analysis Graph (Laden)', widthPDF / 2, positionHeight, { align: 'center' })
        positionHeight += 3;

        // Revisar AQUI DEBERIAMOS DE VIALIDAR SI LA IMAGEN DEVERIA IR A UNA NUEVA PGINA
        const options = {
          background: 'black',
          scale: 1
        };

        let elementlineaSpeed: HTMLElement = document.getElementById('dash-line-Overall-Performance-Laden');

        return html2canvas(elementlineaSpeed, options);
      })
      .then((canvas: any) => {

        // Si el elemento canvas existe.de
        if (canvas) {
          // Obtenemos la imagen
          let img = canvas.toDataURL('image/PNG');

          let mgProps = (doc as any).getImageProperties(img);

          // Calculamos un tamaño para el pdf.
          let widthDash = widthPDF - 10;// Tamaño del pdf menos el margen
          let HeightDash = 110;// Tamaño del pdf menos el margen

          // Agregamos la imagen al pdf.
          doc.addImage(img, 'PNG', 5, positionHeight, widthDash, HeightDash, undefined, 'FAST');
          /*
          doc.setDrawColor(0);
             doc.setFillColor(255, 255, 255);
             doc.rect(5, positionHeight, widthDash, HeightDash, "FD"); */
          positionHeight += HeightDash;
          // Titulo del pdf.   positionHeight += HeightDash;

          return positionHeight;
        }
      });
  }

  // Formas de crear un tiempo de espera, tiempo muerto-
  private TimeOut(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  private CreateCustomTimeout(seconds) {
    return new Promise((resolve: any, reject) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  }



  // Genera el cuadro de 
  // Overall Performance Analysis
  // retorna el tamaño de la tabla
  private GenerateTableInfoConsumptionBunkering(doc: jsPDF, widthPDF: number, heightPDF: number, positionWidth: number, positionHeight: number, listInfoVoyageROBBunkering: GetInfoVoyageROBBunkering[], startFuelIFO: number, startFuelMGO: number): number {


    // Esta variable tiene, suma todos los tamaños que se agregara, para saber el tamaño final de la tanbla (Informacion.)
    let contentHeightTable = 0;

    // Le sumamos el espacio de la cabecera de la tabla.
    contentHeightTable += 19.9;
    // Cada fila ocupa lo siguiente.
    contentHeightTable += (6.25 * listInfoVoyageROBBunkering.length);
    // Fotter de la tabla
    contentHeightTable += 25.8;

    // Revisar Eliminar esto, es solo com referencia.
    /*     doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.rect(2, positionHeight, widthPDF - (2 * 2), contentHeightTable, "FD");
    
     */
    // Agregar la formula para saber si es IFO VLSFO LSFO
    let typeConsumptionSelectBuqueIFO = (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO');


    var data: RowInput[] = [
      // Primera Header
      [
        { "content": "Summary by Voyage", "colSpan": 2, "rowSpan": 2 },
        { "content": "Information at the\nbeginning of the voyage", "colSpan": 4 },
        { "content": "Fuel consumption", "colSpan": 2 },
        { "content": "Information at the\nend of the voyage", "colSpan": 4 },
        { "content": "Bunkering information", "colSpan": 8 }
      ]
    ];

    // Segundo header
    let rowHeader2 = [];

    // Info
    rowHeader2.push({ "content": "Date", "colSpan": 2 })
    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    // Fuel
    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    // Info
    rowHeader2.push({ "content": "Date", "colSpan": 2 })
    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }

    // Bunkering
    rowHeader2.push({ "content": "Date", "colSpan": 2 })
    rowHeader2.push({ "content": "Port", "colSpan": 2 })
    if (this.addInformationIFO) {
      rowHeader2.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeader2.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }
    rowHeader2.push({ "content": "Observation", "colSpan": 2 })

    // agregar header 2
    data.push(rowHeader2);


    // Consumo total Ifo y MGO
    let totalVoyageConsumptionIFO = 0;
    let totalVoyageConsumptionMGO = 0;
    // bunkering total IFO y MGO
    let totalVoyageBunkeringIFO = 0;
    let totalVoyageBunkeringMGO = 0;

    // Esta variable nos ayudara a saber cuantas lineas seran inceratada.
    let countRaw: number = 1;
    // Recorremos la lista de informacion de combustible y de faena.
    listInfoVoyageROBBunkering.forEach(
      item => {

        countRaw += 1;

        // Total de consumo.
        totalVoyageConsumptionIFO += item.totalIFO;
        totalVoyageConsumptionMGO += item.totalMGO;

        // Esta variables se estan creando para sumar el total de bunkering que se hizo en el viaje.
        let totalBunkeringIFO = 0;
        let totalBunkeringMGO = 0;

        item.listInfoBunkering.forEach(
          itemInfoBunkering => {
            totalBunkeringIFO += itemInfoBunkering.bunkeringIfo;
            totalBunkeringMGO += itemInfoBunkering.bunkeringMgo;
          }
        );

        // Total de bunkering.
        totalVoyageBunkeringIFO += totalBunkeringIFO;
        totalVoyageBunkeringMGO += totalBunkeringMGO;
        // 
        let rowSpan = item.listInfoBunkering.length || 1;


        let setData = [];
        // Info
        setData.push({ "content": "Voyage " + item.voyageNumber, "colSpan": 2, "rowSpan": rowSpan });
        setData.push({ "content": FormatYYYYMMDD(item.minDate), "colSpan": 2, "rowSpan": rowSpan });
        if (this.addInformationIFO) {
          setData.push({ "content": this.MathRoundDecimal(startFuelIFO, 1), "colSpan": this.addInformationMGO ? 1 : 2, "rowSpan": rowSpan });
        }
        if (this.addInformationMGO) {
          setData.push({ "content": this.MathRoundDecimal(startFuelMGO, 1), "colSpan": this.addInformationIFO ? 1 : 2, "rowSpan": rowSpan });
        }

        // Total de consumo.
        // Fuel
        if (this.addInformationIFO) {
          setData.push({ "content": this.MathRoundDecimal(item.totalIFO, 1), "colSpan": this.addInformationMGO ? 1 : 2, "rowSpan": rowSpan });
        }
        if (this.addInformationMGO) {
          setData.push({ "content": this.MathRoundDecimal(item.totalMGO, 1), "colSpan": this.addInformationIFO ? 1 : 2, "rowSpan": rowSpan });
        }

        // Con cuanto terminamos.
        startFuelIFO += totalBunkeringIFO;
        startFuelIFO -= item.totalIFO;
        startFuelMGO += totalBunkeringMGO;
        startFuelMGO -= item.totalMGO;
        // Info
        setData.push({ "content": FormatYYYYMMDD(item.maxDate), "colSpan": 2, "rowSpan": rowSpan });
        if (this.addInformationIFO) {
          setData.push({ "content": this.MathRoundDecimal(startFuelIFO, 1), "colSpan": this.addInformationMGO ? 1 : 2, "rowSpan": rowSpan });
        }
        if (this.addInformationMGO) {
          setData.push({ "content": this.MathRoundDecimal(startFuelMGO, 1), "colSpan": this.addInformationIFO ? 1 : 2, "rowSpan": rowSpan });
        }

        if (item.listInfoBunkering.length == 0) {

          setData.push({ "content": "", "colSpan": 8, "rowSpan": rowSpan });
          data.push(setData);

        } else {

          // Recorremos el bunkering y lo agregamos.
          item.listInfoBunkering.forEach(
            (itemInfoBunkering, index) => {
              // Solo al inicio le agreegamos el bunkerin al mismo del setData.
              if (index === 0) {

                // SetData 
                setData.push({ "content": FormatYYYYMMDD(itemInfoBunkering.dailyReportDate), "colSpan": 2, "rowSpan": 1 });
                setData.push({ "content": itemInfoBunkering.portDeparture, "colSpan": 2, "rowSpan": 1 });
                if (this.addInformationIFO) {
                  setData.push({ "content": this.MathRoundDecimal(itemInfoBunkering.bunkeringIfo, 1), "colSpan": this.addInformationMGO ? 1 : 2, "rowSpan": 1 });
                }
                if (this.addInformationMGO) {
                  setData.push({ "content": this.MathRoundDecimal(itemInfoBunkering.bunkeringMgo, 1), "colSpan": this.addInformationIFO ? 1 : 2, "rowSpan": 1 });
                }
                setData.push({ "content": itemInfoBunkering.observation, "colSpan": 2, "rowSpan": 1 });

                data.push(setData);
              } else {
                countRaw += 1;

                let setDataBunkering = [];

                setDataBunkering.push({ "content": FormatYYYYMMDD(itemInfoBunkering.dailyReportDate), "colSpan": 2, "rowSpan": 1 });
                setDataBunkering.push({ "content": itemInfoBunkering.portDeparture, "colSpan": 2, "rowSpan": 1 }); rowSpan
                if (this.addInformationIFO) {
                  setDataBunkering.push({ "content": this.MathRoundDecimal(itemInfoBunkering.bunkeringIfo, 1), "colSpan": this.addInformationMGO ? 1 : 2, "rowSpan": 1 });
                }
                if (this.addInformationMGO) {
                  setDataBunkering.push({ "content": this.MathRoundDecimal(itemInfoBunkering.bunkeringMgo, 1), "colSpan": this.addInformationIFO ? 1 : 2, "rowSpan": 1 });
                }
                setDataBunkering.push({ "content": itemInfoBunkering.observation, "colSpan": 2, "rowSpan": 1 });

                data.push(setDataBunkering);
              };

            }
          );
        }


      }
    );


    // Segundo header
    let rowHeaderTotal = [];
    // Info
    rowHeaderTotal.push({ "content": "Total Consumption", "colSpan": 6, "rowSpan": 2 })
    if (this.addInformationIFO) {
      rowHeaderTotal.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }
    // Info
    rowHeaderTotal.push({ "content": "Total Bunkering", "colSpan": 8, "rowSpan": 2 })
    // Fuel
    if (this.addInformationIFO) {
      rowHeaderTotal.push({ "content": typeConsumptionSelectBuqueIFO, "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowHeaderTotal.push({ "content": "MGO", "colSpan": this.addInformationIFO ? 1 : 2 })
    }
    rowHeaderTotal.push({ "content": "", "colSpan": 2, "rowSpan": 2 })
    // agregar header 2
    data.push(rowHeaderTotal);


    // Total
    let rowTotal = []
    if (this.addInformationIFO) {
      rowTotal.push({ "content": this.MathRoundDecimal(totalVoyageConsumptionIFO, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowTotal.push({ "content": this.MathRoundDecimal(totalVoyageConsumptionMGO, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
    }
    // Total bunkerinf
    if (this.addInformationIFO) {
      rowTotal.push({ "content": this.MathRoundDecimal(totalVoyageBunkeringIFO, 1), "colSpan": this.addInformationMGO ? 1 : 2 })
    }
    if (this.addInformationMGO) {
      rowTotal.push({ "content": this.MathRoundDecimal(totalVoyageBunkeringMGO, 1), "colSpan": this.addInformationIFO ? 1 : 2 })
    }
    // agregar Total
    data.push(rowTotal);


    // Opciones como usuario al generar un table.
    let userOptions: UserOptions = {};
    // Agregamos en que altura del documento podnra la tabla
    userOptions.startY = positionHeight;
    // estructura del cuerpo
    userOptions.body = data;
    // Margen que tendra nuestra tabla.
    userOptions.margin = { left: positionWidth }
    // Tamaño de nuestra tabla
    userOptions.tableWidth = 200;

    // esta variable nos ayudara a saber si la linea lleva color o no
    let addColor = true;

    userOptions.didParseCell = (data: CellHookData) => {

      // Secction : head, body, footer
      let section = data.section;
      // guardamos la celda y verificamos que no sea underfiend
      let cell: Cell = data.cell;
      if (cell == undefined) { return; }

      // trabajaremos con el body.
      if (section == 'body') {

        // ubicacion del la fila
        let rowIndex = data.row.index;
        // ubicacion de la columna.
        let columIndex = data.column.index;
        // Raw ?????? <= agregar descripcion no lo se?
        let raw: any = data.row.raw;

        // primera Fila
        if (rowIndex == 0) {

          cell.styles.cellPadding = {
            top: 2,
            right: 0,
            bottom: 2,
            left: 0
          };
          // le damos un color y le aumentamos de tamaño a la primera columna.
          if (columIndex == 0) {
            cell.styles.fillColor = this.colorWhite;
            cell.styles.textColor = this.colorTextHedear;
            cell.styles.fontSize = 8;
            cell.styles.cellPadding = 1;
          }
          if (columIndex == 2) {
            cell.styles.fillColor = this.colorBlueTable1;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }
          if (columIndex == 6) {
            cell.styles.fillColor = this.colorBlueTable2;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }
          if (columIndex == 8) {
            cell.styles.fillColor = this.colorBlueTable1;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }
          if (columIndex == 12) {
            cell.styles.fillColor = this.colorBlueTable1;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }

        }

        // segunda cabecera.
        if (rowIndex == 1) {
          cell.styles.fillColor = this.colorBlueTable1;
          cell.styles.textColor = this.colorWhite;
          cell.styles.fontSize = 8;
          cell.styles.cellPadding = {
            top: 1,
            right: 0,
            bottom: 1,
            left: 0
          };
          if (columIndex == 4) {
            cell.styles.fontSize = 7;
          }
          if (columIndex == 6) {
            cell.styles.fillColor = this.colorBlueTable2;
            cell.styles.fontSize = 7;
          }
          if (columIndex == 7) {
            cell.styles.fillColor = this.colorBlueTable2;
          }
          if (columIndex == 10) {
            cell.styles.fontSize = 7;
          }
          if (columIndex == 16) {
            cell.styles.fontSize = 7;
          }
        }

        // apartir de la 3 fila empieza a llenarce desde el arreglo.
        if (rowIndex >= 2 && rowIndex <= countRaw) {
          cell.styles.cellPadding = {
            top: 1,
            right: 0,
            bottom: 1,
            left: 0
          };
          if (columIndex < 12) {
            cell.styles.fillColor = addColor ? this.colorWhite : this.colorGris;
          } else {
            cell.styles.fillColor = this.colorWhite;
          }

          if (columIndex == 0) {
            cell.styles.fillColor = this.colorBlueTable1;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 7.5;
            cell.styles.cellPadding = 1;
          }


          // existe entre 12 o es diferente a 10 le pones un color qque identifiaca al bunkeirng
          if (columIndex >= 12
            &&
            (
              (this.addInformationIFO && this.addInformationMGO && (raw.length != 10))
              ||
              (this.addInformationIFO && !this.addInformationMGO && (raw.length != 7))
              ||
              (!this.addInformationIFO && this.addInformationMGO && (raw.length != 7))
            )

          ) {

            cell.styles.fillColor = this.colorGreen;
          }

          if (columIndex < 12) {

            if (columIndex == 0) {
              addColor = !addColor;
            }

          }
          // observaciones mas chico para que entre mas texto
          if (columIndex == 18) {
            cell.styles.fontSize = 6;
          }
        }


        // Le sumo 1 que es el header
        if (rowIndex == (countRaw + 1)) {
          cell.styles.fillColor = this.colorWhite;

          cell.styles.cellPadding = {
            top: 1,
            right: 0,
            bottom: 1,
            left: 0
          };

          //TITLE
          if (columIndex == 0) {
            cell.styles.textColor = this.colorTextHedear;
            cell.styles.fontSize = 10;
          }
          // VLSFO
          if (columIndex == 6) {
            cell.styles.fillColor = this.colorBlueTable2;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 7;
          }
          // MGO
          if (columIndex == 7) {
            cell.styles.fillColor = this.colorBlueTable2;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }

          //TITLE
          if (columIndex == 8) {
            cell.styles.textColor = this.colorTextHedear;
            cell.styles.fontSize = 10;
          }
          // VLSFO
          if (columIndex == 16) {
            cell.styles.fillColor = this.colorBlueTable2;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 7;
          }
          // MGO
          if (columIndex == 17) {
            cell.styles.fillColor = this.colorBlueTable2;
            cell.styles.textColor = this.colorWhite;
            cell.styles.fontSize = 8;
          }

        }


        // La segunda fila es el total en numero
        if (rowIndex == (countRaw + 2)) {
          cell.styles.cellPadding = {
            top: 1,
            right: 0,
            bottom: 1,
            left: 0
          };
          cell.styles.fontSize = 7;
        }


      }


    }


    // Total suma 200, pero el widt es 200 hay que revisar.
    userOptions.columnStyles = {
      0: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 8,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      1: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 8,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      2: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 7,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      3: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 7,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      4: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      5: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 10,
        lineWidth: 0.2,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      6: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      7: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      // fecha de fin
      8: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 7,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      9: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 7,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      10: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      11: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      12: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 7,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      13: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 7,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      14: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      15: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      16: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      17: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      18: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 21,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      },
      19: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 7,
        cellWidth: 21,
        lineWidth: 0.15,
        lineColor: [22, 33, 77],
        valign: 'middle',
      }
    };


    // Agregamos la tabla.
    autoTable(doc, userOptions);


    return contentHeightTable;
  }



  // Obtenemos la informacion del viaje( Conusmo y faena)
  private GetInfoVoyageROBAndBunkeringByBuqueAndDate(userId: number, startDate: string, endDate: string): Observable<GetInfoVoyageROBBunkering[]> {

    // Obtenemos la informacion desde un servicio.
    return this.dailyReportService.GetInfoVoyageROBAndBunkeringByBuqueAndDate(userId, startDate, endDate).pipe(map(
      (resultGet: GetInfoVoyageROBBunkering[]) => {

        // Verificamos que los datos sean ok.
        if (!resultGet && resultGet.length > 0) throw 'ERROR_GET_INFO';

        // retornamos el resultado.
        return resultGet;
      }
    ));

  }

  // Obtenemos la info del combustible inicio fin
  private GetInfoFuelStartEndByFilterDate(userId: number, startDate: string, endDate: string): Observable<InfoFuelStartEndForDate> {
    // Obtenemos el rob de inicio y el consumo hecho en el filtro.
    // Obtenemos todos los usuarios
    return this.dailyReportService.GetStartEndROByFilterDate(userId, startDate, endDate).pipe(map(
      (resultGetROBByUser: GetROBByUser[]) => {

        if (!resultGetROBByUser && resultGetROBByUser.length > 0) throw 'ERROR_GET_ROB_BY_USER';

        // Trabajaremos con las siguientes variables.
        let startDataROB: GetROBByUser = new GetROBByUser();
        let endDataROB: GetROBByUser = new GetROBByUser()

        // IFO
        startDataROB.total_ifo = this.MathRoundDecimal(resultGetROBByUser[0].total_bunkering_ifo - resultGetROBByUser[0].total_ifo, 1);
        startDataROB.total_mgo = this.MathRoundDecimal(resultGetROBByUser[0].total_bunkering_mgo - resultGetROBByUser[0].total_mgo, 1);
        startDataROB.total_bunkering_ifo = this.MathRoundDecimal(resultGetROBByUser[0].total_bunkering_ifo, 1);
        startDataROB.total_bunkering_mgo = this.MathRoundDecimal(resultGetROBByUser[0].total_bunkering_mgo, 1);

        // MGO
        endDataROB.total_ifo = this.MathRoundDecimal(startDataROB.total_ifo + (resultGetROBByUser[1].total_bunkering_ifo - resultGetROBByUser[1].total_ifo), 1);
        endDataROB.total_mgo = this.MathRoundDecimal(startDataROB.total_mgo + (resultGetROBByUser[1].total_bunkering_mgo - resultGetROBByUser[1].total_mgo), 1);
        endDataROB.total_bunkering_ifo = this.MathRoundDecimal(resultGetROBByUser[1].total_bunkering_ifo, 1);
        endDataROB.total_bunkering_mgo = this.MathRoundDecimal(resultGetROBByUser[1].total_bunkering_mgo, 1);

        return new InfoFuelStartEndForDate(
          startDataROB,
          endDataROB
        );
      }
    ));

  }


}