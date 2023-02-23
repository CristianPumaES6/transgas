import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../models/user';
import { stringToDate } from '../../../../assets/moment/moment.assets';
import { Voyage } from '../../../models/voyage';
import { DailyReport } from '../../../models/daily-report';
import { mathRound } from '../../../../assets/math/math.assets';
import { LanguageService } from '../../../services/language.service';
import { FormatDate } from '../../../../assets/moment/moment.assets';
import PerfectScrollbar from 'perfect-scrollbar';
import { FormControl } from '@angular/forms';

// Interface de la clase del componente
export interface IDialogListReport {
  voyage: Voyage,
  selectPortId: number,
  reportId: number,
  isIFO_MGO_SPEED: string,
  selectUser: User,
  typeFilter_Day: boolean,
  filterActivities: string[]
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

  // Viaje filtrado
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
  public isViewBunkering: boolean = false;
  public isViewAllVoyage: boolean = false;

  public activityPerformed = new FormControl();
  public activityPerformedList: string[] = ['LOADING', 'DOWNLOADING', 'SAILING_IN_BALLAST', 'SAILING_WITH_LADEN', 'ECONOMICAL_NAVIGATION', 'ANCHORED', 'MANEUVER', 'OTHER_ACT'];


  // fecha por el cual hacer un filtro si decesamos hacer filtro por dia.
  public dayTheReporteByFilter;

  // Inicializamos el componente
  ngOnInit() {
    console.log('ngOnInit() ');

    // Obtenemos la configuracion si es filtro por dia o todo el viaje.
    let isFilterByDay = this.data.typeFilter_Day;

    this.selectUser = this.data.selectUser;

    // Seleccionamos el puerto ID
    this.selectPortId = this.data.selectPortId;
    // Numero de viaje.
    this.voyageNumber = this.data.voyage.voyageNumber;
    // seleccionamos las actividades que nos envian.
    this.activityPerformed = new FormControl(this.data.filterActivities || []);


    // Recorremos todos los puertos para recorrer los reportes y buscar el reportId
    this.data.voyage.ports.forEach(
      port => {

        // Verificamos que el stado del puerto sea true.
        if (port.status) {

          // Recorremos todos los reporte diarios.
          port.dailyReports.forEach(
            report => {
              if (report.id === this.data.reportId) {
                this.dayTheReporteByFilter = FormatDate(report.date);
              }
            }
          );

        }

      }
    );

    let IFO_MGO_SPEED = this.data.isIFO_MGO_SPEED;
    if (IFO_MGO_SPEED == 'IFO') {
      this.isViewIFO = true;
    } else if (IFO_MGO_SPEED == 'MGO') {
      this.isViewMGO = true;
    } else if (IFO_MGO_SPEED == 'SPEED') {
      this.isViewSPEED = true;
    }

    // no filtramos los por duerto ya que queremos que todos los reportes registrados ese dia se muestren.
    this.AplicateFilterVoyage(isFilterByDay, false);

    // PerfectScrollbar, para el elemento div az-contact-info-body del html.
    new PerfectScrollbar('.tableFixHead');

  }

