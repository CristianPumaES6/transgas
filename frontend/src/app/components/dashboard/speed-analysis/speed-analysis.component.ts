import { Component, OnInit } from '@angular/core';
import { ChartData, registerables } from 'chart.js';
import { getRelativePosition } from 'chart.js/helpers';
import Chart from 'chart.js/auto';
import { DailyReportService } from 'src/app/services/daily-report.service';
import { GetReportVoyagePortDaily } from 'src/app/models/dialog-export-excel';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChartConfiguration } from 'chart.js';
import { LoadingService } from 'src/app/services/loading.service';
import { LanguageService } from 'src/app/services/language.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-speed-analysis',
  templateUrl: './speed-analysis.component.html',
  styleUrls: ['./speed-analysis.component.scss']
})
export class SpeedAnalysisComponent implements OnInit {
  // Esta variable nos ayudara a saber si nos encontramos con conexion al servidor.
  public isOnline: boolean = true;

  // Variables de traduccion
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'dashboard';

  // Rol del usuario logeado.
  public roleUser: string = '';

  // ------------ Chart ----------------
  public xLabelReport: any[] = [];
  // Configuracion del SPEED
  public chartPointDataSPEED: any[] = []; // Data
  public configLineaSPEED: ChartConfiguration; // configuracion del elemento
  public chartLineSPEED: Chart; // LINEA
  // ------------ Fin Chart Speed ----------------


