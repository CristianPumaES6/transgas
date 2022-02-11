import { Component, OnInit } from '@angular/core';
import {  ChartData,registerables  } from 'chart.js';
import { getRelativePosition } from 'chart.js/helpers';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-speed-analysis',
  templateUrl: './speed-analysis.component.html',
  styleUrls: ['./speed-analysis.component.scss']
})
export class SpeedAnalysisComponent implements OnInit {

  constructor() { 
  }

  ngOnInit(): void {

    let canvaMyChart: any = document.getElementById('myChart');
    // Convertimos el canvaLineIfo en 2d
    let ctxMyChart = canvaMyChart.getContext('2d');
    
    const myChart = new Chart(
      ctxMyChart,
       {
        type: 'line',
        data:  {
          datasets: [{
            data: [{x: 10, y: 20}, {x: 15, y: null}, {x: 20, y: 10}]
          }]
        },
        options: {
          onClick: (e) => {
            const canvasPosition = getRelativePosition(e, myChart);
      
            // Substitute the appropriate scale IDs
            const dataX = myChart.scales.x.getValueForPixel(canvasPosition.x);
            const dataY = myChart.scales.y.getValueForPixel(canvasPosition.y);
          }
        }
      }
    );
  }

}
