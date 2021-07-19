import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { Chart } from 'chart.js';
import jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import autoTable, { Cell, CellHookData, RowInput, UserOptions } from 'jspdf-autotable'

import { DailyReport, Speed } from '../../../../app/models/daily-report';
import { LoadingService } from '../../../../app/services/loading.service';
import { mathRound } from './../../../../assets/math/math.assets';
import { FormatDate, FormatYYYYMMDD, IsAfter1Date, IsPrevious1Date, TextMonthDayYearFormatYYYYMMDD } from './../../../../assets/moment/moment.assets';
import { Port } from '../../../models/port';
import { User } from '../../../models/user';
import { Voyage } from '../../../models/voyage';
import { LanguageService } from '../../../services/language.service';
import { DialogListReportComponent } from '../dialog-list-report/dialog-list-report.component';
import { GenerateSummaryTableOverallPerformanceAnalisis, GenerateTableSummaryOverallPerformanceAnalisis, GenerateTableTotalSummaryOverallPerformanceAnalisis, SummarySpeedCondition, SummaryVesselPerformanceReport } from 'src/app/models/dialog-export-pdf';

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
  styleUrls: ['./dialog-export-pdf.component.scss']
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
  ) { }


  // Traducciones
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'dialog';

  // Usuario seleccionado
  public selectUser: User = new User();

  // Varibles del formulario
  public selectVoyageId: number = 0;
  public selectPortId: number = 0;
  public selectTypeExport: string = '';

  // Que informacion deseas agregar al reporte.
  public addOverallPerformance: boolean = false;
  public addVoyageSummarySpeed: boolean = false;
  public addVoyageSummaryConsumption: boolean = false;
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


  // Viajes y puertos.
  public voyages: Voyage[] = [];
  public ports: Port[] = [];

  /////////////////////////////////////
  //////    GENERAR REPORTE   /////////
  /////////////////////////////////////
  // Texto del reporte, punto por punto.
  public xLabelReport: any[] = [];
  // Configuracion del chartSpeed
  public configLineaSpeed: Chart.ChartConfiguration; // Configuracion del elemento
  public chartLineSpeed: Chart; // LINEA
  public dataSpeed: Chart.ChartPoint[] = []; // Data de los puntos de chartjs.



  public configLineaIFO: Chart.ChartConfiguration; // Configuracion del elemento
  public chartLineIFO: Chart; // LINEA
  public dataIFO: Chart.ChartPoint[] = []; // Data de los puntos de chartjs.


  ngOnInit(): void {

    Promise.resolve(true).then(
      result => {

        // seleccionar usuario.
        this.selectUser = this.data.selectUser;
        // Viajes
        this.voyages = this.data.voyages;
        this.selectVoyageId = this.data.selectVoyageId;

        // SI existe un viaje seleccioando lo buscamos.
        if (this.selectVoyageId) {
          // Buscamos el viaje.
          let voyageSelect = this.voyages.find(voyage => voyage.id === this.selectVoyageId);

          this.ports = voyageSelect.ports.filter(port => port.status === true);
        }

        // Seleccionamos el tipo de exportacion.
        this.selectTypeExport = 'VESSEL_PERFORMANCE';

        this.PluginChartDataLabels();

        return true;
      }
    ).then(
      result => {

        // generamos la linea
        return this.GenetareLineSpeed();
      }
    ).then(
      result => {

        // generamos la linea
        return this.GenetareLineIFO();
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

  // Se ejecuta cada vez que se cambia de viaje.
  public ClickSelectVoyage() {
    // Verificamos si se selecciono un viaje.
    if (this.selectVoyageId) {
      let voyage = this.voyages.find(voyage => voyage.id === this.selectVoyageId);
      this.ports = voyage.ports.filter(port => port.status === true);

    }
  }

  public ClickSelectPort() {
    console.log('UpdateLineSpeed');

    // REVISAR ESTO SE DEBE MEJORAR SU ESTRUCTURA.
    let voyage;
    let port;
    if (!this.selectVoyageId) {
      throw 'Select a voyage';
    }
    else if (this.selectPortId) {
      // Buscamos los viajes.
      voyage = this.voyages.find(voyage => voyage.id === this.selectVoyageId);
      port = voyage.ports.find(port => port.id === this.selectPortId);
      // Obtenemos el primer reporte y ultimo.
      this.GetStartReportAndEndReportThePort(port);

    } else {
    }

    this.GetInfoByActivity(port, 'SAILING_WITH_LADEN', this.selectUser);

    this.UpdateLineIfo();
    this.UpdateLineSpeed();


  }

  // Cuando le das click al boton exportar pdf
  public ClickExportPDF() {
    console.log('ClickExportPDF()');

    Promise.resolve(true).then(
      result => {

        // Exportar pdf
        return this.ExportPDFVesselPerformance2(this.data.voyages);
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

  // Funcion que exporta el pdf.
  private ExportPDFVesselPerformance(): Promise<boolean> {

    // Armamos el objeto de JSPDF
    const doc = new jsPDF();

    // tamaño de pdf.
    const widthPDF = doc.internal.pageSize.getWidth();
    const heightPDF = doc.internal.pageSize.getHeight();

    // Variables con los datos a trabajar.
    let voyage: Voyage;
    let port: Port;

    // Obtener el reporte de inicio y el reporte de fin.
    let getstartEndReport: any;

    // Posicion de altura del height.
    let positionHeight: number = 0;

    // Obtener informacion por actividad
    let getInfoByActivity: any;
    let typeConsumptionSelectBuque: string = '';
    this.loadingService.Open();
    // Promise
    return Promise.resolve(true)
      .then(
        result => {
          // seleccionamos los puertos
          if (this.selectVoyageId && this.selectPortId) {
            // Buscamos los viajes.
            voyage = this.voyages.find(voyage => voyage.id === this.selectVoyageId);
            port = voyage.ports.find(port => port.id === this.selectPortId);
            // Obtenemos el primer reporte y ultimo.
            getstartEndReport = this.GetStartReportAndEndReportThePort(port);

          } else {
            // Selecciona un viaje y un puerto.
            throw 'Select a voyage and a port.'
          }

          // Calcularemos la hora tarde o antes
          getInfoByActivity = this.GetInfoByActivity(port, 'SAILING_WITH_LADEN', this.selectUser);
          typeConsumptionSelectBuque = (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO');

          return true;
        }
      )
      // Aqui agregamos la primera pagina.
      .then(
        result => {
          // Nos ubicamos a una altura.
          positionHeight += 38;
          // ubicamos la imagen con un tamaño de 50 x 50
          let widthImage = 50;
          let heightImage = 50;
          doc.addImage("./assets/icons/logotransgas.png", "JPEG", (widthPDF - 50) / 2, positionHeight, widthImage, heightImage)

          // le sumamos la altura.
          positionHeight += 65;
          doc.setFontSize(35);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text('Vessel Performance Report', widthPDF / 2, positionHeight, { align: 'center' })

          // le sumamos la altura.
          positionHeight += 10;
          doc.setFontSize(18);
          doc.setTextColor(40);
          doc.setFont('Helvetica', 'bold');
          doc.text('Prepared For:', widthPDF / 2, positionHeight, { align: 'center' })


          // le sumamos la altura.
          positionHeight += 12;
          doc.setFontSize(30);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');

          let rolTraslate = this.languageService.GetMessage(this.translateCategory, this.selectUser.role);
          doc.text(rolTraslate + ' ' + this.selectUser.name, widthPDF / 2, positionHeight, { align: 'center' })

          // le sumamos la altura.
          positionHeight += 20;
          doc.setFontSize(18);
          doc.setTextColor(40);
          doc.setFont('Helvetica', 'bold');
          doc.text('N° Voyage: ' + voyage.voyageNumber, widthPDF / 2, positionHeight, { align: 'center' })

          // le sumamos la altura.
          positionHeight += 10;
          doc.setFontSize(18);
          doc.setTextColor(40);
          doc.setFont('Helvetica', 'bold');
          doc.text('N° Port: ' + port.portNumber, widthPDF / 2, positionHeight, { align: 'center' })

          // le sumamos la altura.
          positionHeight += 12;
          doc.setFontSize(30);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text(port.departurePort + " to " + port.arrivalPort, widthPDF / 2, positionHeight, { align: 'center' })


          // le sumamos la altura.
          positionHeight += 10;
          doc.setFontSize(18);
          doc.setTextColor(40);
          doc.setFont('Helvetica', 'bold');
          doc.text("ATD: " + FormatDate(getstartEndReport.startReport.date) + " " + getstartEndReport.startReport.hour, widthPDF / 2, positionHeight, { align: 'center' })

          // le sumamos la altura.
          positionHeight += 10;
          doc.setFontSize(10);
          doc.setTextColor(40);
          doc.setFont('Helvetica', 'bold');
          doc.text("ATA: " + FormatDate(getstartEndReport.endReport.date) + " " + getstartEndReport.endReport.hour, widthPDF / 2, positionHeight, { align: 'center' })

          // Le sumamos la altura.
          // Dibujaremos los cuadrados.
          positionHeight += 20;
          doc.setDrawColor(0);
          doc.setFillColor(255, 255, 255);
          doc.rect(10, positionHeight, 210 - (10 * 2), 50, "FD");
          // Cuadro chiquito donde esta el titulo.
          positionHeight -= 5;
          doc.setDrawColor(0);
          doc.setFillColor(22, 33, 77);
          doc.rect(30, positionHeight, 210 - (56 * 2), 8, "FD");
          // Texto
          doc.setFontSize(10);
          doc.setTextColor("ffffff");
          doc.setFont('Helvetica', 'bold');
          doc.text("Report Summary - Normal Speed Conditions (Laden)", 35, positionHeight + 5, { align: 'left' })

          // Posicion normal dentro del cuadro.
          positionHeight += 15;

          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.setFont('Helvetica', 'bold');
          doc.text("Original Warranted Values ", 75, positionHeight, { align: 'left' })
          doc.text("Calculation Results", 140, positionHeight, { align: 'left' })

          positionHeight += 10;
          doc.setTextColor(0, 0, 0);
          doc.text("Speed", 15, positionHeight, { align: 'left' })
          doc.setTextColor(22, 33, 77);
          doc.text("about " + this.selectUser.contractSpeedSailingLadenIFO + " Knots", 75, positionHeight, { align: 'left' })



          // Si el tiempo es mayor que la del contrato lo pintamos de rojo.
          if (getInfoByActivity.time > getInfoByActivity.timeByCharter) {

            let diffHour = getInfoByActivity.time - getInfoByActivity.timeByCharter;
            doc.setTextColor(255, 0, 0);
            doc.text(this.MathRoundDecimal(diffHour, 2) + " Hours Lost", 140, positionHeight, { align: 'left' })

          } else {
            // Caso contrario verde
            let diffHour = getInfoByActivity.timeByCharter - getInfoByActivity.time;
            doc.setTextColor(0, 128, 0);
            doc.text(this.MathRoundDecimal(diffHour, 2) + ' Hours before', 140, positionHeight, { align: 'left' })

          }


          positionHeight += 10;
          doc.setTextColor(0, 0, 0);
          doc.text("Fuel Consumption", 15, positionHeight, { align: 'left' })
          doc.setTextColor(22, 33, 77);
          doc.text("about " + this.selectUser.sailingLoadConsumptionIFO + " MT/Day", 75, positionHeight, { align: 'left' })

          // si el consumo diario es mayor que la del contrao lo pintamos de rojo
          if (getInfoByActivity.ifoDailyConsumption > getInfoByActivity.ifoDailyConsumptionByCharter) {

            doc.setTextColor(255, 0, 0);
            doc.text("Outside the guaranteed limits", 140, positionHeight, { align: 'left' })

          } else {

            doc.setTextColor(0, 128, 0);
            doc.text("Within Guaranteed Limits", 140, positionHeight, { align: 'left' })

          }

          positionHeight += 10;
          doc.setTextColor(0, 0, 0);
          doc.text("Diesel Consumption", 15, positionHeight, { align: 'left' });
          doc.setTextColor(22, 33, 77);
          doc.text("about " + this.selectUser.sailingLoadConsumptionMGO + " MT/Day", 75, positionHeight, { align: 'left' });

          //doc.setTextColor("960e0e");
          doc.setFontSize(15);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text("----", 140, positionHeight, { align: 'left' });


          return true;
        }
      )

      // SEGUNDA PAGINA
      .then(
        result => {

          // Agregamos una pagina
          doc.addPage();

          //////////////////////////////////
          //////// INICIAMOS LA CABECERA////
          //////////////////////////////////
          positionHeight = 10;
          let positionWidth = 10;

          // ubicamos la imagen con un tamaño de 50 x 50
          doc.addImage("./assets/icons/logotransgas.png", "JPEG", positionWidth, positionHeight, 17, 17);
          positionHeight += 5;
          positionWidth = 60;

          // Texto
          doc.setFontSize(18);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bolditalic');
          doc.text("Vessel Performance Report", positionWidth, positionHeight, { align: 'left' })

          // Rectangular
          positionHeight += 2;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(22, 33, 77);
          doc.rect(positionWidth, positionHeight, widthPDF - positionWidth - 10, 0.5, "FD");

          // Numeros de telefono y correo.
          positionHeight += 10;
          doc.setFontSize(10);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text("Lima Phone: +51-1-716-7600       Miami Phone: +1 954-575-1414       Email: transgas@transgas.com.pe", widthPDF - 10, positionHeight, { align: 'right' })



          // Raya debajo de los numeros de telefono.
          positionHeight += 2;
          positionWidth = 10;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(22, 33, 77);
          doc.rect(10, positionHeight, widthPDF - 20, 0.5, "FD");

          //////////////////////////////////
          ////////// FIN CABECERA //////////
          //////////////////////////////////


          // Titulo del pdf.
          positionHeight += 6;
          doc.setFontSize(15);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text('Overall Performance Analysis', widthPDF / 2, positionHeight, { align: 'center' })


          ///////////////////////////////////////
          ///////// Inicio del 1° Cuadro ////////
          ///////////////////////////////////////
          // BUQUE
          positionHeight += 20;
          doc.setFontSize(13);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text("M/V", 10, positionHeight, { align: 'left' })
          doc.setFontSize(17);
          doc.text('Buque ' + this.selectUser.name, 20, positionHeight, { align: 'left' })


          // Preparado por
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

          // Colocamos el rectangulo
          positionHeight -= 20;
          positionWidth = 10;
          let ancho = 120;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(219, 229, 245);
          doc.rect(widthPDF - 10 - ancho, positionHeight, ancho, 25, "FD");

          // Colocamos los destinos de partida y llegada.
          positionHeight += 8.5;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.setFont('Helvetica', 'normal');
          doc.text("Departure Port   :", widthPDF - 10 - ancho + 3, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text("Destination Port :", widthPDF - 10 - ancho + 3, positionHeight, { align: 'left' });

          // Regresamos a la posicion anteriror
          positionHeight -= 10;
          doc.text("ATD :", widthPDF - 10 - ancho + 3 + 65, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text("ATA :", widthPDF - 10 - ancho + 3 + 65, positionHeight, { align: 'left' });

          // SETEAMOS VALORES
          positionHeight -= 10;
          doc.setFontSize(10);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text(port.departurePort, widthPDF - 10 - ancho + 3 + 28, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text(port.arrivalPort, widthPDF - 10 - ancho + 3 + 28, positionHeight, { align: 'left' });
          // Regresamos a la posicion anteriror y colocamos la fecha de inicio y fin
          positionHeight -= 10;
          doc.text(FormatDate(getstartEndReport.startReport.date), widthPDF - 10 - ancho + 3 + 65 + 10, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text(FormatDate(getstartEndReport.endReport.date), widthPDF - 10 - ancho + 3 + 65 + 10, positionHeight, { align: 'left' });
          // Regresamos a la posicion anterior y colocamos la fecha de inicio y fin.
          positionHeight -= 10;
          doc.text(getstartEndReport.startReport.hour, widthPDF - 10 - ancho + 3 + 65 + 30, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text(getstartEndReport.endReport.hour, widthPDF - 10 - ancho + 3 + 65 + 30, positionHeight, { align: 'left' });

          positionHeight -= 10;
          doc.text('GMT', widthPDF - 10 - ancho + 3 + 65 + 30 + 10, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text('GMT', widthPDF - 10 - ancho + 3 + 65 + 30 + 10, positionHeight, { align: 'left' });
          positionHeight += 20;



          // Segundo cuadro.
          positionWidth = 10;
          ancho = 70;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(255, 242, 139);
          doc.rect(10, positionHeight, ancho, 5.5, "FD");

          positionHeight += 4;
          doc.setTextColor(0, 0, 0);
          doc.text('Laden / Normal Conditions', 12, positionHeight, { align: 'left' });

          // Rectangulo grande celeste
          positionHeight += 2;
          ancho = widthPDF - 20;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(219, 229, 245);
          doc.rect(10, positionHeight, ancho, 80, "FD");

          // Rectangulo chico plomo
          positionHeight -= 8;
          ancho = 60;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(214, 214, 214);
          doc.rect(10 + 90 + 5, positionHeight, ancho, 10, "FD");

          // Texto del cuadro
          positionHeight += 5;
          doc.setFontSize(10);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text("Overall Performance", 10 + 90 + 5 + (ancho / 2), positionHeight, { align: 'center' });

          positionHeight += 15;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.setFont('Helvetica', 'bold');
          doc.text("Transit Distance :", 80, positionHeight, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          doc.text(this.MathRoundDecimal(getInfoByActivity.distance, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('NM', 135, positionHeight, { align: 'left' });


          positionHeight += 6;
          doc.setFont('Helvetica', 'bold');
          doc.text("Transit Time :", 80, positionHeight, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          doc.text(this.MathRoundDecimal(getInfoByActivity.time, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('Hours', 135, positionHeight, { align: 'left' });


          positionHeight += 6;
          doc.setFont('Helvetica', 'bold');
          doc.text("Average Speed :", 80, positionHeight, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          let averageSpeedPerformed = getInfoByActivity.distance / (getInfoByActivity.time || 1);
          doc.text(this.MathRoundDecimal(averageSpeedPerformed, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('Knots', 135, positionHeight, { align: 'left' });



          positionHeight += 5;
          ancho = widthPDF - 20 - 20;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(214, 214, 214);
          doc.rect(20, positionHeight, ancho, 13.5, "FD");


          positionHeight += 4.7;
          doc.setFont('Helvetica', 'bold');
          doc.text("Performance Speed :", 80, positionHeight, { align: 'right' });
          doc.setTextColor(22, 33, 77);
          doc.text(this.MathRoundDecimal(averageSpeedPerformed, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('Knots', 135, positionHeight, { align: 'left' });

          positionHeight += 6;
          doc.setTextColor(0, 0, 0);
          doc.text("Allowable Charter Speed :", 80, positionHeight, { align: 'right' });
          doc.setTextColor(22, 33, 77);
          doc.text(this.selectUser.contractSpeedSailingLadenIFO + '', 130, positionHeight, { align: 'right' });
          doc.text('Knots', 135, positionHeight, { align: 'left' });



          // Segundo cuadro
          positionHeight = 136;
          ancho = widthPDF - 20 - 20;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(214, 214, 214);
          doc.rect(20, positionHeight, ancho, 13.5, "FD");

          positionHeight += 5;
          doc.setTextColor(0, 0, 0);
          doc.text("Performance Time :", 80, positionHeight, { align: 'right' });
          doc.setTextColor(22, 33, 77);
          doc.text(this.MathRoundDecimal(getInfoByActivity.time, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('Hours', 135, positionHeight, { align: 'left' });

          positionHeight += 6;
          doc.setTextColor(0, 0, 0);
          doc.text("Allowable Charter Time :", 80, positionHeight, { align: 'right' });
          doc.setTextColor(22, 33, 77);
          doc.text(this.MathRoundDecimal(getInfoByActivity.distance / this.selectUser.contractSpeedSailingLadenIFO, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('Hours', 135, positionHeight, { align: 'left' });

          // Segundo cuadro
          positionHeight += 4.1;
          ancho = widthPDF - 20 - 20;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(214, 214, 214);
          doc.rect(20, positionHeight, ancho, 10, "FD");


          positionHeight += 7;
          doc.setFontSize(15);
          doc.setFont('Helvetica', 'bold');
          if (getInfoByActivity.time > getInfoByActivity.timeByCharter) {

            let diffHour = getInfoByActivity.time - getInfoByActivity.timeByCharter;
            doc.setTextColor("960e0e");
            doc.setTextColor(255, 0, 0);
            doc.text(this.MathRoundDecimal(diffHour, 2) + '', 130, positionHeight, { align: 'right' });
            doc.text('Hours Lost', 135, positionHeight, { align: 'left' });
          } else {
            let diffHour = getInfoByActivity.timeByCharter - getInfoByActivity.time;
            doc.setTextColor(0, 128, 0);
            doc.text(this.MathRoundDecimal(diffHour, 2) + '', 130, positionHeight, { align: 'right' });
            doc.text('Hours before', 135, positionHeight, { align: 'left' });
          }


          // Tercer cuadro.
          positionHeight += 35;
          positionWidth = 10;
          ancho = 70;
          doc.setFontSize(10);
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(255, 242, 139);
          doc.rect(10, positionHeight, ancho, 5.5, "FD");

          positionHeight += 4;
          doc.setTextColor(0, 0, 0);
          doc.text('Laden / Normal Conditions', 12, positionHeight, { align: 'left' });

          // Rectangulo grande celeste
          positionHeight += 2;
          ancho = widthPDF - 20;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(219, 229, 245);
          doc.rect(10, positionHeight, ancho, 60, "FD");

          // Rectangulo chico plomo
          positionHeight -= 8;
          ancho = 60;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(214, 214, 214);
          doc.rect(10 + 90 + 5, positionHeight, ancho, 10, "FD");

          // Texto del cuadro
          positionHeight += 5;
          doc.setFontSize(10);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text("Fuel " + (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO'), 10 + 90 + 5 + (ancho / 2), positionHeight, { align: 'center' });


          positionHeight += 15;
          ancho = widthPDF - 20 - 20;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(214, 214, 214);
          doc.rect(20, positionHeight, ancho, 13.5, "FD");


          positionHeight += 4.7;
          doc.setFont('Helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text("Warranted Daily Consumption :", 80, positionHeight, { align: 'right' });
          doc.setTextColor(22, 33, 77);
          doc.text(this.MathRoundDecimal(getInfoByActivity.ifoDailyConsumptionByCharter, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('MT', 135, positionHeight, { align: 'left' });

          positionHeight += 6;
          doc.setTextColor(0, 0, 0);
          doc.text("Actual Daily Consumption :", 80, positionHeight, { align: 'right' });
          doc.setTextColor(22, 33, 77);
          doc.text(this.MathRoundDecimal(getInfoByActivity.ifoDailyConsumption, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('MT', 135, positionHeight, { align: 'left' });


          // Segundo cuadro
          positionHeight += 4.1;
          ancho = widthPDF - 20 - 20;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(214, 214, 214);
          doc.rect(20, positionHeight, ancho, 13.5, "FD");

          positionHeight += 5;
          doc.setTextColor(0, 0, 0);
          doc.text("Warranted Total Consumption :", 80, positionHeight, { align: 'right' });
          doc.setTextColor(22, 33, 77);
          doc.text(this.MathRoundDecimal(getInfoByActivity.totalConsumptionByCharter, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('MT', 135, positionHeight, { align: 'left' });

          positionHeight += 6;
          doc.setTextColor(0, 0, 0);
          doc.text("Actual Total Consumption :", 80, positionHeight, { align: 'right' });
          doc.setTextColor(22, 33, 77);
          doc.text(this.MathRoundDecimal(getInfoByActivity.ifoConsumption, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('MT', 135, positionHeight, { align: 'left' });

          // Segundo cuadro
          positionHeight += 4.1;
          ancho = widthPDF - 20 - 20;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(214, 214, 214);
          doc.rect(20, positionHeight, ancho, 10, "FD");


          positionHeight += 7;
          doc.setFontSize(15);
          doc.setFont('Helvetica', 'bold');
          if (getInfoByActivity.ifoConsumption < getInfoByActivity.ifoDailyConsumptionByCharter) {
            doc.setTextColor(255, 0, 0);
            doc.text('Overall Fuel Oil Consumption Out Guaranteed Limitsy', widthPDF / 2, positionHeight, { align: 'center' });
          } else {
            doc.setTextColor(0, 128, 0);
            doc.text('Overall Fuel Oil Consumption WITHIN Guaranteed Limitsy', widthPDF / 2, positionHeight, { align: 'center' });
          }

          let pageFooter = heightPDF - 10;

          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(22, 33, 77);
          doc.rect(10, pageFooter, widthPDF - 20, 0.5, "FD");
          pageFooter += 4;

          doc.setFontSize(8);
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(22, 33, 77);

          doc.text('Page 2', 10, pageFooter, { align: 'left' });
          doc.text('Transgas Shipping Lines All Rights Reserved. © 2021', widthPDF - 10, pageFooter, { align: 'right' });

          return true;
        }
      ).then(
        //// TERCERA PAGINA
        result => {
          // TERCERA PAGINA
          doc.addPage();

          //////////////////////////////////
          //////// INICIAMOS LA CABECERA////
          //////////////////////////////////
          positionHeight = 10;
          let positionWidth = 10;

          // ubicamos la imagen con un tamaño de 50 x 50
          doc.addImage("./assets/icons/logotransgas.png", "JPEG", positionWidth, positionHeight, 17, 17);
          positionHeight += 5;
          positionWidth = 60;

          // Texto
          doc.setFontSize(18);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bolditalic');
          doc.text("Vessel Performance Report", positionWidth, positionHeight, { align: 'left' })

          // Rectangular
          positionHeight += 2;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(22, 33, 77);
          doc.rect(positionWidth, positionHeight, widthPDF - positionWidth - 10, 0.5, "FD");

          // Numeros de telefono y correo.
          positionHeight += 10;
          doc.setFontSize(10);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text("Lima Phone: +51-1-716-7600       Miami Phone: +1 954-575-1414       Email: transgas@transgas.com.pe", widthPDF - 10, positionHeight, { align: 'right' })


          // Raya debajo de los numeros de telefono.
          positionHeight += 2;
          positionWidth = 10;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(22, 33, 77);
          doc.rect(10, positionHeight, widthPDF - 20, 0.5, "FD");

          //////////////////////////////////
          ////////// FIN CABECERA //////////
          //////////////////////////////////


          // AGREGAMOS EL FOTER DEUNA VE>
          let pageFooter = heightPDF - 10;

          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(22, 33, 77);
          doc.rect(10, pageFooter, widthPDF - 20, 0.5, "FD");
          pageFooter += 4;

          doc.setFontSize(8);
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(22, 33, 77);

          doc.text('Page 3', 10, pageFooter, { align: 'left' });
          doc.text('Transgas Shipping Lines All Rights Reserved. © 2021', widthPDF - 10, pageFooter, { align: 'right' });



          // Titulo del pdf.
          positionHeight += 6;
          doc.setFontSize(15);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text('Voyage Summary', widthPDF / 2, positionHeight, { align: 'center' })


          ///////////////////////////////////////
          ///////// Inicio del 1° Cuadro ////////
          ///////////////////////////////////////
          // BUQUE
          positionHeight += 20;
          doc.setFontSize(13);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text("M/V", 10, positionHeight, { align: 'left' })
          doc.setFontSize(17);
          doc.text('Buque ' + this.selectUser.name, 20, positionHeight, { align: 'left' })


          // Preparado por
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

          // Colocamos el rectangulo
          positionHeight -= 20;
          positionWidth = 10;
          let ancho = 120;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(219, 229, 245);
          doc.rect(widthPDF - 10 - ancho, positionHeight, ancho, 25, "FD");

          // Colocamos los destinos de partida y llegada.
          positionHeight += 8.5;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.setFont('Helvetica', 'normal');
          doc.text("Departure Port   :", widthPDF - 10 - ancho + 3, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text("Destination Port :", widthPDF - 10 - ancho + 3, positionHeight, { align: 'left' });

          // Regresamos a la posicion anteriror
          positionHeight -= 10;
          doc.text("ATD :", widthPDF - 10 - ancho + 3 + 65, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text("ATA :", widthPDF - 10 - ancho + 3 + 65, positionHeight, { align: 'left' });

          // SETEAMOS VALORES
          positionHeight -= 10;
          doc.setFontSize(10);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text(port.departurePort, widthPDF - 10 - ancho + 3 + 28, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text(port.arrivalPort, widthPDF - 10 - ancho + 3 + 28, positionHeight, { align: 'left' });
          // Regresamos a la posicion anteriror y colocamos la fecha de inicio y fin
          positionHeight -= 10;
          doc.text(FormatDate(getstartEndReport.startReport.date), widthPDF - 10 - ancho + 3 + 65 + 10, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text(FormatDate(getstartEndReport.endReport.date), widthPDF - 10 - ancho + 3 + 65 + 10, positionHeight, { align: 'left' });
          // Regresamos a la posicion anterior y colocamos la fecha de inicio y fin.
          positionHeight -= 10;
          doc.text(getstartEndReport.startReport.hour, widthPDF - 10 - ancho + 3 + 65 + 30, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text(getstartEndReport.endReport.hour, widthPDF - 10 - ancho + 3 + 65 + 30, positionHeight, { align: 'left' });

          positionHeight -= 10;
          doc.text('GMT', widthPDF - 10 - ancho + 3 + 65 + 30 + 10, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text('GMT', widthPDF - 10 - ancho + 3 + 65 + 30 + 10, positionHeight, { align: 'left' });
          positionHeight += 20;


          let head = [['Posn Type', 'Date / Time', 'Load / Speed Conditions', 'Time ( hrs )', 'Dist ( nm )', 'Avg', 'Charter', 'Beaufort']]
          let data = [];

          // Reportes.
          let reports: DailyReport[] = getInfoByActivity.reports;
          reports.forEach(
            report => {

              data.push([
                'A',
                FormatYYYYMMDD(report.date) + ' ' + report.hour,
                this.languageService.GetMessage(this.translateCategory, report.activityPerformed),
                String(report.steamingTime),
                String(report.distance),
                this.MathRoundDecimal(report.steamingTime ? report.distance / report.steamingTime : report.distance, 2),
                String(this.selectUser.contractSpeedSailingLadenIFO),
                report.beaufour

              ])
            }
          );

          let userOptions: UserOptions = {};
          userOptions.startY = positionHeight;
          userOptions.head = head;
          userOptions.body = data;
          userOptions.margin = [0, 10, 0, 10, 0, 0]

          userOptions.didParseCell = (data: CellHookData) => {

            let section = data.section;
            let cell: Cell = data.cell;
            if (cell == undefined) { return; }

            if (section == 'body') {
              let rowIndex = data.row.index;
              let columIndex = data.column.index;
              let raw = data.row.raw;

              if (columIndex == 5) {

                if (Number(cell.text) >= Number(raw[6])) {
                  cell.styles.fillColor = [133, 252, 97];
                } else {
                  cell.styles.fillColor = [255, 123, 123];
                }
              }
            }


          };

          /*     doc.setDrawColor(22, 33, 77);
              doc.setFillColor(219, 229, 245);
             */

          userOptions.columnStyles = {
            0: {
              halign: 'center',
              fontStyle: 'bold',
              cellWidth: 14,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            1: {
              halign: 'center',
              fontStyle: 'bold',
              cellWidth: 38,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            2: {
              halign: 'center',
              fontStyle: 'bold',
              cellWidth: 36,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            3: {
              halign: 'center',
              fontStyle: 'bold',
              cellWidth: 25,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            4: {
              halign: 'center',
              fontStyle: 'bold',
              cellWidth: 24,
              lineWidth: 0.2,
              lineColor: [22, 33, 77]
            },
            5: {
              halign: 'center',
              fontStyle: 'bold',
              cellWidth: 17,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            6: {
              halign: 'center',
              fontStyle: 'bold',
              cellWidth: 17,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            7: {
              halign: 'center',
              fontStyle: 'bold',
              cellWidth: 19,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
          };
          userOptions.headStyles = {
            halign: 'center',
            valign: 'middle',
            fillColor: '#375f9a',
            lineWidth: 0.15,
            lineColor: [22, 33, 77]
          };


          autoTable(doc, userOptions);

          // Tamaño de la cabecera.
          positionHeight += 11.4;
          // Tamaño de la tabla
          positionHeight += (getInfoByActivity.reports.length * 7.6);

          // Le sumamos la separacion entre la tabla y el siguiente texto
          positionHeight += 6;
          doc.setFontSize(8);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'italic');
          // Agregamos una tamaño ṕara el width
          positionWidth = 10;
          let widthForTree = (widthPDF - 20) / 3;
          positionWidth += (widthForTree / 2);
          doc.text('"A" = Actual Reported Ship Position', positionWidth, positionHeight, { align: 'center' })
          positionWidth += widthForTree;
          doc.text('"ATD" = Actual Time of Departure', positionWidth, positionHeight, { align: 'center' })
          positionWidth += widthForTree;
          doc.text('"ATA" = Actual Time of Arrival', positionWidth, positionHeight, { align: 'center' })

          // Agregamos una tamaño ṕara el width
          positionHeight += 2;
          positionWidth = 10;
          ancho = widthForTree - 20;
          positionWidth += 10;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(214, 214, 214);
          doc.setFillColor(133, 252, 97);
          doc.rect(positionWidth, positionHeight, ancho, 7, "FD");

          positionWidth += widthForTree;
          doc.setFillColor(208, 227, 255);
          doc.rect(positionWidth, positionHeight, ancho, 7, "FD");

          positionWidth += widthForTree;
          doc.setFillColor(255, 123, 123);
          doc.rect(positionWidth, positionHeight, ancho, 7, "FD");

          positionHeight += 4.5;
          positionWidth = 10;
          widthForTree = (widthPDF - 20) / 3;

          positionWidth += (widthForTree / 2);
          doc.text('Defined Good Weather Period', positionWidth, positionHeight, { align: 'center' })
          positionWidth += widthForTree;
          doc.text('Vessel within ECA Limits', positionWidth, positionHeight, { align: 'center' })
          positionWidth += widthForTree;
          doc.text('Stoppage Period', positionWidth, positionHeight, { align: 'center' })

          positionHeight += 15;
          // Si  pasamos de los 170, agregamos una pagina. REVISAR
          if (positionHeight >= 190) {

            return true;
          } else {
            return false;
          }

        }
      ).then(
        (result: boolean) => {
          // Revisar AQUI DEBERIAMOS DE VIALIDAR SI LA IMAGEN DEVERIA IR A UNA NUEVA PGINA
          const options = {
            background: 'black',
            scale: 1
          };

          let elementlineaSpeed: HTMLElement = document.getElementById('dash-linea-speed');

          return html2canvas(elementlineaSpeed, options);

        }
      ).then(
        (canvas: any) => {


          //let positionHeight = 170;

          // Si el elemento canvas existe.de
          if (canvas) {
            // Obtenemos la imagen
            let img = canvas.toDataURL('image/PNG');

            let mgProps = (doc as any).getImageProperties(img);

            // ubicamos la imagen con un tamaño de 50 x 50
            // doc.addImage("./assets/icons/logotransgas.png", "JPEG", positionWidth, positionHeight, 17, 17);
            // Calculamos un tamaño para el pdf.
            let widthDash = widthPDF - 20;// Tamaño del pdf menos el margen
            // Agregamos la imagen al pdf.
            doc.addImage(img, 'PNG', 10, positionHeight, widthDash, 95, undefined, 'FAST');

          }

          return true;

        }
      )
      // AQUI GENERAMOS LOS CUADROS DE CONSUMO.
      .then(
        result => {
          doc.addPage();

          //////////////////////////////////
          //////// INICIAMOS LA CABECERA////
          //////////////////////////////////
          positionHeight = 10;
          let positionWidth = 10;

          // ubicamos la imagen con un tamaño de 50 x 50
          doc.addImage("./assets/icons/logotransgas.png", "JPEG", positionWidth, positionHeight, 17, 17);
          positionHeight += 5;
          positionWidth = 60;

          // Texto
          doc.setFontSize(18);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bolditalic');
          doc.text("Vessel Performance Report", positionWidth, positionHeight, { align: 'left' })

          // Rectangular
          positionHeight += 2;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(22, 33, 77);
          doc.rect(positionWidth, positionHeight, widthPDF - positionWidth - 10, 0.5, "FD");

          // Numeros de telefono y correo.
          positionHeight += 10;
          doc.setFontSize(10);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text("Lima Phone: +51-1-716-7600       Miami Phone: +1 954-575-1414       Email: transgas@transgas.com.pe", widthPDF - 10, positionHeight, { align: 'right' })


          // Raya debajo de los numeros de telefono.
          positionHeight += 2;
          positionWidth = 10;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(22, 33, 77);
          doc.rect(10, positionHeight, widthPDF - 20, 0.5, "FD");

          //////////////////////////////////
          ////////// FIN CABECERA //////////
          //////////////////////////////////


          // AGREGAMOS EL FOTER DEUNA VE>
          let pageFooter = heightPDF - 10;

          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(22, 33, 77);
          doc.rect(10, pageFooter, widthPDF - 20, 0.5, "FD");
          pageFooter += 4;

          doc.setFontSize(8);
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(22, 33, 77);

          doc.text('Page 4', 10, pageFooter, { align: 'left' });
          doc.text('Transgas Shipping Lines All Rights Reserved. © 2021', widthPDF - 10, pageFooter, { align: 'right' });



          // Titulo del pdf.
          positionHeight += 6;
          doc.setFontSize(15);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text('Voyage Summary', widthPDF / 2, positionHeight, { align: 'center' })


          ///////////////////////////////////////
          ///////// Inicio del 1° Cuadro ////////
          ///////////////////////////////////////
          // BUQUE
          positionHeight += 20;
          doc.setFontSize(13);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text("M/V", 10, positionHeight, { align: 'left' })
          doc.setFontSize(17);
          doc.text('Buque ' + this.selectUser.name, 20, positionHeight, { align: 'left' })


          // Preparado por
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

          // Colocamos el rectangulo
          positionHeight -= 20;
          positionWidth = 10;
          let ancho = 120;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(219, 229, 245);
          doc.rect(widthPDF - 10 - ancho, positionHeight, ancho, 25, "FD");

          // Colocamos los destinos de partida y llegada.
          positionHeight += 8.5;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.setFont('Helvetica', 'normal');
          doc.text("Departure Port   :", widthPDF - 10 - ancho + 3, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text("Destination Port :", widthPDF - 10 - ancho + 3, positionHeight, { align: 'left' });

          // Regresamos a la posicion anteriror
          positionHeight -= 10;
          doc.text("ATD :", widthPDF - 10 - ancho + 3 + 65, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text("ATA :", widthPDF - 10 - ancho + 3 + 65, positionHeight, { align: 'left' });

          // SETEAMOS VALORES
          positionHeight -= 10;
          doc.setFontSize(10);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text(port.departurePort, widthPDF - 10 - ancho + 3 + 28, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text(port.arrivalPort, widthPDF - 10 - ancho + 3 + 28, positionHeight, { align: 'left' });
          // Regresamos a la posicion anteriror y colocamos la fecha de inicio y fin
          positionHeight -= 10;
          doc.text(FormatDate(getstartEndReport.startReport.date), widthPDF - 10 - ancho + 3 + 65 + 10, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text(FormatDate(getstartEndReport.endReport.date), widthPDF - 10 - ancho + 3 + 65 + 10, positionHeight, { align: 'left' });
          // Regresamos a la posicion anterior y colocamos la fecha de inicio y fin.
          positionHeight -= 10;
          doc.text(getstartEndReport.startReport.hour, widthPDF - 10 - ancho + 3 + 65 + 30, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text(getstartEndReport.endReport.hour, widthPDF - 10 - ancho + 3 + 65 + 30, positionHeight, { align: 'left' });

          positionHeight -= 10;
          doc.text('GMT', widthPDF - 10 - ancho + 3 + 65 + 30 + 10, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text('GMT', widthPDF - 10 - ancho + 3 + 65 + 30 + 10, positionHeight, { align: 'left' });
          positionHeight += 20;


          let head = [['Posn Type', 'Date / Time', 'Load / Speed Conditions', 'Time\n( hrs )', 'Dist\n( nm )', 'Avg', 'Charter', 'M.E', 'A.E', 'Boiler', 'Total\n' + typeConsumptionSelectBuque, 'Beaufort']]
          let data = [];

          // Reportes.
          let reports: DailyReport[] = getInfoByActivity.reports;
          reports.forEach(
            report => {

              data.push([
                'A',
                FormatYYYYMMDD(report.date) + ' ' + report.hour,
                this.languageService.GetMessage(this.translateCategory, report.activityPerformed),
                String(report.steamingTime),
                String(report.distance),
                this.MathRoundDecimal(report.steamingTime ? report.distance / report.steamingTime : report.distance, 2),
                String(this.selectUser.contractSpeedSailingLadenIFO),
                this.MathRoundDecimal(report.mplaIfo, 2),
                this.MathRoundDecimal(report.auxIfo, 2),
                this.MathRoundDecimal(report.boilerIfo, 2),
                this.MathRoundDecimal(report.mplaIfo + report.auxIfo + report.boilerIfo, 2),

                report.beaufour

              ]);
            }
          );

          let userOptions: UserOptions = {};
          userOptions.startY = positionHeight;
          userOptions.head = head;
          userOptions.body = data;
          userOptions.margin = [0, 10, 0, 10, 0, 0]

          userOptions.didParseCell = (data: CellHookData) => {

            let section = data.section;
            let cell: Cell = data.cell;
            if (cell == undefined) { return; }

            if (section == 'body') {
              let rowIndex = data.row.index;
              let columIndex = data.column.index;
              let raw = data.row.raw;

              if (columIndex == 5) {

                if (Number(cell.text) >= Number(raw[6])) {
                  cell.styles.fillColor = [133, 252, 97];
                } else {
                  cell.styles.fillColor = [255, 123, 123];
                }
              }
            }


          };

          /*     doc.setDrawColor(22, 33, 77);
              doc.setFillColor(219, 229, 245);
             */

          userOptions.columnStyles = {
            0: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 13,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            1: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 30,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            2: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 32,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            3: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 12,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            4: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 12,
              lineWidth: 0.2,
              lineColor: [22, 33, 77]
            },
            5: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 12,
              lineWidth: 0.15,
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
              cellWidth: 12,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            8: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 12,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            9: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 12,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            10: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 14,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            11: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 15,
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

          // Tamaño de la cabecera.
          positionHeight += 11.4;
          // Tamaño de la tabla
          positionHeight += (getInfoByActivity.reports.length * 7.6);

          // Le sumamos la separacion entre la tabla y el siguiente texto
          positionHeight += 6;
          doc.setFontSize(8);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'italic');
          // Agregamos una tamaño ṕara el width
          positionWidth = 10;
          let widthForTree = (widthPDF - 20) / 3;
          positionWidth += (widthForTree / 2);
          doc.text('"A" = Actual Reported Ship Position', positionWidth, positionHeight, { align: 'center' })
          positionWidth += widthForTree;
          doc.text('"ATD" = Actual Time of Departure', positionWidth, positionHeight, { align: 'center' })
          positionWidth += widthForTree;
          doc.text('"ATA" = Actual Time of Arrival', positionWidth, positionHeight, { align: 'center' })

          // Agregamos una tamaño ṕara el width
          positionHeight += 2;
          positionWidth = 10;
          ancho = widthForTree - 20;
          positionWidth += 10;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(214, 214, 214);
          doc.setFillColor(133, 252, 97);
          doc.rect(positionWidth, positionHeight, ancho, 7, "FD");

          positionWidth += widthForTree;
          doc.setFillColor(208, 227, 255);
          doc.rect(positionWidth, positionHeight, ancho, 7, "FD");

          positionWidth += widthForTree;
          doc.setFillColor(255, 123, 123);
          doc.rect(positionWidth, positionHeight, ancho, 7, "FD");

          positionHeight += 4.5;
          positionWidth = 10;
          widthForTree = (widthPDF - 20) / 3;

          positionWidth += (widthForTree / 2);
          doc.text('Defined Good Weather Period', positionWidth, positionHeight, { align: 'center' })
          positionWidth += widthForTree;
          doc.text('Vessel within ECA Limits', positionWidth, positionHeight, { align: 'center' })
          positionWidth += widthForTree;
          doc.text('Stoppage Period', positionWidth, positionHeight, { align: 'center' })

          positionHeight += 15;
          // Si  pasamos de los 170, agregamos una pagina. REVISAR
          if (positionHeight >= 190) {

            return true;
          } else {
            return false;
          }

        }
      ).then(
        // Creamos la tabla de resumen de viaje.
        (result: boolean) => {

          var data: RowInput[] = [


            [{ "content": "Calculated Total Consumption (MT)", "colSpan": 8 }],
            [{ "content": "Engine Consumption Summary", "colSpan": 2, "rowSpan": 2 }, { "content": "Main Engine", "colSpan": 2 }, { "content": "Aux Engine", "colSpan": 2 }, { "content": "Boiler", "colSpan": 2 }],
            [{ "content": typeConsumptionSelectBuque, "colSpan": 1 }, { "content": "MGO", "colSpan": 1 }, { "content": typeConsumptionSelectBuque, "colSpan": 1 }, { "content": "MGO", "colSpan": 1 }, { "content": typeConsumptionSelectBuque, "colSpan": 1 }, { "content": "MGO", "colSpan": 1 }],
            // Aqui van los valores
            [{ "content": port.departurePort + " to " + port.arrivalPort, "colSpan": 2 }, { "content": this.MathRoundDecimal(getInfoByActivity.totalIFOME, 2), "colSpan": 1 }, { "content": this.MathRoundDecimal(getInfoByActivity.totalMGOME, 2), "colSpan": 1 }, { "content": this.MathRoundDecimal(getInfoByActivity.totalIFOAE, 2), "colSpan": 1 }, { "content": this.MathRoundDecimal(getInfoByActivity.totalMGOAE, 2), "colSpan": 1 }, { "content": this.MathRoundDecimal(getInfoByActivity.totalIFOBoiler, 2), "colSpan": 1 }, { "content": this.MathRoundDecimal(getInfoByActivity.totalMGOBoiler, 2), "colSpan": 1 }],
            [{ "content": "", "colSpan": 8 }],
            [{ "content": "Voyage(s) Total", "colSpan": 1, "rowSpan": 2 }, { "content": "Time", "colSpan": 1 }, { "content": "Distance", "colSpan": 1 }, { "content": "AVG\nSpeed", "colSpan": 1 }, { "content": "Speed\nCharter", "colSpan": 1 }, { "content": typeConsumptionSelectBuque, "colSpan": 1 }, { "content": "Daily\n" + typeConsumptionSelectBuque + "\n", "colSpan": 1 }, { "content": "Daily\nCharter", "colSpan": 1 }],
            // Aqui van valores.
            [{ "content": this.MathRoundDecimal(getInfoByActivity.time, 2), "colSpan": 1 }, { "content": this.MathRoundDecimal(getInfoByActivity.distance, 2), "colSpan": 1 }, { "content": this.MathRoundDecimal((getInfoByActivity.distance / getInfoByActivity.time) || 0, 2), "colSpan": 1 }, { "content": this.selectUser.contractSpeedSailingLadenIFO, "colSpan": 1 }, { "content": getInfoByActivity.ifoConsumption, "colSpan": 1 }, { "content": this.MathRoundDecimal(getInfoByActivity.ifoDailyConsumption, 2), "colSpan": 1 }, { "content": this.MathRoundDecimal(this.selectUser.sailingLoadConsumptionIFO, 2), "colSpan": 1 }],
            [{ "content": "Consumption rates in table are provided directly by the vessel, and are not adjusted for exclusions. Missing values indicate that complete data was not received", "colSpan": 8 }],


          ];


          let userOptions: UserOptions = {};
          userOptions.startY = positionHeight;
          //userOptions.head = head;
          userOptions.body = data;
          userOptions.margin = [0, 10, 0, 10, 0, 0]

          userOptions.didParseCell = (data: CellHookData) => {

            let section = data.section;
            let cell: Cell = data.cell;
            if (cell == undefined) { return; }


            if (section == 'body') {
              let rowIndex = data.row.index;
              let columIndex = data.column.index;
              let raw = data.row.raw;
              if (rowIndex == 0) {

                if (columIndex == 0) {

                  cell.styles.fillColor = '#375f9a'
                  cell.styles.textColor = '#ffffff';
                  cell.styles.fontSize = 10;
                }
              }

              if (rowIndex == 1) {

                if (columIndex == 0) {
                  cell.styles.valign = 'middle';
                }
              }
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
            }


          };

          userOptions.columnStyles = {
            0: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 57,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            1: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 19,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            2: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 19,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            3: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 19,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            4: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 19,
              lineWidth: 0.2,
              lineColor: [22, 33, 77]
            },
            5: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 19,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            6: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 19,
              lineWidth: 0.15,
              lineColor: [22, 33, 77]
            },
            7: {
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 8,
              cellWidth: 19,
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


          return true;
        }
      ).then(
        (result: boolean) => {

          // Revisar AQUI DEBERIAMOS DE VIALIDAR SI LA IMAGEN DEVERIA IR A UNA NUEVA PGINA
          const options = {
            background: 'black',
            scale: 1
          };

          let elementlineaSpeed: HTMLElement = document.getElementById('dash-linea-speed');

          return html2canvas(elementlineaSpeed, options);

        }
      ).then(
        (canvas: any) => {


          //let positionHeight = 170;

          // Si el elemento canvas existe.de
          if (canvas) {
            // Obtenemos la imagen
            let img = canvas.toDataURL('image/PNG');

            let mgProps = (doc as any).getImageProperties(img);

            // ubicamos la imagen con un tamaño de 50 x 50
            // doc.addImage("./assets/icons/logotransgas.png", "JPEG", positionWidth, positionHeight, 17, 17);
            // Calculamos un tamaño para el pdf.
            let widthDash = widthPDF - 20;// Tamaño del pdf menos el margen
            // Agregamos la imagen al pdf.
            //  doc.addImage(img, 'PNG', 10, positionHeight, widthDash, 95, undefined, 'FAST');

          }

          return true;

        }
      )






      // AQUI GENERAMOS LOS CUADROS DE CONSUMO.
      .then(
        result => {
          doc.addPage();

          //////////////////////////////////
          //////// INICIAMOS LA CABECERA////
          //////////////////////////////////
          positionHeight = 10;
          let positionWidth = 10;

          // ubicamos la imagen con un tamaño de 50 x 50
          doc.addImage("./assets/icons/logotransgas.png", "JPEG", positionWidth, positionHeight, 17, 17);
          positionHeight += 5;
          positionWidth = 60;

          // Texto
          doc.setFontSize(18);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bolditalic');
          doc.text("Vessel Performance Report", positionWidth, positionHeight, { align: 'left' })

          // Rectangular
          positionHeight += 2;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(22, 33, 77);
          doc.rect(positionWidth, positionHeight, widthPDF - positionWidth - 10, 0.5, "FD");

          // Numeros de telefono y correo.
          positionHeight += 10;
          doc.setFontSize(10);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text("Lima Phone: +51-1-716-7600       Miami Phone: +1 954-575-1414       Email: transgas@transgas.com.pe", widthPDF - 10, positionHeight, { align: 'right' })


          // Raya debajo de los numeros de telefono.
          positionHeight += 2;
          positionWidth = 10;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(22, 33, 77);
          doc.rect(10, positionHeight, widthPDF - 20, 0.5, "FD");

          //////////////////////////////////
          ////////// FIN CABECERA //////////
          //////////////////////////////////


          // AGREGAMOS EL FOTER DEUNA VE>
          let pageFooter = heightPDF - 10;

          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(22, 33, 77);
          doc.rect(10, pageFooter, widthPDF - 20, 0.5, "FD");
          pageFooter += 4;

          doc.setFontSize(8);
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(22, 33, 77);

          doc.text('Page 5', 10, pageFooter, { align: 'left' });
          doc.text('Transgas Shipping Lines All Rights Reserved. © 2021', widthPDF - 10, pageFooter, { align: 'right' });



          // Titulo del pdf.
          positionHeight += 6;
          doc.setFontSize(15);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text('Voyage Summary', widthPDF / 2, positionHeight, { align: 'center' })


          ///////////////////////////////////////
          ///////// Inicio del 1° Cuadro ////////
          ///////////////////////////////////////
          // BUQUE
          positionHeight += 20;
          doc.setFontSize(13);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text("M/V", 10, positionHeight, { align: 'left' })
          doc.setFontSize(17);
          doc.text('Buque ' + this.selectUser.name, 20, positionHeight, { align: 'left' })


          // Preparado por
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

          // Colocamos el rectangulo
          positionHeight -= 20;
          positionWidth = 10;
          let ancho = 120;
          doc.setDrawColor(22, 33, 77);
          doc.setFillColor(219, 229, 245);
          doc.rect(widthPDF - 10 - ancho, positionHeight, ancho, 25, "FD");

          // Colocamos los destinos de partida y llegada.
          positionHeight += 8.5;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.setFont('Helvetica', 'normal');
          doc.text("Departure Port   :", widthPDF - 10 - ancho + 3, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text("Destination Port :", widthPDF - 10 - ancho + 3, positionHeight, { align: 'left' });

          // Regresamos a la posicion anteriror
          positionHeight -= 10;
          doc.text("ATD :", widthPDF - 10 - ancho + 3 + 65, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text("ATA :", widthPDF - 10 - ancho + 3 + 65, positionHeight, { align: 'left' });

          // SETEAMOS VALORES
          positionHeight -= 10;
          doc.setFontSize(10);
          doc.setTextColor(22, 33, 77);
          doc.setFont('Helvetica', 'bold');
          doc.text(port.departurePort, widthPDF - 10 - ancho + 3 + 28, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text(port.arrivalPort, widthPDF - 10 - ancho + 3 + 28, positionHeight, { align: 'left' });
          // Regresamos a la posicion anteriror y colocamos la fecha de inicio y fin
          positionHeight -= 10;
          doc.text(FormatDate(getstartEndReport.startReport.date), widthPDF - 10 - ancho + 3 + 65 + 10, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text(FormatDate(getstartEndReport.endReport.date), widthPDF - 10 - ancho + 3 + 65 + 10, positionHeight, { align: 'left' });
          // Regresamos a la posicion anterior y colocamos la fecha de inicio y fin.
          positionHeight -= 10;
          doc.text(getstartEndReport.startReport.hour, widthPDF - 10 - ancho + 3 + 65 + 30, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text(getstartEndReport.endReport.hour, widthPDF - 10 - ancho + 3 + 65 + 30, positionHeight, { align: 'left' });

          positionHeight -= 10;
          doc.text('GMT', widthPDF - 10 - ancho + 3 + 65 + 30 + 10, positionHeight, { align: 'left' });
          positionHeight += 10;
          doc.text('GMT', widthPDF - 10 - ancho + 3 + 65 + 30 + 10, positionHeight, { align: 'left' });
          positionHeight += 15;

          return true;

        }
      ).then(
        (result: boolean) => {

          // Revisar AQUI DEBERIAMOS DE VIALIDAR SI LA IMAGEN DEVERIA IR A UNA NUEVA PGINA
          const options = {
            background: 'black',
            scale: 1
          };

          let elementlineaSpeed: HTMLElement = document.getElementById('dash-linea-speed');

          return html2canvas(elementlineaSpeed, options);

        }
      ).then(
        (canvas: any) => {


          //let positionHeight = 170;

          // Si el elemento canvas existe.de
          if (canvas) {
            // Obtenemos la imagen
            let img = canvas.toDataURL('image/PNG');

            let mgProps = (doc as any).getImageProperties(img);

            // ubicamos la imagen con un tamaño de 50 x 50
            // doc.addImage("./assets/icons/logotransgas.png", "JPEG", positionWidth, positionHeight, 17, 17);
            // Calculamos un tamaño para el pdf.
            let widthDash = widthPDF - 20;// Tamaño del pdf menos el margen
            // Agregamos la imagen al pdf.
            doc.addImage(img, 'PNG', 10, positionHeight, widthDash, 95, undefined, 'FAST');

          }

          return true;

        }
      )
      // AGREGAMOS LA SEGUNDA IMAGEN AL LA PAGINA 5
      .then(
        (result: boolean) => {
          positionHeight += 100;

          // Revisar AQUI DEBERIAMOS DE VIALIDAR SI LA IMAGEN DEVERIA IR A UNA NUEVA PGINA
          const options = {
            background: 'black',
            scale: 1
          };

          let elementlineaSpeed: HTMLElement = document.getElementById('dash-linea-ifo');

          return html2canvas(elementlineaSpeed, options);

        }
      ).then(
        (canvas: any) => {


          //let positionHeight = 170;

          // Si el elemento canvas existe.de
          if (canvas) {
            // Obtenemos la imagen
            let img = canvas.toDataURL('image/PNG');

            let mgProps = (doc as any).getImageProperties(img);

            // ubicamos la imagen con un tamaño de 50 x 50
            // doc.addImage("./assets/icons/logotransgas.png", "JPEG", positionWidth, positionHeight, 17, 17);
            // Calculamos un tamaño para el pdf.
            let widthDash = widthPDF - 20;// Tamaño del pdf menos el margen
            // Agregamos la imagen al pdf.
            doc.addImage(img, 'PNG', 10, positionHeight, widthDash, 95, undefined, 'FAST');

          }

          return true;

        }
      )
      // Aqui descargamos el documento de pdf.
      .then(
        result => {

          doc.save(this.selectUser.name + "_V" + voyage.voyageNumber + "_P" + port.portNumber + "-" + port.departurePort + "-" + port.arrivalPort + ".pdf")

          this.loadingService.Close();
          return true;

        }
      );

  }



  // GenetareLineSpeed(): Generar linea en los canvas.
  private GenetareLineSpeed(): boolean {
    console.log('GenetareLineSpeed()');

    // Agregamos la configuracion del chartIFO.
    this.configLineaSpeed = {
      type: 'line',
      data: {
        labels: [], // Lo pongo vacio por que en el update se colocara el valor.
        datasets: [{
          label: 'VESSEL SPEED SUMMARY', // Lo pongo vacio por que en el update se colocara el valor.
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: [], // Lo pongo vacio por que en el update se colocara el valor.
          fill: false,
        }]
      },
      options: {
        // Habilitamos todos los tooltip esten abiertos.
        showAllTooltips: true,
        // Otras opciones dentro del Chart
        legend: { // La leyenda es el texto que esta arriva del cuadro.
          display: true,
          onClick: (event, legendItem) => {
            console.log('onClick:' + legendItem.text);
          },
          labels: {
            fontColor: 'rgb(255,255,255)', // Color de la leyenda.
            fontStyle: 'bold', // Tipo de texto de la leyenda.
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {}, // Lo pongo vacio por que en// Lo pongo vacio por que en el update se colocara el valor.
        scales: {},// Lo pongo vacio por que en el update se colocara el valor.
        hover: {
          onHover: function (e: MouseEvent) {
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
        }
      },
      lineaMax: 0 // Lo pongo cero por que en el update se colocara el valor.
    };

    // Encapculamos el elemento del dom.
    let canvaLineSpeed: any = document.getElementById('lineaSpeed');
    // Convertimos el canvaLineIfo en 2d
    let ctxLineSpeed = canvaLineSpeed.getContext('2d');
    // 
    this.chartLineSpeed = new Chart(ctxLineSpeed, this.configLineaSpeed);

    return true;
  }

  // GenetareLineIFO(): Generar linea en los canvas.
  private GenetareLineIFO(): boolean {
    console.log('GenetareLineIFO()');

    // Agregamos la configuracion del chartIFO.
    this.configLineaIFO = {
      type: 'line',
      data: {
        labels: [], // Lo pongo vacio por que en el update se colocara el valor.
        datasets: [{
          label: 'VLSFO DAILY CONSUMPTION', // Lo pongo vacio por que en el update se colocara el valor.
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: [], // Lo pongo vacio por que en el update se colocara el valor.
          fill: false,
        }]
      },
      options: {
        // Habilitamos todos los tooltip esten abiertos.
        showAllTooltips: true,
        // Otras opciones dentro del Chart
        legend: { // La leyenda es el texto que esta arriva del cuadro.
          display: true,
          onClick: (event, legendItem) => {
            console.log('onClick:' + legendItem.text);
          },
          labels: {
            fontColor: 'rgb(255,255,255)', // Color de la leyenda.
            fontStyle: 'bold', // Tipo de texto de la leyenda.
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {}, // Lo pongo vacio por que en// Lo pongo vacio por que en el update se colocara el valor.
        scales: {},// Lo pongo vacio por que en el update se colocara el valor.
        hover: {
          onHover: function (e: MouseEvent) {
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
        }
      },
      lineaMax: 0 // Lo pongo cero por que en el update se colocara el valor.
    };

    // Encapculamos el elemento del dom.
    let canvaLineIfo: any = document.getElementById('lineaIfo');
    // Convertimos el canvaLineIfo en 2d
    let ctxLineIfo = canvaLineIfo.getContext('2d');
    // 
    this.chartLineIFO = new Chart(ctxLineIfo, this.configLineaIFO);

    return true;
  }



  private UpdateLineSpeed(): any {
    console.log('UpdateLineSPEED()');

    // Actualizamos los labels
    this.configLineaSpeed.data.labels = this.xLabelReport;

    // Actualizamos la dataSPEED
    this.configLineaSpeed.data.datasets[0].data = this.dataSpeed;

    // Vaciamos la configuracion de las lines SPEED
    // La linea es el campo que agregamos en el plugin.
    this.configLineaSpeed.options.lines = [];

    // Si el consumo maximo es mayor a 0 lo pintamos si no, no hace falta.
    if (this.selectUser.maxSpeed > 0) {
      this.configLineaSpeed.options.lines.push({
        type: 'horizontal',
        y: this.selectUser.maxSpeed,
        color: 'red',
        label: 'Max Speed'
      });
    };

    if (this.selectUser.minSpeed > 0) {
      this.configLineaSpeed.options.lines.push({
        type: 'horizontal',
        y: this.selectUser.minSpeed,
        color: '#39FF14',
        label: 'Min Speed'
      });
    }


    // Configuracion Tooltips
    this.configLineaSpeed.options.tooltips = this.GetToolTipConfig('SPEED');

    if (this.configLineaSpeed.lineaMax < this.selectUser.maxSpeed) {
      this.configLineaSpeed.lineaMax = this.selectUser.maxSpeed;
    }

    // Agregamos la configuracion de las escalas.
    this.configLineaSpeed.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaSpeed.lineaMax, 0) + 2);


    this.chartLineSpeed.update();

    return true;
  }

  private UpdateLineIfo(): any {
    console.log('UpdateLineIfo()');

    // Actualizamos los labels
    this.configLineaIFO.data.labels = this.xLabelReport;

    // Actualizamos la dataIfo
    this.configLineaIFO.data.datasets[0].data = this.dataIFO;

    // Vaciamos la configuracion de las lines IFO
    // La linea es el campo que agregamos en el plugin.
    this.configLineaIFO.options.lines = [];

    // Si el consumo maximo es mayor a 0 lo pintamos si no, no hace falta.
    if (this.selectUser.maxIFOConsumption > 0) {
      this.configLineaIFO.options.lines.push({
        type: 'horizontal',
        y: this.selectUser.maxIFOConsumption,
        color: 'red',
        label: 'Max'
      });
    };

    if (this.selectUser.minIFOConsumption > 0) {
      this.configLineaIFO.options.lines.push({
        type: 'horizontal',
        y: this.selectUser.minIFOConsumption,
        color: '#39FF14',
        label: 'Min'
      });
    }


    // Configuracion Tooltips
    this.configLineaIFO.options.tooltips = this.GetToolTipConfig('IFO');

    if (this.configLineaIFO.lineaMax < this.selectUser.maxIFOConsumption) {
      this.configLineaIFO.lineaMax = this.selectUser.maxIFOConsumption;
    }

    // Agregamos la configuracion de las escalas.
    this.configLineaIFO.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaIFO.lineaMax, 0) + 2);


    this.chartLineIFO.update();

    return true;
  }

  private GetToolTipConfig(configIFOorMGOorSPEED): Chart.ChartTooltipOptions {

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
          let result = '';

          // DataSets.
          let dataSets: Chart.ChartDataSets = data.datasets[0];
          let chartPoint: Chart.ChartPoint = <Chart.ChartPoint>dataSets.data[index];

          // dos veces estamos aplicando el formato.
          result = TextMonthDayYearFormatYYYYMMDD(chartPoint.x);


          return result;

        },
        label: (tooltipItem: Chart.ChartTooltipItem, data: Chart.ChartData) => {
          // REVISAR LOS TOOLTIP DEL CHART SPEED ESTABA PENSANDO QUE TODOS TENGAN LOS MISMOS DATOS
          // QUE MUESTREN LA VELOCIDAD Y LOS CONSUMO MGO Y IFO APARTE 
          // GITHUB VER COMO OBTENIA EL VLSFO Y IFO 
          // Resultado que se mostrara en el titulo.

          let result = '';
          if (configIFOorMGOorSPEED === 'IFO') {
            result = this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';
            result = 'Daily consumption : ';
          } else if (configIFOorMGOorSPEED === 'MGO') {
            result = 'MGO Daily consumption : ';
          } else if (configIFOorMGOorSPEED === 'SPEED') {
            result = 'Avg Speed : ';
          }
          // Le agrgamos el vlaor.
          result = result + mathRound(Number(tooltipItem.value), 2)

          return result;

        },
        footer: (tooltipItem: Chart.ChartTooltipItem[], data: Chart.ChartData) => {
          // Obtenemos la posicion del item.
          let index = tooltipItem[0].index;

          // Resultado que se mostrara en el titulo.
          let result = [];

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

          return result;

        },
      }
    }

  }

  // Configuracaion Axes si son menos de 60 registro que muestre los dias caso contrario que muestre los meses
  // esta configuracion depente del selectSummary
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

    config.xAxes[0].type = 'time';
    config.xAxes[0].time = {

      displayFormats: {
        day: 'MM/DD/YYYY'
      },
      tooltipFormat: 'MM/DD/YY',
      unit: 'day',

    }


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

  // 
  // SAILING_WITH_LADEN
  private GetInfoByActivity(port: Port, activityPerformed: string, selectUser: User): any {
    // Reset valos deñ data SPEER.
    this.dataSpeed = [];
    this.dataIFO = [];
    this.xLabelReport = [];

    // Consumo total del puerto.
    let distance = 0;
    let time = 0;
    let timeByCharter = 0;
    let ifoConsumption = 0;
    let ifoDailyConsumption = 0;
    let ifoDailyConsumptionByCharter = 0;
    let totalConsumptionByCharter = 0;
    let reports: DailyReport[] = [];

    let totalIFOME = 0;
    let totalMGOME = 0;
    let totalIFOAE = 0;
    let totalMGOAE = 0;
    let totalIFOBoiler = 0;
    let totalMGOBoiler = 0;

    // Recorremos los reportes para obtener el tiempo y la distance.
    port.dailyReports.forEach(
      (report: DailyReport) => {
        // verificamos que este activo
        if (report.status === true) {
          // Solo sumamos el tiempo y la distance.
          if (report.activityPerformed === activityPerformed) {

            distance += report.distance;
            time += report.steamingTime;
            ifoConsumption += this.SumaIfo(report);


            totalIFOME += report.mplaIfo;
            totalMGOME += report.mplaMgo;
            totalIFOAE += report.auxIfo;
            totalMGOAE += report.auxMgo;
            totalIFOBoiler += report.boilerIfo;
            totalMGOBoiler += report.boilerMgo;

            //lo agregamos al reporte.
            reports.push(report);

            // obtenemos la fecha del reporte.
            let day = report.date;
            // Buscamos si el dia ya se encuantra registrado.
            let resultSearch = this.xLabelReport.find(
              (xDay, iL) => {

                // Verificamos el dia ya se encuentra registrado.
                if (FormatDate(day) === FormatDate(xDay)) {

                  // Obtenemos la data extra actual.
                  let dataExtra = this.dataSpeed[iL].dataExtra;
                  // le hacemos push a la data extra.
                  dataExtra.push(report);
                  // Agregamos la data extra a la data del chart.
                  this.dataSpeed[iL].dataExtra = dataExtra;

                  // Obtenemos los datos de velocidad.
                  let speedI: Speed = this.dataSpeed[iL].speed;
                  // Agregamos la distance y velocidad.
                  speedI.add(report.distance, report.steamingTime);
                  // IFO
                  let totalConsumptionIFO = this.dataSpeed[iL].totalConsumptionIFO + this.SumaIfo(report);
                  // Formula DayliConsumption
                  let dayliConsumptionIFO = speedI.steamingTime ? (totalConsumptionIFO * 24) / speedI.steamingTime : 0;


                  // calculamos la velocidad.
                  let ySpeed = mathRound(speedI.distance / speedI.steamingTime, 2);
                  // Actualizamos el calculo de la velocidad.


                  // ACTUALIZMAOS EL VALOR POR POSICION.
                  // Actualizamos los datos de la velocidad
                  this.dataSpeed[iL].speed = speedI;
                  this.dataIFO[iL].speed = speedI;
                  this.dataSpeed[iL].y = ySpeed;


                  // Actualizamos los datos al dataIfo Chart.
                  this.dataSpeed[iL].totalConsumptionIFO = totalConsumptionIFO;
                  this.dataSpeed[iL].totalBunkeringIFO += report.bunkeringIfo;
                  this.dataSpeed[iL].totalBunkeringMGO += report.bunkeringMgo;

                  this.dataIFO[iL].totalConsumptionIFO = totalConsumptionIFO;
                  this.dataIFO[iL].totalBunkeringIFO += report.bunkeringIfo;
                  this.dataIFO[iL].totalBunkeringMGO += report.bunkeringMgo;
                  // Actualizamos los datos al dataIfo Chart.
                  this.dataIFO[iL].y = dayliConsumptionIFO;

                  // Verificamos que la linea maxima sea mayor al valor del chart-

                  // Verificamos que la linea maxima sea mayor al valor del chart-
                  if (ySpeed > this.configLineaSpeed.lineaMax) {

                    this.configLineaSpeed.lineaMax = ySpeed;
                  }
                  if (dayliConsumptionIFO > this.configLineaIFO.lineaMax) {
                    this.configLineaIFO.lineaMax = dayliConsumptionIFO;
                  }
                  // retornamos tru para agregarlo al filtro
                  return true;
                }
                // Caso contrario retornamos false, para que no lo agrege al filtro.
                return false;
              }

            );

            // Verificamos si se encontro un resultado del dia.
            if (!resultSearch) {

              // agregamos la fecha a nuestro arreglo.
              this.xLabelReport.push(day);

              // Le agregamos los datos de velocidad.
              let newSpeed = new Speed(report.distance, report.steamingTime);
              // Agregamos los datos de velocidad.
              let ySpeed = mathRound(newSpeed.distance / newSpeed.steamingTime, 2);


              // DATOS IFO
              // Calculamos el total de consumo ifo
              let totalConsumptionIFO = this.SumaIfo(report);
              // Formula DayliConsumption
              let dayliConsumptionIFO = newSpeed.steamingTime ? (totalConsumptionIFO * 24) / newSpeed.steamingTime : 0;


              // Formula DayliConsumption


              // ROB total.
              let totalBunkeringIFO = report.bunkeringIfo;
              let totalBunkeringMGO = report.bunkeringMgo;

              let dataExtra = []; // Revisar esto deberiamos tener una propiedad con las actividades registradas.
              // y los ocmentarios registrados.
              dataExtra.push(report)


              // Agregamos los datos SPEED
              this.dataSpeed.push(
                { x: day, y: ySpeed, totalConsumptionIFO: totalConsumptionIFO, totalBunkeringIFO: totalBunkeringIFO, totalBunkeringMGO: totalBunkeringMGO, totalVoyage: 1, totalPort: 1, totalReport: 1, speed: newSpeed, dataExtra: dataExtra }
              );


              this.dataIFO.push(
                { x: day, y: dayliConsumptionIFO, totalConsumptionIFO: totalConsumptionIFO, totalBunkeringIFO: totalBunkeringIFO, totalBunkeringMGO: totalBunkeringMGO, totalVoyage: 1, totalPort: 1, totalReport: 1, speed: newSpeed, dataExtra: dataExtra }
              );


              // Verificamos que la ocnfiguracion de la linea maxima se  mayor al valor del chart.
              if (ySpeed > this.configLineaSpeed.lineaMax) {
                this.configLineaSpeed.lineaMax = ySpeed;
              }

              // Verificamos que la configuracion de la linea maxima se  mayor al valor del chart.
              if (dayliConsumptionIFO > this.configLineaIFO.lineaMax) {
                this.configLineaIFO.lineaMax = dayliConsumptionIFO;
              }

            }
          }
        }
      }
    )

    // Buscamos el contrato por actividad
    let speedByCharter = 0;


    if (activityPerformed === 'SAILING_WITH_LADEN') {
      speedByCharter = selectUser.contractSpeedSailingLadenIFO;
      ifoDailyConsumption = ifoConsumption * 24 / time;
      ifoDailyConsumptionByCharter = selectUser.sailingLoadConsumptionIFO;
    }


    timeByCharter = distance / speedByCharter;

    totalConsumptionByCharter = ifoDailyConsumptionByCharter * timeByCharter / 24;
    // 
    return {
      distance: distance, // distance total recorrida en el puerto en esa actividad.
      time: time, // Tiempo total recorrida en el puerto en esa actividad.
      timeByCharter: timeByCharter, // Tiempo calculado por contrato.
      ifoConsumption: ifoConsumption, // Consumo total del combustible IFO
      ifoDailyConsumption: ifoDailyConsumption, // consumo diario real
      ifoDailyConsumptionByCharter: ifoDailyConsumptionByCharter,// consumo diario por contrato
      totalConsumptionByCharter: totalConsumptionByCharter,
      reports: reports,


      totalIFOME: totalIFOME,
      totalMGOME: totalMGOME,
      totalIFOAE: totalIFOAE,
      totalMGOAE: totalMGOAE,
      totalIFOBoiler: totalIFOBoiler,
      totalMGOBoiler: totalMGOBoiler,

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


  private PluginChartDataLabels() {

    Chart.pluginService.register({
      beforeRender: function (chart: any) {
        if (chart.config.options.showAllTooltips) {
          // create an array of tooltips, 
          // we can't use the chart tooltip because there is only one tooltip per chart
          chart.pluginTooltips = [];
          chart.config.data.datasets.forEach(function (dataset, i) {
            chart.getDatasetMeta(i).data.forEach(function (sector, j) {
              chart.pluginTooltips.push({
                _chart: chart.chart,
                _chartInstance: chart,
                _data: chart.data,
                _options: chart.options.tooltips,
                _active: [sector]
              }, chart);
            });
          });
          chart.options.tooltips.enabled = false; // turn off normal tooltips
        }
      },
      afterDraw: function (chart: any, easing) {
        if (chart.config.options.showAllTooltips) {
          if (!chart.allTooltipsOnce) {
            if (Number(easing) !== 1) {
              return;
            }
            chart.allTooltipsOnce = true;
          }
          chart.options.tooltips.enabled = true;
          Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
            tooltip.initialize();
            tooltip.update();
            tooltip.pivot();
            tooltip.transition(easing).draw();
          });
          chart.options.tooltips.enabled = false;
        }
      }
    });

  }


  // ExportPDFVesselPerformance2() esta funcion genera el pdf.
  private ExportPDFVesselPerformance2(voyages: Voyage[]): Promise<boolean> {

    // Parseamos los viajes para que no se modifique.
    let parseVoyages: Voyage[] = JSON.parse(JSON.stringify(voyages));

    // Armamos el objeto de JSPDF
    const doc = new jsPDF();

    // tamaño de pdf.
    const widthPDF = doc.internal.pageSize.getWidth();
    const heightPDF = doc.internal.pageSize.getHeight();

    let rolTraslate = this.languageService.GetMessage(this.translateCategory, this.selectUser.role);

    // Rango de fecha de inicio y fin
    // Esta variable nos ayudara saber cuando si nicio el reporte y cuando termino.
    let generalStartDate: String;
    let generalEndDate: String;

    // Resumen de todo el viaje.
    const sVPR: SummaryVesselPerformanceReport = new SummaryVesselPerformanceReport();
    sVPR.logoTransgas = './assets/icons/logotransgas.png';
    sVPR.titleDocument = 'Vessel Performance Report';
    sVPR.preparedFor = rolTraslate + ' ' + this.selectUser.name;

    // Lista del resumen de viaje.
    let listGTSOPA_Ballast: GenerateTableSummaryOverallPerformanceAnalisis[] = [];
    let listGTSOPA_Laden: GenerateTableSummaryOverallPerformanceAnalisis[] = [];
    // Inicializamos sincrono.
    return Promise.resolve(true).then(
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
            if (voyage.status) {

              // Agregamos el id y el numero del viaje.
              gTSOPA_Ballast.voyageId = voyage.id;
              gTSOPA_Ballast.voyageNumber = voyage.voyageNumber;


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

                            // Verificamos si tenemos que sumar el viaje.
                            if (isNewVoyage) {
                              isNewVoyage = false;
                              sVPR.totalVoyageSailing += 1;
                              console.log('Voyage'+voyage.voyageNumber +' ' +dailyReport.activityPerformed)
                              // Agregamos el numero de viaje.
                              sVPR.lastVoyageSailing = voyage.voyageNumber;
                            }
                            // Verificamos si tenemos que sumar el puerto.
                            if (isNewPort) {
                              isNewPort = false;
                              sVPR.totalPortSailing += 1;
                              console.log('Voyage'+voyage.voyageNumber+'  Numero de puerto:'+ port.portNumber +' ' +dailyReport.activityPerformed);
                            }

                            // Esta variable tienen el total de ocnsumo
                            let totalIFO = this.SumaIfo(dailyReport);
                            let totalMGO = this.SumaMgo(dailyReport);

                            // Verificamos si es navegando con carga
                            if (this.addSailingInBallast && dailyReport.activityPerformed === 'SAILING_IN_BALLAST') {

                              // Si existe la actividad in ballast agrego la distancia
                              sVPR.totalDistanceBallast += dailyReport.distance;

                              // Solo si hay consumo sumamos el tiempo, distancia y consumo
                              if (totalIFO) {
                                gTSOPA_Ballast.distanceIFO += dailyReport.distance;
                                gTSOPA_Ballast.consumptionIFO += totalIFO;
                                gTSOPA_Ballast.timeIFO += dailyReport.steamingTime;
                              }
                              if (totalMGO) {
                                gTSOPA_Ballast.distanceMGO += dailyReport.distance;
                                gTSOPA_Ballast.consumptionMGO += totalMGO;
                                gTSOPA_Ballast.timeMGO += dailyReport.steamingTime;
                              }


                              // Verificamos si es la actividad navegando sin carga
                            } else if (this.addSailingWithLaden && dailyReport.activityPerformed === 'SAILING_WITH_LADEN') {

                              // Si existe la actividad laden agrego la distancia.
                              sVPR.totalDistanceLaden += dailyReport.distance;

                              // Solo si hay consumo sumamos el tiempo, distancia y consumo
                              if (totalIFO) {
                                gTSOPA_Laden.distanceIFO += dailyReport.distance;
                                gTSOPA_Laden.consumptionIFO += totalIFO;
                                gTSOPA_Laden.timeIFO += dailyReport.steamingTime;
                              }
                              if (totalMGO) {
                                gTSOPA_Laden.distanceMGO += dailyReport.distance;
                                gTSOPA_Laden.consumptionMGO += totalMGO;
                                gTSOPA_Laden.timeMGO += dailyReport.steamingTime;
                              }

                            } else if (this.addSailingWithLaden && dailyReport.activityPerformed === 'ECONOMICAL_NAVIGATION') {

                            }



                          }





                        }
                      }
                    )

                  }
                }
              )



              // Solo si existen tiempo IFO o MGO
              // Agregamos a la lista
              if (gTSOPA_Ballast.timeIFO || gTSOPA_Ballast.timeMGO) {
                listGTSOPA_Ballast.push(gTSOPA_Ballast)
              }
              if (gTSOPA_Laden.timeIFO || gTSOPA_Laden.timeMGO) {
                listGTSOPA_Laden.push(gTSOPA_Laden)
              }


            }
          }
        );


        // Agregamos la fecha de inicio y la fecha fin.
        sVPR.atdAndAta = '20/02/2021 22:00GTM  to 20/02/2021 22:00GTM'
        sVPR.dateStart = ''
        sVPR.dateStart = ''

      }
    ).then(
      result => {

        // Esto es de prueba tenemos que eliminarlo.
        // Al recorrer tendriamos algo asi.
        sVPR.listSummarySpeedCondition =
          [
            new SummarySpeedCondition('Lima-Callao', 'Laden', 200, 0, 10, 0, 20, 0),
            new SummarySpeedCondition('Callao-Ancon', 'Laden', 100, 0, 10, 0, 10, 0),
            new SummarySpeedCondition('Ancon-Talara', 'Laden', 300, 0, 10, 0, 30, 0),
            new SummarySpeedCondition('Lima-Callao', 'Laden', 200, 0, 10, 0, 20, 0),
            new SummarySpeedCondition('Callao-Ancon', 'Laden', 100, 0, 10, 0, 10, 0),
            new SummarySpeedCondition('Ancon-Talara', 'Laden', 300, 0, 10, 0, 30, 0),
            new SummarySpeedCondition('Lima-Callao', 'Laden', 200, 0, 10, 0, 20, 0),
            new SummarySpeedCondition('Callao-Ancon', 'Laden', 100, 0, 10, 0, 10, 0),
            new SummarySpeedCondition('Ancon-Talara', 'Laden', 300, 0, 10, 0, 30, 0),
            new SummarySpeedCondition('Lima-Callao', 'Laden', 200, 0, 10, 0, 20, 0),
            new SummarySpeedCondition('Callao-Ancon', 'Laden', 100, 0, 10, 0, 10, 0),
            new SummarySpeedCondition('Ancon-Talara', 'Laden', 300, 0, 10, 0, 30, 0),
          ];

        // Luego deberiamos enviar esa informacion a los siguientes documentos.

        // Agregamos la primera pagina,
        // El cual tiene resumido todo el reporte.
        this.AddOnePage(doc, sVPR);

        // Agregamos una nueva pagina
        doc.addPage();

        return true;
      }
    ) // Aqui descargamos el documento de pdf.
      .then(
        result => {

          // Inicializamos el height en 0,
          let positionHeight = 0;

          // Agregamos el OverallPerformanceAnalisis
          this.OverallPerformanceAnalysis(doc, widthPDF, heightPDF, positionHeight, listGTSOPA_Ballast, listGTSOPA_Laden)

          return true;
        }
      ).then(
        result => {

          doc.save("test.pdf")

          this.loadingService.Close();
          return true;

        }
      );

  }


  private AddOnePage(doc: jsPDF, sVPR: SummaryVesselPerformanceReport): jsPDF {

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
    
    contentOnePage += 20; // Total Voyage o Numero Voyage
    contentOnePage += 10; // Total Port

    contentOnePage += 18; // ATD


    // calculamos el tamaño del Contenido de la pagina
    // con el tamaño del pdf y o dividimos para que
    // tenga el mismo margen en la altura y bottom
    positionHeight += (heightPDF - contentOnePage) / 2;
    // Eliminar esto, es solo com referencia.
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, positionHeight, widthPDF - (5 * 2), contentOnePage, "FD");

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


    // Agregamos la cantidad o el numero de viaje.
    positionHeight += 20;
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont('Helvetica', 'bold');
    if (sVPR.totalVoyageSailing > 1) {
      doc.text('Total Voyages Sailed: ' + sVPR.totalVoyageSailing, centerPDF, positionHeight, { align: 'center' })
    } else {
      doc.text('N° Voyage: ' + sVPR.lastVoyageSailing, centerPDF, positionHeight, { align: 'center' })
    }


    // Agregamos el total de puertos que hay en ese viaje.
    positionHeight += 10;
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont('Helvetica', 'bold');
    doc.text('Total Ports Sailed: ' + sVPR.totalPortSailing, centerPDF, positionHeight, { align: 'center' })


    // Agregamos la fecha donde inicio el analisis

    //  Agregamos el tiempo de departure y llegada.
    positionHeight += 18;
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.setFont('Helvetica', 'bold');
    doc.text(
      sVPR.atdAndAta,
      centerPDF, positionHeight,
      { align: 'center' }
    );


    return doc;
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


  private OverallPerformanceAnalysis(doc: jsPDF, widthPDF: number, heightPDF: number, positionHeight: number, listGTSOPA_Ballast: GenerateTableSummaryOverallPerformanceAnalisis[], listGTSOPA_Laden: GenerateTableSummaryOverallPerformanceAnalisis[]) {
    positionHeight += 10;
    let positionWidth = 10;

    // Agregamos la cabecera a la pagina.
    positionHeight = this.AddHeaderPage(doc, widthPDF, positionHeight, 'Overall Performance Analysis');

    ///////////////////////////////////////
    ///////// Inicio del 1° Cuadro ////////
    ///////////////////////////////////////

    // Colocamos el rectangulo
    positionHeight += 5.5;
    //positionWidth = 63;
    positionWidth = 7.5;

    // Generamos la tabla resumen del viaje.
    // this.GenerateSummaryTableOverallPerformanceAnalisis(doc, widthPDF, heightPDF, positionWidth, positionHeight, gSTOPA);

    // Generamos todo el resumen por viajes.
    positionHeight += this.GenerateTableOverallPerformanceAnalysis(doc, widthPDF, heightPDF, positionWidth, positionHeight, listGTSOPA_Ballast);

    // Le damos un espacio para el siguiente cuadro.
    positionHeight += 6;
    positionWidth = 10;

    // Generamos la tabla con el total de resumen
    this.GenerateTableTotalOverallPerformanceAnalisis(doc, widthPDF, heightPDF, positionWidth, positionHeight, null)


    //this.GenerateTableTotalOverallPerformanceAnalisis(doc, widthPDF, heightPDF, positionWidth, positionHeight, null)
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
  private GenerateTableOverallPerformanceAnalysis(doc: jsPDF, widthPDF: number, heightPDF: number, positionWidth: number, positionHeight: number, listGTSOPA: GenerateTableSummaryOverallPerformanceAnalisis[]): number {


    let contentHeightTable = 0;
    // Le sumamos el espacio de la cabecera de la tabla.
    contentHeightTable += 16.7;
    // Cada fila o;cupa lo siguiente.
    contentHeightTable += (6.8 * listGTSOPA.length);

    // Eliminar esto, es solo com referencia.
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, positionHeight, widthPDF - (5 * 2), contentHeightTable, "FD");


    // title
    // Agregar la formula para saber si es IFO VLSFO LSFO
    let typeConsumptionSelectBuqueIFO = (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO');


    var data: RowInput[] = [

      // Segunda Fila
      [
        { "content": "Summary by Voyage", "colSpan": 2, "rowSpan": 2 },
        { "content": "Distance\n(MI)", "colSpan": 2 },
        { "content": "Consumption\n(MT)", "colSpan": 2 },
        { "content": "Charter", "colSpan": 2 },
        { "content": "Time\n(HRS)", "colSpan": 2 },
        { "content": "Charter", "colSpan": 2 },
        { "content": "Speed\n(KN)", "colSpan": 2 },
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
        { "content": "MGO", "colSpan": 1 },
        { "content": typeConsumptionSelectBuqueIFO, "colSpan": 1 },
        { "content": "MGO", "colSpan": 1 },
        { "content": typeConsumptionSelectBuqueIFO, "colSpan": 1 },
        { "content": "MGO", "colSpan": 1 },
        { "content": typeConsumptionSelectBuqueIFO, "colSpan": 1 },
        { "content": "MGO", "colSpan": 1 }
      ],
    ];


    listGTSOPA.forEach(
      gTSOPA => {
        data.push(
          [

            { "content": 'Voyage ' + gTSOPA.voyageNumber, "colSpan": 2 },
            // Distance
            { "content": this.MathRoundDecimal(gTSOPA.distanceIFO, 1), "colSpan": 1 },
            { "content": this.MathRoundDecimal(gTSOPA.distanceMGO, 1), "colSpan": 1 },
            // Consumption
            { "content": this.MathRoundDecimal(gTSOPA.consumptionIFO, 1), "colSpan": 1 },
            { "content": this.MathRoundDecimal(gTSOPA.consumptionMGO, 1), "colSpan": 1 },
            // Consumption Charter
            { "content": this.MathRoundDecimal(gTSOPA.consumptionIFOCharter, 1), "colSpan": 1 },
            { "content": this.MathRoundDecimal(gTSOPA.consumptionMGOCharter, 1), "colSpan": 1 },
            // Time
            { "content": this.MathRoundDecimal(gTSOPA.timeIFO, 1), "colSpan": 1 },
            { "content": this.MathRoundDecimal(gTSOPA.timeMGO, 1), "colSpan": 1 },
            // Time Charter
            { "content": this.MathRoundDecimal(gTSOPA.timeIFOCharter, 1), "colSpan": 1 },
            { "content": this.MathRoundDecimal(gTSOPA.timeMGOCharter, 1), "colSpan": 1 },
            // Speed
            { "content": this.MathRoundDecimal(gTSOPA.speedIFO, 1), "colSpan": 1 },
            { "content": this.MathRoundDecimal(gTSOPA.speedIFO, 1), "colSpan": 1 },
            // Speed Charter
            { "content": this.MathRoundDecimal(gTSOPA.speedIFOCharter, 1), "colSpan": 1 },
            { "content": this.MathRoundDecimal(gTSOPA.speedIFOCharter, 1), "colSpan": 1 }

          ]
        )
      }
    )
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
            cell.styles.fontSize = 8;
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
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      1: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 10,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      2: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 13,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      3: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 12,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      4: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 13,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      5: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 12,
        lineWidth: 0.2,
        lineColor: [22, 33, 77]
      },
      6: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 13,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      7: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 12,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      8: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 13,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      9: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 12,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      10: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 13,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      11: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 12,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      12: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 13,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      13: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 12,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      14: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 13,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      15: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 12,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      }
    };


    // Agregamos la tabla.
    autoTable(doc, userOptions);


    return contentHeightTable;
  }

  private GenerateTableTotalOverallPerformanceAnalisis(doc: jsPDF, widthPDF: number, heightPDF: number, positionWidth: number, positionHeight: number, gTSOPA: GenerateTableTotalSummaryOverallPerformanceAnalisis[]) {
    // title
    // Agregar la formula para saber si es IFO VLSFO LSFO
    let typeConsumptionSelectBuqueIFO = (this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO');


    var data: RowInput[] = [

      // Segunda Fila
      [
        { "content": "", "colSpan": 4, "rowSpan": 2 },
        { "content": "Laden", "colSpan": 2 },
        { "content": "Ballast", "colSpan": 2 },
      ],
      [
        { "content": typeConsumptionSelectBuqueIFO, "colSpan": 1 },
        { "content": "MGO", "colSpan": 1 },
        { "content": typeConsumptionSelectBuqueIFO, "colSpan": 1 },
        { "content": "MGO", "colSpan": 1 },
      ],
      [
        { "content": "Transit Distance", "colSpan": 4 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
      [
        { "content": "Transit Time", "colSpan": 4 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
      [
        { "content": "Allowable Charter Time", "colSpan": 4 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
      [
        { "content": "Average Speed", "colSpan": 4 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
      [
        { "content": "Allowable Charter Speed", "colSpan": 4 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
      [
        { "content": "Actual Total Consumption", "colSpan": 4 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
      [
        { "content": "Warranted Total Consumption", "colSpan": 4 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
      [
        { "content": "Actual Daily Consumption", "colSpan": 4 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
        { "content": 0, "colSpan": 1 },
      ],
      [
        { "content": "", "colSpan": 8 },
      ],
      [
        { "content": "", "colSpan": 8 },
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
    userOptions.tableWidth = 190;


    // Total suma 136, pero el widt es 136 hay que revisar.
    userOptions.columnStyles = {
      0: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 14,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      1: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 14,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      2: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 27,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      3: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 27,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      4: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 27,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      5: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 27,
        lineWidth: 0.2,
        lineColor: [22, 33, 77]
      },
      6: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 27,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
      7: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        cellWidth: 27,
        lineWidth: 0.15,
        lineColor: [22, 33, 77]
      },
    };


    // Agregamos la tabla.
    autoTable(doc, userOptions);

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


}