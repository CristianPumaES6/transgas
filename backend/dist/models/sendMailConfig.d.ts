export declare class SendMailConfig {
    userId: number;
    emails: string;
    constructor(userId?: number, emails?: string);
}
export declare class MailLastVoyage {
    nameBuque: string;
    dateCurrent: string;
    currentMGO: number;
    currentVLSFO: number;
    bunkeringIFO: number;
    bunkeringMGO: number;
    consumptionActivity: Consumption_IFO_and_MGO_byActivity;
    IFO_VLSFO_LSFO?: string;
    isVIew_IFO_VLSFO_LSFO?: boolean;
    MGO?: string;
    isVIew_MGO?: boolean;
    constructor(nameBuque?: string, dateCurrent?: string, currentMGO?: number, currentVLSFO?: number, bunkeringIFO?: number, bunkeringMGO?: number, consumptionActivity?: Consumption_IFO_and_MGO_byActivity, IFO_VLSFO_LSFO?: string, isVIew_IFO_VLSFO_LSFO?: boolean, MGO?: string, isVIew_MGO?: boolean);
}
export declare class Consumption_IFO_and_MGO_byActivity {
    ifoResumen?: typeActivityConsumption;
    mgoResumen?: typeActivityConsumption;
    constructor(ifoResumen?: typeActivityConsumption, mgoResumen?: typeActivityConsumption);
}
export declare class typeActivityConsumption {
    loading?: ConsumptionActivity;
    discharge?: ConsumptionActivity;
    ballast?: ConsumptionActivity;
    laden?: ConsumptionActivity;
    economical?: ConsumptionActivity;
    anchored?: ConsumptionActivity;
    maneuver?: ConsumptionActivity;
    other_act?: ConsumptionActivity;
    constructor(loading?: ConsumptionActivity, discharge?: ConsumptionActivity, ballast?: ConsumptionActivity, laden?: ConsumptionActivity, economical?: ConsumptionActivity, anchored?: ConsumptionActivity, maneuver?: ConsumptionActivity, other_act?: ConsumptionActivity);
}
export declare class ConsumptionActivity {
    activityName?: string;
    timeActivity?: number;
    consumption?: number;
    dailyConsumption?: number;
    dailyConsumptionCharter?: number;
    constructor(activityName?: string, timeActivity?: number, consumption?: number, dailyConsumption?: number, dailyConsumptionCharter?: number);
}