  // Variable del grupo de formulario.
  public formFilter: FormGroup;
  public typeSummaryVoyageList: string[] = ['VOYAGES', 'PORTS', 'MONTHS', 'DAYS'];
  public listGetReportVoyagePortDaily: GetReportVoyagePortDaily[] = [];


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _dailyReportService: DailyReportService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
    private fb: FormBuilder,
  ) {
    // Inicializamos y bloqueamos el formulario.
     this.ReactiveForm(true, false, true);
  }

  ngOnInit(): void {



    // Configuracion Chart lineal
    this.configLineaSPEED = {
      type: 'line',
      data: {
        labels: [], // Lo pongo vacio por que en el update se colocara el valor.
        datasets: [{
          label: 'AVERAGE SPEED',
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: [], // Lo pongo vacio por que en el update se colocara el valor.
          fill: false,
        }]
      },
      options: {
        // Otras opciones dentro del Chart
        onClick: (event, activeElement) => {
          // REVISAR ESTO, Aqui se ejecuta la data que se muestra al dar click a los puntos dentro del chart.

        },
        legend: {
          // La leyenda es el texto que esta arriva del cuadro.
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
          // @ts-ignore
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
    let canvaLineSPEED: any = document.getElementById('myChart');
    // Convertimos el canvaLineIfo en 2d
    let ctxLineSPEED: any = canvaLineSPEED.getContext('2d');

    this.chartLineSPEED = new Chart(ctxLineSPEED, this.configLineaSPEED);
  }

  public async ClickButtonTest(): Promise<boolean> {


    // Filtros por fecha.
    let userSelect = 2;
    let dateStart = '2022-01-24T13:00:00Z';
    let dateEnd = '2022-02-07T13:00:00Z';

    // Inicia la promesa.
    return await Promise.resolve(true)
      .then(
        result => {
          // Obtenemos el total por actividad
          return this.GetTotalByActivityFilterByUserIdAndDateAndType(userSelect, dateStart, dateEnd).pipe().toPromise();
        }).then(
          result => {
            if (!result) throw 'ERROR GER REPORT';

            this.listGetReportVoyagePortDaily = result;

            return this.GenerateData(this.chartPointDataSPEED, this.listGetReportVoyagePortDaily);
          }).then(
            result => {

              this.UpdateLineSPEED()

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
          );


  }


  private async GenerateData(
    // Data del chart
    // Esto me arroja error Chart.ChartPoint asi que solo le pongo any
    chartPointDataSPEED: any[],
    // Data de los reportes
    getReportVoyagePortDaily: GetReportVoyagePortDaily[]
  ): Promise<boolean> {


    return await Promise.resolve(true).then(
      result => {


        getReportVoyagePortDaily.forEach(iGetReporteVPD => {

          chartPointDataSPEED.push(
            { x: iGetReporteVPD.activityPerformed, y: iGetReporteVPD.distance }
          );

        });

        return true;
      }
    ).then(
      result => {
        return true;
      }
    )


  }

  private UpdateLineSPEED(): boolean {
    console.log('UpdateLineSPEED()');


    // Actualizamos los labels
    this.configLineaSPEED.data.labels = this.xLabelReport;

    // Actualizamos la dataSPEED
    // Revisar esto por que ponen datas .datasets[0].data  si la variable es un arreglo de tipo chartPOint
    debugger
    this.configLineaSPEED.data.datasets[0].data = this.chartPointDataSPEED;

    // Vaciamos la configuracion de las lines SPEED
    // La linea es el campo que agregamos en el plugin.
    this.configLineaSPEED.options.lines = [];




    /*
    
    
        // Si ninguna actividad a sido seleccionada, agregamos la linea maxima segun configuracion.
        if (
          (!this.frmCActivityPerformed.value || this.frmCActivityPerformed.value.length === 0)) {
    
    
    
    
          // Si el consumo maximo es mayor a 0 lo pintamos si no, no hace falta.
          if (this.selectUser.maxSpeed > 0) {
            this.configLineaSPEED.options.lines.push({
              type: 'horizontal',
              y: this.selectUser.maxSpeed,
              color: 'red',
              label: ''
            });
          };
    
          if (this.selectUser.minSpeed > 0) {
            this.configLineaSPEED.options.lines.push({
              type: 'horizontal',
              y: this.selectUser.minSpeed,
              color: '#39FF14',
              label: ''
            });
          }
    
    
          // Esta linea maxima es para la scala del cuadro.
          if (this.configLineaSPEED.lineaMax < this.selectUser.maxSpeed) {
            this.configLineaSPEED.lineaMax = this.selectUser.maxSpeed;
          }
    
        } else {
          // AQUI RECORREMOS TODAS LAS ACTIVIDADES CON EL FIN DE EL CONSTRAR LA MAYOR LINEA MAXIMA.
    
          let lineaMaxByActivity = 0;
          this.frmCActivityPerformed.value.forEach(activity => {
    
            let lineMax = 0;
    
            if (activity === 'SAILING_IN_BALLAST') { lineMax = this.selectUser.contractSpeedSailingBallastIFO; }
            else if (activity === 'SAILING_WITH_LADEN') { lineMax = this.selectUser.contractSpeedSailingLadenIFO; }
            else if (activity === 'ECONOMICAL_NAVIGATION') { lineMax = this.selectUser.contractSpeedSailingEconomicalIFO; }
    
            if (lineMax > lineaMaxByActivity) {
              lineaMaxByActivity = lineMax;
            }
    
          });
    
          // Verificamos que la mayor linea maxima de las actividades sea mayor a 0 para ponerlo.
          if (lineaMaxByActivity > 0) {
    
            this.configLineaSPEED.options.lines.push({
              type: 'horizontal',
              y: lineaMaxByActivity,
              color: '#39FF14',
              label: ''
            });
          }
    
    
          // Esta linea maxima es para la scala del cuadro.
          if (this.configLineaSPEED.lineaMax < lineaMaxByActivity) {
            this.configLineaSPEED.lineaMax = lineaMaxByActivity;
          }
    
    */
    this.chartLineSPEED.update();

    return false;
  }

  // Obtenemos la info de todos los viajes agregado.
  private GetReportVoyagePortDaily(userId: number, startDate: string, endDate: string): Observable<GetReportVoyagePortDaily[]> {
    // Obtenemos el rob de inicio y el consumo hecho en el filtro.
    // Obtenemos todos los usuarios
    return this._dailyReportService.GetReportVoyagePortDailyByUserIdAndDate(userId, startDate, endDate).pipe(map(
      (resultGetROBByUser: GetReportVoyagePortDaily[]) => {

        if (!resultGetROBByUser && resultGetROBByUser.length > 0) throw 'ERROR_GET_ROB_BY_USER';


        return resultGetROBByUser;
      }
    ));
  }

  // Obtenemos la info de todos los viajes agregado.
  private GetTotalByActivityFilterByUserIdAndDateAndType(userId: number, startDate: string, endDate: string): Observable<GetReportVoyagePortDaily[]> {
    // Obtenemos el rob de inicio y el consumo hecho en el filtro.
    // Obtenemos todos los usuarios
    return this._dailyReportService.GetTotalByActivityFilterByUserIdAndDateAndType(userId, startDate, endDate).pipe(map(
      (resultGetROBByUser: GetReportVoyagePortDaily[]) => {

        if (!resultGetROBByUser && resultGetROBByUser.length > 0) throw 'ERROR_GetTotalByActivityFilterByUserIdAndDateAndType';


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
      //this.user.name = this.formFilter.controls['name'].value;
      //this.user.nick = this.formFilter.controls['nick'].value;
      //this.user.password = this.formFilter.controls['password'].value;
      //this.user.role = this.formFilter.controls['role'].value;
    }

    // Seteamos los valores del formulario con los datos del user.
    if (setForm) {
      //this.formFilter.controls['name'].setValue(this.user.name);
      //this.formFilter.controls['nick'].setValue(this.user.nick);
      //this.formFilter.controls['password'].setValue(this.user.password);
      //this.formFilter.controls['role'].setValue(this.user.role);
    }

    // Validamos si el stado del formulario es VALID
    if (validate) {
      this.formFilter.markAllAsTouched();
      return this.formFilter.status == 'VALID';
    }

    return true;
  }
}
