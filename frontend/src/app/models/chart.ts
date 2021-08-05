import * as Chart from "chart.js";

// Interface del conponente Chart
export class DataChart {

    constructor(
        public chart?:Chart,
        public xLabelReport?: any[],
        public data?: Chart.ChartPoint[],
        public data2?: Chart.ChartPoint[],
        public config?: Chart.ChartConfiguration
    ) {
        this.chart = chart || null;
        this.xLabelReport = xLabelReport || [];
        this.data = data || [];
        this.data2 = data2 || [];
        this.config = config || {};
    }
}