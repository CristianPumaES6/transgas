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

