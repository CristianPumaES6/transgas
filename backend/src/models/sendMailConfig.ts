
export class SendMailConfig {
    public userId: number; // id Socket
    public emails: string

    constructor(
        userId?: number,
        emails?: string
    ) {
        this.userId = userId || 0;
        this.emails = emails || '';
    }

}

export class MailLastVoyage {
    public nameBuque: string;
    public dateCurrent: string;
    public currentMGO: number;
    public currentVLSFO: number;
    public bunkeringIFO: number;
    public bunkeringMGO: number;
    public consumptionActivity: Consumption_IFO_and_MGO_byActivity;
    public IFO_VLSFO_LSFO?: string;
    public isVIew_IFO_VLSFO_LSFO?: boolean;
    public MGO?: string;
    public isVIew_MGO?: boolean;
    constructor(
        nameBuque?: string,
        dateCurrent?: string,
        currentMGO?: number,
        currentVLSFO?: number,
        bunkeringIFO?: number,
        bunkeringMGO?: number,
        consumptionActivity?: Consumption_IFO_and_MGO_byActivity,
        IFO_VLSFO_LSFO?: string,
        isVIew_IFO_VLSFO_LSFO?: boolean,
        MGO?: string,
        isVIew_MGO?: boolean,
    ) {
        this.nameBuque = nameBuque || '';
        this.dateCurrent = dateCurrent || null;
        this.currentMGO = currentMGO || 0;
        this.currentVLSFO = currentVLSFO || 0;
        this.consumptionActivity = consumptionActivity || new Consumption_IFO_and_MGO_byActivity();
        this.bunkeringIFO = bunkeringIFO || 0;
        this.bunkeringMGO = bunkeringMGO || 0;
        this.IFO_VLSFO_LSFO = IFO_VLSFO_LSFO || null;
        this.isVIew_IFO_VLSFO_LSFO = isVIew_IFO_VLSFO_LSFO || false;
        this.MGO = MGO || null;
        this.isVIew_MGO = isVIew_MGO || false;
    }
}

export class Consumption_IFO_and_MGO_byActivity {

    constructor(
        public ifoResumen?: typeActivityConsumption,
        public mgoResumen?: typeActivityConsumption
    ) {
        this.ifoResumen = ifoResumen || new typeActivityConsumption();
        this.mgoResumen = mgoResumen || new typeActivityConsumption();
    }
}

export class typeActivityConsumption {

    constructor(
        public loading?: ConsumptionActivity,
        public discharge?: ConsumptionActivity,
        public ballast?: ConsumptionActivity,
        public laden?: ConsumptionActivity,
        public economical?: ConsumptionActivity,
        public anchored?: ConsumptionActivity,
        public maneuver?: ConsumptionActivity,
        public other_act?: ConsumptionActivity
    ) {
        this.loading = loading || new ConsumptionActivity('LOADING');
        this.discharge = discharge || new ConsumptionActivity('DOWNLOADING');
        this.ballast = ballast || new ConsumptionActivity('SAILING_IN_BALLAST');
        this.laden = laden || new ConsumptionActivity('SAILING_WITH_LADEN');
        this.economical = economical || new ConsumptionActivity('ECONOMICAL_NAVIGATION');
        this.anchored = anchored || new ConsumptionActivity('ANCHORED');
        this.maneuver = maneuver || new ConsumptionActivity('MANEUVER');
        this.other_act = other_act || new ConsumptionActivity('OTHER_ACT');
    }

}

// Consumo por actividad
export class ConsumptionActivity {

    constructor(
        public activityName?: string,
        public timeActivity?: number,
        public consumption?: number,
        public dailyConsumption?: number,
        public dailyConsumptionCharter?: number
    ) {
        this.activityName = activityName || '';
        this.timeActivity = timeActivity || 0;
        this.consumption = consumption || 0;
        this.dailyConsumption = dailyConsumption || 0;
        this.dailyConsumptionCharter = dailyConsumptionCharter || 0;

    }
}