  // Evento no click.
  public Close(): void {
    this.dialogRef.close();
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

  // Al darle click a CheckAllVoyage 
  public ClickCheckViewAllVoyage() {
    console.log('ClickCheckViewAllVoyage()');


    if (this.isViewAllVoyage) {
      // deseleccionamos el portId
      this.selectPortId = 0;
      // reset activityPerformed
      this.activityPerformed = new FormControl();

      this.AplicateFilterVoyage(false, false);
    } else {

      // Seleccionamos el puerto ID
      this.selectPortId = this.data.selectPortId;
      // seleccionamos las actividades que nos envian.
      this.activityPerformed = new FormControl(this.data.filterActivities || []);

      this.AplicateFilterVoyage(true, false);
    }
  }


  // Al seleccionar un puerto filtramos el viaje, caso contrario mostramos todo el viaje.
  public ClickSelectPort(indexPort?: number): void {
    if (indexPort == null) {
      this.AplicateFilterVoyage(false, false);
    } else {
      this.AplicateFilterVoyage(false, true);
    }
  }

  // Click filtro por actividad.
  public ClickFilterByActivities() {

    // Si existe un puerto seleccionado filtramos por puerto
    if (this.selectPortId && this.selectPortId > 0) {
      this.AplicateFilterVoyage(false, true);
    } else {
      // si no existe ningun puerto seleccionado, hacemos un filtro normal.
      this.AplicateFilterVoyage(false, false);
    }
  }

  // Aplicar filtro al viaje.
  private AplicateFilterVoyage(isFilterByDay: boolean, isFilterByPort: boolean) {

    console.log('AplicateFilterVoyage(isFilterByDay: boolean) ');

    // Hacemos una copia del viaje
    this.filterVoyage = JSON.parse(JSON.stringify(this.data.voyage));

    // Recorremos los puertos y hacemos filtros.
    this.filterVoyage.ports = this.filterVoyage.ports.filter(
      (port, iP) => {
        // El estado del puerto debe ser true caso contrario ha sido eliminado
        if (port.status) {

          // Si se esta activado el filtro por puerto verificamos que el puerto sea el mismo.
          if (isFilterByPort && port.id !== this.selectPortId) {
            return false;
          }

          // recorremos tolos reportes generados.
          port.dailyReports = port.dailyReports.filter(
            (report, iR) => {


              // Revisamos que el reporte no halla sido eliminado, caso contrario lo filtramos.
              if (report.status && (
                // verificamos que el puerto sea el seleccionado ono este seleccionado.
                (!this.activityPerformed.value || this.activityPerformed.value.length === 0) ||
                this.activityPerformed.value.find(activity => activity === report.activityPerformed)
              )
              ) {


                // Filtro por dia.
                if (isFilterByDay && !isFilterByPort) {
                  if (FormatDate(report.date) === this.dayTheReporteByFilter) {
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
    );

  }

  public ToolTipMoreInformation(isIFO_MGO_SPEED: string, report: DailyReport) {
    let result = '';

    if (isIFO_MGO_SPEED === 'IFO') {

      if (this.selectUser.isMEIFO) {
        result += '    M.E: ' + this.TwoDecimal(report.mplaIfo)
      }
      if (this.selectUser.isAEIFO) {
        result += '    A.E: ' + this.TwoDecimal(report.auxIfo)
      }
      if (this.selectUser.isBoilerIFO) {
        result += '    Boiler: ' + this.TwoDecimal(report.boilerIfo)
      }
      if (this.selectUser.isOtherIFO) {
        result += '    Other: ' + this.TwoDecimal(report.otherIfo)
      }

    } else if (isIFO_MGO_SPEED === 'MGO') {


      if (this.selectUser.isMEMGO) {
        result += '    M.E: ' + this.TwoDecimal(report.mplaMgo)
      }
      if (this.selectUser.isAEMGO) {
        result += '    A.E: ' + this.TwoDecimal(report.auxMgo)
      }
      if (this.selectUser.isBoilerMGO) {
        result += '    Boiler: ' + this.TwoDecimal(report.boilerMgo)
      }
      if (this.selectUser.isIGMGO) {
        result += '    G.I: ' + this.TwoDecimal(report.giMgo)
      }
      if (this.selectUser.isPowerPMGO) {
        result += '    Power P: ' + this.TwoDecimal(report.ppMgo)
      }
      if (this.selectUser.isOtherMGO) {
        result += '    Other: ' + this.TwoDecimal(report.otherMgo)
      }

    } else if (isIFO_MGO_SPEED === 'SPEED') {
      result += 'Distance: ' + this.TwoDecimal(report.distance)
      result += '\n Beaufort: ' + report.beaufour;
    }

    return result;
  }

  // Esta funcion calcula el valor que se desea retornar sea del charter o del value.
  public GenerateDailyConsumption(isVALUEorCHARTER: string, isIFOorMGOorSPEEDIFOorSPEEDMGO: string, dailyReport: DailyReport): number {

    // Resultados
    let result: number = 0;
    let activityPerformed: string = dailyReport.activityPerformed;
    // Si solo queremos el valor por charter
    if (isVALUEorCHARTER === 'CHARTER') {


      if (isIFOorMGOorSPEEDIFOorSPEEDMGO === 'IFO') {
        if (activityPerformed === 'LOADING') {
          result = this.selectUser.loadingConsumptionIFO;
        } else if (activityPerformed === 'DOWNLOADING') {
          result = this.selectUser.dischargeConsumptionIFO;
        } else if (activityPerformed === 'SAILING_IN_BALLAST') {
          result = this.selectUser.sailingBallastConsumptionIFO;
        } else if (activityPerformed === 'SAILING_WITH_LADEN') {
          result = this.selectUser.sailingLoadConsumptionIFO;
        } else if (activityPerformed === 'ECONOMICAL_NAVIGATION') {
          result = this.selectUser.sailingEconomicConsumptionIFO;
        } else if (activityPerformed === 'ANCHORED') {
          result = this.selectUser.anchoredConsumptionIFO;
        } else if (activityPerformed === 'MANEUVER') {
          result = this.selectUser.maneuverConsumptionIFO;
        } else if (activityPerformed === 'OTHER_ACT') {
          result = this.selectUser.otherConsumptionIFO;
        }
      } else if (isIFOorMGOorSPEEDIFOorSPEEDMGO === 'MGO') {


        /* if (activityPerformed === 'LOADING') {
          result = this.selectUser.loadingConsumptionMGO;
        } else if (activityPerformed === 'DOWNLOADING') {
          result = this.selectUser.dischargeConsumptionMGO;
        } else if (activityPerformed === 'SAILING_IN_BALLAST') {
          result = this.selectUser.sailingBallastConsumptionMGO;
        } else if (activityPerformed === 'SAILING_WITH_LADEN') {
          result = this.selectUser.sailingLoadConsumptionMGO;
        } else if (activityPerformed === 'ECONOMICAL_NAVIGATION') {
          result = this.selectUser.sailingEconomicConsumptionMGO;
        } else if (activityPerformed === 'ANCHORED') {
          result = this.selectUser.anchoredConsumptionMGO;
        } else if (activityPerformed === 'MANEUVER') {
          result = this.selectUser.maneuverConsumptionMGO;
        } else if (activityPerformed === 'OTHER_ACT') {
          result = this.selectUser.otherConsumptionMGO;
        } */


        // Esto lo pongo por que en mgo, no hay una configuracion.
        result = this.selectUser.maxMGOConsumption;

      } else if (isIFOorMGOorSPEEDIFOorSPEEDMGO === 'SPEEDIFO') {

        if (activityPerformed === 'SAILING_IN_BALLAST') {
          result = this.selectUser.contractSpeedSailingBallastIFO;
        } else if (activityPerformed === 'SAILING_WITH_LADEN') {
          result = this.selectUser.contractSpeedSailingLadenIFO;
        } else if (activityPerformed === 'ECONOMICAL_NAVIGATION') {
          result = this.selectUser.contractSpeedSailingEconomicalIFO;
        }

      } else if (isIFOorMGOorSPEEDIFOorSPEEDMGO === 'SPEEDMGO') {

        if (activityPerformed === 'SAILING_IN_BALLAST') {
          result = this.selectUser.contractSpeedSailingBallastMGO;
        } else if (activityPerformed === 'SAILING_WITH_LADEN') {
          result = this.selectUser.contractSpeedSailingLadenMGO;
        } else if (activityPerformed === 'ECONOMICAL_NAVIGATION') {
          result = this.selectUser.contractSpeedSailingEconomicalMGO;
        }

      }

    } else if (isVALUEorCHARTER === 'VALUE') {

      // El valor se obtendra segun lo que se desea sea MGO IFO o SPEED
      if (isIFOorMGOorSPEEDIFOorSPEEDMGO === 'IFO') {
        result = (dailyReport.steamingTime && this.TotalIFO(dailyReport)) ? (this.TotalIFO(dailyReport) * 24) / dailyReport.steamingTime : 0;
      } else if (isIFOorMGOorSPEEDIFOorSPEEDMGO === 'MGO') {
        result = (dailyReport.steamingTime && this.TotalMGO(dailyReport)) ? (this.TotalMGO(dailyReport) * 24) / dailyReport.steamingTime : 0;
      } else if (isIFOorMGOorSPEEDIFOorSPEEDMGO === 'SPEEDIFO' || isIFOorMGOorSPEEDIFOorSPEEDMGO === 'SPEEDMGO') {
        result = (dailyReport.steamingTime && dailyReport.distance) ? (dailyReport.distance / dailyReport.steamingTime) : 0;
      }

    }

    return this.TwoDecimal(result);

  }

  public GenerateColor(value?: number, charter?: number): string {
    let generateClass = '';

    value = Number(value);
    charter = Number(charter);

    if (!value && !charter || (value == 0 || charter == 0)) {
      generateClass = '';
    } else if (value > charter) {
      generateClass = 'color-max';
    } else if (value <= charter) {
      generateClass = 'color-min';
    }

    return generateClass;
  }

}
