// Modelo generico del componente Dashboard.

// Modelo de las actividades realizadas.
export class ActivityPerformed {
    constructor(
        public loading?: number,
        public discharge?: number,
        public ballast?: number,
        public laden?: number,
        public economical?: number,
        public anchor?: number,
        public maneuver?: number,
        public otherActivity?: number,
    ) {
        this.loading = loading || 0;
        this.discharge = discharge || 0;
        this.ballast = ballast || 0;
        this.laden = laden || 0;
        this.economical = economical || 0;
        this.anchor = anchor || 0;
        this.maneuver = maneuver || 0;
        this.otherActivity = otherActivity || 0;
    }
}

// Modelo de consumo por equipo MGO
export class ConsumptionMachineMGO {
    constructor(
        public mpal?: number,
        public aux?: number,
        public boiler?: number,
        public pp?: number,
        public gi?: number,
        public other?: number,
        public total?: number,
    ) {
        this.mpal = mpal || 0;
        this.aux = aux || 0;
        this.boiler = boiler || 0;
        this.pp = pp || 0;
        this.gi = gi || 0;
        this.other = other || 0;
        this.total = total || 0;
    }
}



// Modelo de consumo por equipo IFO
export class ConsumptionMachineIFO {
    constructor(
        public mpal?: number,
        public aux?: number,
        public boiler?: number,
        public other?: number,
        public total?: number,
    ) {
        this.mpal = mpal || 0;
        this.aux = aux || 0;
        this.boiler = boiler || 0;
        this.other = other || 0;
        this.total = total || 0;
    }
}


// esta clase se usa para el filtro de dashboard, para las cajas de texto fecha inicio y fin.
export class FilterWithDate {

    constructor(
        public isFilterWithDate?: boolean,
        public startDate?: Date,
        public endDate?: Date
    ) {
        this.isFilterWithDate = isFilterWithDate || false;
        this.startDate = startDate || null;
        this.endDate = endDate || null;
    }
}


// Estructura del cuadro Consumption
export class ConsumptionAndBunkering{
    constructor(
        public ifoConsumption?: number,
        public mgoConsumption?: number,
        public ifoBunkering?: number,
        public mgoBunkering?: number
    ) {
        this.ifoConsumption = ifoConsumption || 0;
        this.mgoConsumption = mgoConsumption || 0;
        this.ifoBunkering = ifoBunkering || 0;
        this.mgoBunkering = mgoBunkering || 0;
    }
}
