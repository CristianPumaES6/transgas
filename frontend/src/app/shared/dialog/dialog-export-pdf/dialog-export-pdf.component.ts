import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import jsPDF from 'jspdf';
import { DailyReport } from 'src/app/models/daily-report';
import { LoadingService } from 'src/app/services/loading.service';
import { mathRound } from 'src/assets/math/math.assets';
import { FormatDate } from 'src/assets/moment/moment.assets';
import { Port } from '../../../models/port';
import { User } from '../../../models/user';
import { Voyage } from '../../../models/voyage';
import { LanguageService } from '../../../services/language.service';
import { DialogListReportComponent } from '../dialog-list-report/dialog-list-report.component';

// Interface de los input del componente.
export interface IDialogExportPdf {
  voyages: Voyage[],
  selectUser: User,
  selectVoyageId: number,
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

  // Viajes y puertos.
  public voyages: Voyage[] = [];
  public ports: Port[] = [];

  ngOnInit(): void {
    // seleccionar usuario.
    this.selectUser = this.data.selectUser;

    // Viajes
    this.voyages = this.data.voyages;
    this.selectVoyageId = this.data.selectVoyageId;

    // SI existe un viaje seleccioando lo buscamos.
    if (this.selectVoyageId) {
      // Buscamos el viaje.
      let voyageSelect = this.voyages.find(voyage => voyage.id === this.selectVoyageId);
      // agregamos los puertos del viaje.
      this.ports = voyageSelect.ports;
    }

    // Seleccionamos el tipo de exportacion.
    this.selectTypeExport = 'VESSEL_PERFORMANCE';
  }

  // Se ejecuta cada vez que se cambia de viaje.
  public ClickSelectVoyage() {
    // Verificamos si se selecciono un viaje.
    if (this.selectVoyageId) {
      let voyage = this.voyages.find(voyage => voyage.id === this.selectVoyageId);
      this.ports = voyage.ports;

    }
  }

  public ClickSelectPort() {

  }

