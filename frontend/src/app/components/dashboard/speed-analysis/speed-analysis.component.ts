import { Component, OnInit } from '@angular/core';
import { ChartData, registerables } from 'chart.js';
import { getRelativePosition } from 'chart.js/helpers';
import Chart from 'chart.js/auto';
import { DailyReportService } from 'src/app/services/daily-report.service';
import { GetReportVoyagePortDaily } from 'src/app/models/dialog-export-excel';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-speed-analysis',
  templateUrl: './speed-analysis.component.html',
  styleUrls: ['./speed-analysis.component.scss']
})
export class SpeedAnalysisComponent implements OnInit {

  // Configuracion del SPEED
  public configLineaSPEED: any; // configuracion del elemento
  public chartLineSPEED: Chart; // LINEA
  public dataSPEED: Chart.ChartPoint[] = []; // Data

  public xLabelReport: any[] = [];


  public listGetReportVoyagePortDaily: GetReportVoyagePortDaily[] = [];

  constructor(
    private _dailyReportService: DailyReportService
  ) {
  }

  ngOnInit(): void {


    // Inicia la promesa.
    Promise.resolve(true)
      .then(
        result => {
          // Buscamos la informacion del combustible de inicio y fin segun la fecha.
          return this.GetReportVoyagePortDaily(3, '2022-01-24T13:00:00Z', '2022-02-07T13:00:00Z').pipe().toPromise();
        }).then(
          result => {
            if (!result) throw 'ERROR GER REPORT';
            this.listGetReportVoyagePortDaily = result;


            console.log(this.listGetReportVoyagePortDaily)
          });


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
      options: { // Otras opciones dentro del Chart
        onClick: (event, activeElement) => {
          // REVISAR ESTO, Aqui se ejecuta la data que se muestra al dar click a los puntos dentro del chart.

        },
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
    let canvaLineSPEED: any = document.getElementById('myChart');
    // Convertimos el canvaLineIfo en 2d
    let ctxLineSPEED: any = canvaLineSPEED.getContext('2d');

    this.chartLineSPEED = new Chart(ctxLineSPEED, this.configLineaSPEED);
  }


  private UpdateLineSPEED(): boolean {
    console.log('UpdateLineSPEED()');


    // Actualizamos los labels
    this.configLineaSPEED.data.labels = this.xLabelReport;

    // Actualizamos la dataSPEED
    this.configLineaSPEED.data.datasets[0].data = this.dataSPEED;

    // Vaciamos la configuracion de las lines SPEED
    // La linea es el campo que agregamos en el plugin.
    this.configLineaSPEED.options.lines = [];





    // Si ninguna actividad a sido seleccionada, agregamos la linea maxima segun configuracion.


    // Si el consumo maximo es mayor a 0 lo pintamos si no, no hace falta.
    // if (this.selectUser.maxSpeed > 0) {
    /*  this.configLineaSPEED.options.lines.push({
       type: 'horizontal',
       y: this.selectUser.maxSpeed,
       color: 'red',
       label: ''
     }); */
    // };
    /* 
          if (this.selectUser.minSpeed > 0) {
            this.configLineaSPEED.options.lines.push({
              type: 'horizontal',
              y: this.selectUser.minSpeed,
              color: '#39FF14',
              label: ''
            });
             
          }*/


    // Esta linea maxima es para la scala del cuadro.
    /*  if (this.configLineaSPEED.lineaMax < this.selectUser.maxSpeed) {
       this.configLineaSPEED.lineaMax = this.selectUser.maxSpeed;
     } */
    /* 
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
    
     */
    // Esta linea maxima es para la scala del cuadro.
    /* if (this.configLineaSPEED.lineaMax < lineaMaxByActivity) {
      this.configLineaSPEED.lineaMax = lineaMaxByActivity;
    } 

  }
*/


    // Configuracion Tooltips
    // this.configLineaSPEED.options.tooltips = this.GetToolTipConfig('SPEED');



    /* 
    
        if (this.configLineaSPEED.lineaMax < this.selectUser.maxSpeed) {
          this.configLineaSPEED.lineaMax = this.selectUser.maxSpeed;
        } */

    // Agregamos la configuracion de las escalas.
    /*  this.configLineaSPEED.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaSPEED.lineaMax, 0) + 2);
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

}
