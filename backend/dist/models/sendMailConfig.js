"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumptionActivity = exports.typeActivityConsumption = exports.Consumption_IFO_and_MGO_byActivity = exports.MailLastVoyage = exports.SendMailConfig = void 0;
class SendMailConfig {
    constructor(userId, emails) {
        this.userId = userId || 0;
        this.emails = emails || '';
    }
}
exports.SendMailConfig = SendMailConfig;
class MailLastVoyage {
    constructor(nameBuque, dateCurrent, currentMGO, currentVLSFO, bunkeringIFO, bunkeringMGO, consumptionActivity) {
        this.nameBuque = nameBuque || '';
        this.dateCurrent = dateCurrent || null;
        this.currentMGO = currentMGO || 0;
        this.currentVLSFO = currentVLSFO || 0;
        this.consumptionActivity = consumptionActivity || new Consumption_IFO_and_MGO_byActivity();
        this.bunkeringIFO = bunkeringIFO || 0;
        this.bunkeringMGO = bunkeringMGO || 0;
    }
}
exports.MailLastVoyage = MailLastVoyage;
class Consumption_IFO_and_MGO_byActivity {
    constructor(ifoResumen, mgoResumen) {
        this.ifoResumen = ifoResumen;
        this.mgoResumen = mgoResumen;
        this.ifoResumen = ifoResumen || new typeActivityConsumption();
        this.mgoResumen = mgoResumen || new typeActivityConsumption();
    }
}
exports.Consumption_IFO_and_MGO_byActivity = Consumption_IFO_and_MGO_byActivity;
class typeActivityConsumption {
    constructor(loading, discharge, ballast, laden, economical, anchored, maneuver, other_act) {
        this.loading = loading;
        this.discharge = discharge;
        this.ballast = ballast;
        this.laden = laden;
        this.economical = economical;
        this.anchored = anchored;
        this.maneuver = maneuver;
        this.other_act = other_act;
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
exports.typeActivityConsumption = typeActivityConsumption;
class ConsumptionActivity {
    constructor(activityName, timeActivity, consumption, dailyConsumption, dailyConsumptionCharter) {
        this.activityName = activityName;
        this.timeActivity = timeActivity;
        this.consumption = consumption;
        this.dailyConsumption = dailyConsumption;
        this.dailyConsumptionCharter = dailyConsumptionCharter;
        this.activityName = activityName || '';
        this.timeActivity = timeActivity || 0;
        this.consumption = consumption || 0;
        this.dailyConsumption = dailyConsumption || 0;
        this.dailyConsumptionCharter = dailyConsumptionCharter || 0;
    }
}
exports.ConsumptionActivity = ConsumptionActivity;
//# sourceMappingURL=sendMailConfig.js.map