  // Cuando le das click al boton exportar pdf
  public ClickExportPDF() {
    Promise.resolve(true).then(
      result => {

        // Exportar pdf
        return this.ExportPDFVesselPerformance();
      }
    ).then(
      result => {
        if (!result) throw 'ERROR_EXPORT_PDF_VESSEL_PERFORMANCE';

        return true;
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



          // Calcularemos la hora tarde o antes
          getInfoByActivity = this.GetInfoByActivity(port, 'SAILING_WITH_LADEN', this.selectUser);

          // Si el tiempo es que el tiempo fue mayor que la del contrato lo pintamos de rojo.
          if (getInfoByActivity.time > getInfoByActivity.timeByCharter) {

            let diffHour = getInfoByActivity.time - getInfoByActivity.timeByCharter;
            doc.setTextColor(255, 0, 0);
            doc.text(this.MathRoundOneDecimal(diffHour, 2) + " Hours Lost", 140, positionHeight, { align: 'left' })

          } else {
            let diffHour = getInfoByActivity.timeByCharter - getInfoByActivity.time;
            doc.setTextColor(0, 128, 0);
            doc.text(this.MathRoundOneDecimal(diffHour, 2) + ' Hours before', 140, positionHeight, { align: 'left' })

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
      ).then(
        result => {

          // Agregamos una pagina
          doc.addPage();

          //////////////////////////////////
          //////// INICIAMOS LA CABECERA////
          //////////////////////////////////
          let positionHeight = 10;
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
          doc.text(this.MathRoundOneDecimal(getInfoByActivity.distancia, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('NM', 135, positionHeight, { align: 'left' });


          positionHeight += 6;
          doc.setFont('Helvetica', 'bold');
          doc.text("Transit Time :", 80, positionHeight, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          doc.text(this.MathRoundOneDecimal(getInfoByActivity.time, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('Hours', 135, positionHeight, { align: 'left' });


          positionHeight += 6;
          doc.setFont('Helvetica', 'bold');
          doc.text("Average Speed :", 80, positionHeight, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          let averageSpeedPerformed = getInfoByActivity.distancia / (getInfoByActivity.time || 1);
          doc.text(this.MathRoundOneDecimal(averageSpeedPerformed, 2) + '', 130, positionHeight, { align: 'right' });
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
          doc.text(this.MathRoundOneDecimal(averageSpeedPerformed, 2) + '', 130, positionHeight, { align: 'right' });
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
          doc.text(this.MathRoundOneDecimal(getInfoByActivity.time, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('Hours', 135, positionHeight, { align: 'left' });

          positionHeight += 6;
          doc.setTextColor(0, 0, 0);
          doc.text("Allowable Charter Time :", 80, positionHeight, { align: 'right' });
          doc.setTextColor(22, 33, 77);
          doc.text(this.MathRoundOneDecimal(getInfoByActivity.distancia / this.selectUser.contractSpeedSailingLadenIFO, 2) + '', 130, positionHeight, { align: 'right' });
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
            doc.text(this.MathRoundOneDecimal(diffHour, 2) + '', 130, positionHeight, { align: 'right' });
            doc.text('Hours Lost', 135, positionHeight, { align: 'left' });
          } else {
            let diffHour = getInfoByActivity.timeByCharter - getInfoByActivity.time;
            doc.setTextColor(0, 128, 0);
            doc.text(this.MathRoundOneDecimal(diffHour, 2) + '', 130, positionHeight, { align: 'right' });
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
          doc.text(this.MathRoundOneDecimal(getInfoByActivity.ifoDailyConsumptionByCharter, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('MT', 135, positionHeight, { align: 'left' });

          positionHeight += 6;
          doc.setTextColor(0, 0, 0);
          doc.text("Actual Daily Consumption :", 80, positionHeight, { align: 'right' });
          doc.setTextColor(22, 33, 77);
          doc.text(this.MathRoundOneDecimal(getInfoByActivity.ifoDailyConsumption, 2) + '', 130, positionHeight, { align: 'right' });
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
          doc.text(this.MathRoundOneDecimal(getInfoByActivity.totalConsumptionByCharter, 2) + '', 130, positionHeight, { align: 'right' });
          doc.text('MT', 135, positionHeight, { align: 'left' });

          positionHeight += 6;
          doc.setTextColor(0, 0, 0);
          doc.text("Actual Total Consumption :", 80, positionHeight, { align: 'right' });
          doc.setTextColor(22, 33, 77);
          doc.text(this.MathRoundOneDecimal(getInfoByActivity.ifoConsumption, 2) + '', 130, positionHeight, { align: 'right' });
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
          if (getInfoByActivity.time > getInfoByActivity.timeByCharter) {

            let diffHour = getInfoByActivity.time - getInfoByActivity.timeByCharter;
            doc.setTextColor(255, 0, 0);
            doc.text('Overall Fuel Oil Consumption Out Guaranteed Limitsy', widthPDF / 2, positionHeight, { align: 'center' });

          } else {

            let diffHour = getInfoByActivity.timeByCharter - getInfoByActivity.time;
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

        }
      )
      // Aqui descargamos el documento de pdf.
      .then(
        result => {

          doc.save(this.selectUser.name + "_V" + voyage.voyageNumber + "_P" + port.portNumber + "-" + port.departurePort + "-" + port.arrivalPort + ".pdf")

          return true;

        }
      );

  }


  // Obtiene el primer y ultimo reporte ingresado.
  private GetStartReportAndEndReportThePort(port: Port): any {

    let startReport: DailyReport;
    let endReport: DailyReport;

    if (port.dailyReports.length > 0) {

      startReport = port.dailyReports[0];
      endReport = port.dailyReports[port.dailyReports.length - 1];

    } else {
      throw 'ERROR_GetStartrReportAndEndReportThePort()'
    }



    return {
      startReport: startReport,
      endReport: endReport,
    }

  }



  // 
  //SAILING_WITH_LADEN
  private GetInfoByActivity(port: Port, activityPerformed: string, selectUser: User): any {

    // Consumo total del puerto.
    let distancia = 0;
    let time = 0;
    let timeByCharter = 0;
    let ifoConsumption = 0;
    let ifoDailyConsumption = 0;
    let ifoDailyConsumptionByCharter = 0;
    let totalConsumptionByCharter = 0;
    let reports: DailyReport[] = [];

    // Recorremos los reportes para obtener el tiempo y la distancia.
    port.dailyReports.forEach(
      (report: DailyReport) => {
        // verificamos que este activo
        if (report.status === true) {
          // Solo sumamos el tiempo y la distancia.
          if (report.activityPerformed === activityPerformed) {
            distancia += report.distance;
            time += report.steamingTime;
            ifoConsumption += this.SumaIfo(report);
            //lo agregamos al reporte.
            reports.push(report);
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


    timeByCharter = distancia / speedByCharter;

    totalConsumptionByCharter = ifoDailyConsumptionByCharter * timeByCharter / 24;
    // 
    return {
      distancia: distancia, // Distancia total recorrida en el puerto en esa actividad.
      time: time, // Tiempo total recorrida en el puerto en esa actividad.
      timeByCharter: timeByCharter, // Tiempo calculado por contrato.
      ifoConsumption: ifoConsumption, // Consumo total del combustible IFO
      ifoDailyConsumption: ifoDailyConsumption, // consumo diario real
      ifoDailyConsumptionByCharter: ifoDailyConsumptionByCharter,// consumo diario por contrato
      totalConsumptionByCharter: totalConsumptionByCharter,
      reports: reports
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

  public MathRoundOneDecimal(valor, cantDecimales: number) {

    if (!valor) { return 0; }

    let result = mathRound(valor, cantDecimales || 0)

    return result;
  }

}

