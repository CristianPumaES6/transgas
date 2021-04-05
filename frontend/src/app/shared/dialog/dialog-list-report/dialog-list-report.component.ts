import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../models/user';
import { stringToDate } from '../../../../assets/moment/moment.assets';
import { Voyage } from '../../../models/voyage';
import { DailyReport } from '../../../models/daily-report';
import { mathRound } from '../../../../assets/math/math.assets';
import { LanguageService } from '../../../services/language.service';
import { FormatDate } from 'dist/frontend/assets/moment/moment.assets';

// Interface de la clase del componente
export interface IDialogListReport {
  voyage: Voyage,
  selectPortId: number,
  reportId: number,
  isIFO_MGO_SPEED: string,
  selectUser: User,
  typeFilter_Day: boolean,
}


@Component({
  selector: 'app-dialog-list-report',
  templateUrl: './dialog-list-report.component.html',
  styleUrls: ['./dialog-list-report.component.scss']
})
export class DialogListReportComponent implements OnInit {

  // Constructores para setear valores al componente.
  constructor(
    public dialogRef: MatDialogRef<DialogListReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogListReport,
    private languageService: LanguageService,
  ) { }

  // Traducciones
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'dialog';

  // VIaje con filtro
  public filterVoyage: Voyage = new Voyage();

  // Puerto seleccionado
  public selectPortId: number;
  // Usuario seleccionado
  public selectUser: User = new User();

  // VARIABLES DEL HTML
  public voyageNumber: number = 0;
  public departurePort: string = '';
  public arrivalPort: string = '';

  // Checkbox
  public isViewMGO: boolean = false;
  public isViewIFO: boolean = false;
  public isViewSPEED: boolean = false;

  // Inicializamos el componente
  ngOnInit() {
    console.log('ngOnInit() ');

    // Obtenemos la configuracion si es filtro por dia o todo el viaje.
    let isFilterByDay = this.data.typeFilter_Day;


    // Seleccionamos el puerto ID
    this.selectPortId = this.data.selectPortId;

    // Hacemos una copia del viaje
    this.filterVoyage = JSON.parse(JSON.stringify(this.data.voyage));

    // Obtenemos la fecha del reporte.
    let dayTheReporteByFilter;
    // Recorremos todos los puertos para recorrer los reportes y buscar el reportId
    this.data.voyage.ports.forEach(
      port => {

        // Verificamos que el stado del puerto sea true.
        if (port.status) {
          // Recorremos todos los reporte diarios.
          port.dailyReports.forEach(
            report => {
              if (report.id === this.data.reportId) {
                dayTheReporteByFilter = FormatDate(report.date);
              }
            }
          )
        }

      }
    );



    // Recorremos los puertos y hacemos filtros.
    this.filterVoyage.ports = this.filterVoyage.ports.filter(
      (port, iP) => {
        // El estado del puerto debe ser true caso contrario ha sido eliminado
        if (port.status) {

          // recorremos tolos reportes generados.
          port.dailyReports = port.dailyReports.filter(
            (report, iR) => {


              // Revisamos que el reporte no halla sido eliminado, caso contrario lo filtramos.
              if (report.status) {

                // Filtro por dia.
                if (isFilterByDay) {

                  if (FormatDate(report.date) === dayTheReporteByFilter) {
                    return true;
                  } else {
                    return false;
                  }

                } else {
                  // caso contrario mostramos todo.
                  return true;
                }

              } else {
                return false;
              }

            }
          )

          // Si existen registros el filtro lo dejara pasar caso contrario no.
          if (port.dailyReports.length) return true;
          else return false;

          
        } else {
          // Si el estado del puerto es false lo filtramos para que no aparesca.
          return false;
        }
      }
    )

    this.selectUser = this.data.selectUser;

    console.log(this.filterVoyage);

    let IFO_MGO_SPEED = this.data.isIFO_MGO_SPEED;
    if (IFO_MGO_SPEED == 'IFO') {
      this.isViewIFO = true;
    } else if (IFO_MGO_SPEED == 'MGO') {
      this.isViewMGO = true;
    } else if (IFO_MGO_SPEED == 'SPEED') {
      this.isViewSPEED = true;
    }

  }

  // Evento no click.
  onNoClick(): void {
    this.dialogRef.close();
  }

  SelectPort(): void {

  }




  // Mejorar esto
  public StringToDate(fecha: any): string {

    let formatfecha = stringToDate(fecha);
    return formatfecha;
  }



  // Total del consumo IFO
  public TotalIFO(dailyReport: DailyReport): number {
    // Total del consumo MGO
    let total = 0;

    // sumamos el consumo
    total = dailyReport.mplaIfo + dailyReport.auxIfo + dailyReport.boilerIfo + dailyReport.otherIfo;

    // Retornamos el total de cosumo
    return mathRound(total, 2);
  }

  // Total del consumo MGO
  public TotalMGO(dailyReport: DailyReport): number {
    // Total del consumo MGO
    let total = 0;

    // sumamos el consumo
    total = dailyReport.mplaMgo + dailyReport.auxMgo + dailyReport.boilerMgo + dailyReport.ppMgo + dailyReport.giMgo + dailyReport.otherMgo;

    // Retornamos el total de cosumo
    return mathRound(total, 2);
  }

  public TwoDecimal(number): number {
    return mathRound(number, 2);
  }


}
