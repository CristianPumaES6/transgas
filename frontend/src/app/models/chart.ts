import * as Chart from "chart.js";

// Interface del conponente Chart
export class DataChart {

    constructor(
        public chart?:Chart,
        public xLabelReport?: any[],
        public data?: Chart.ChartPoint[],
        public config?: Chart.ChartConfiguration
    ) {
        this.chart = chart || null;
        this.xLabelReport = xLabelReport || [];
        this.data = data || [];
        this.config = config || {};
    }
}