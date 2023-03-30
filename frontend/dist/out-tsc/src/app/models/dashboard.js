// Modelo generico del componente Dashboard.
// Modelo de las actividades realizadas.
export class ActivityPerformed {
    constructor(loading, discharge, ballast, laden, economical, anchor, maneuver, otherActivity) {
        this.loading = loading;
        this.discharge = discharge;
        this.ballast = ballast;
        this.laden = laden;
        this.economical = economical;
        this.anchor = anchor;
        this.maneuver = maneuver;
        this.otherActivity = otherActivity;
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
    constructor(mpal, aux, boiler, pp, gi, other, total) {
        this.mpal = mpal;
        this.aux = aux;
        this.boiler = boiler;
        this.pp = pp;
        this.gi = gi;
        this.other = other;
        this.total = total;
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
    constructor(mpal, aux, boiler, other, total) {
        this.mpal = mpal;
        this.aux = aux;
        this.boiler = boiler;
        this.other = other;
        this.total = total;
        this.mpal = mpal || 0;
        this.aux = aux || 0;
        this.boiler = boiler || 0;
        this.other = other || 0;
        this.total = total || 0;
    }
}
// esta clase se usa para el filtro de dashboard, para las cajas de texto fecha inicio y fin.
export class FilterWithDate {
    constructor(isFilterWithDate, startDate, endDate) {
        this.isFilterWithDate = isFilterWithDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isFilterWithDate = isFilterWithDate || false;
        this.startDate = startDate || null;
        this.endDate = endDate || null;
    }
}
// Estructura del cuadro Consumption
export class ConsumptionAndBunkering {
    constructor(ifoConsumption, mgoConsumption, ifoBunkering, mgoBunkering) {
        this.ifoConsumption = ifoConsumption;
        this.mgoConsumption = mgoConsumption;
        this.ifoBunkering = ifoBunkering;
        this.mgoBunkering = mgoBunkering;
        this.ifoConsumption = ifoConsumption || 0;
        this.mgoConsumption = mgoConsumption || 0;
        this.ifoBunkering = ifoBunkering || 0;
        this.mgoBunkering = mgoBunkering || 0;
    }
}
export class InfoReport_IFO_AND_MGO {
    constructor(ifo, mgo) {
        this.ifo = ifo;
        this.mgo = mgo;
        this.ifo = [];
        this.mgo = [];
    }
}
//# sourceMappingURL=dashboard.js.map