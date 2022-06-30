import { GetLastPortAndTotalConsump } from "./port";

export class User {
    constructor(
        public id?: number,
        public imo?: string,
        public nick?: string,
        public name?: string,
        public filename?: string,
        public password?: string,
        public language?: string,
        public role?: string,

        public years?: number[],
        
        public minSpeed?: number,
        public maxSpeed?: number,
        public isConsumptionIFO?: boolean,
        public isConsumptionLSFO?: boolean,
        public isConsumptionVLSFO?: boolean,
        public isConsumptionMGO?: boolean,
        public maxIFOConsumption?: number,
        public maxMGOConsumption?: number,
        public minIFOConsumption?: number,
        public minMGOConsumption?: number,
        public isMEMGO?: boolean,
        public isAEMGO?: boolean,
        public isBoilerMGO?: boolean,
        public isIGMGO?: boolean,
        public isPowerPMGO?: boolean,
        public isOtherMGO?: boolean,
        public isMEIFO?: boolean,
        public isAEIFO?: boolean,
        public isBoilerIFO?: boolean,
        public isOtherIFO?: boolean,

        // Performance MGO
        public contractSpeedSailingBallastMGO?: number,
        public contractSpeedSailingLadenMGO?: number,
        public contractSpeedSailingEconomicalMGO?: number,
        public loadingConsumptionMGO?: number,
        public dischargeConsumptionMGO?: number,
        public sailingBallastConsumptionMGO?: number,
        public sailingLoadConsumptionMGO?: number,
        public sailingEconomicConsumptionMGO?: number,
        public anchoredConsumptionMGO?: number,
        public maneuverConsumptionMGO?: number,
        public otherConsumptionMGO?: number,

        // Performance IFO
        public contractSpeedSailingBallastIFO?: number,
        public contractSpeedSailingLadenIFO?: number,
        public contractSpeedSailingEconomicalIFO?: number,
        public loadingConsumptionIFO?: number,
        public dischargeConsumptionIFO?: number,
        public sailingBallastConsumptionIFO?: number,
        public sailingLoadConsumptionIFO?: number,
        public sailingEconomicConsumptionIFO?: number,
        public anchoredConsumptionIFO?: number,
        public maneuverConsumptionIFO?: number,
        public otherConsumptionIFO?: number,

        // Dashboard
        public isDisplayLSFOConsumption?: boolean,
        public isDisplayMGOConsumption?: boolean,
        public isDisplayAverageSpeed?: boolean,
        public isDisplayDataMGO?: boolean,
        public isDisplayDataLSFO?: boolean,
        public isDisplayVesselPerformanceLSFO?: boolean,
        public isDisplayVesselPerformanceMGO?: boolean,


        public consumptionEquipmentME_MGO?: number,
        public consumptionEquipmentAE_MGO?: number,
        public consumptionEquipmentBOILER_MGO?: number,
        public consumptionEquipmentIG_MGO?: number,
        public consumptionEquipmentPP_MGO?: number,
        public consumptionEquipmentOther_MGO?: number,
        public consumptionEquipmentME_IFO?: number,
        public consumptionEquipmentAE_IFO?: number,
        public consumptionEquipmentBOILER_IFO?: number,
        public consumptionEquipmentOther_IFO?: number,


        // Auditoria
        public userIdCreated?: number,
        public dateCreated?: Date,
        public userIdUpdated?: number,
        public dateUpdated?: Date,
        public status?: boolean,
        public syncStatus?: string,// none added, updated, deleted

    ) {
        this.id = id || null;
        this.imo = imo || '';
        this.nick = nick || '';
        this.name = name || '';
        this.filename = filename || '';
        this.password = password || '';
        this.language = language || 'EN';
        this.role = role || '';

        this.years = years || [];
        
        this.minSpeed = minSpeed || 0;
        this.maxSpeed = maxSpeed || 0;
        this.isConsumptionIFO = isConsumptionIFO || false;
        this.isConsumptionLSFO = isConsumptionLSFO || false;
        this.isConsumptionVLSFO = isConsumptionVLSFO || false;
        this.isConsumptionMGO = isConsumptionMGO || false;
        this.maxIFOConsumption = maxIFOConsumption || 0;
        this.maxMGOConsumption = maxMGOConsumption || 0;
        this.minIFOConsumption = minIFOConsumption || 0;
        this.minMGOConsumption = minMGOConsumption || 0;
        this.isMEMGO = isMEMGO || false;
        this.isAEMGO = isAEMGO || false;
        this.isBoilerMGO = isBoilerMGO || false;
        this.isIGMGO = isIGMGO || false;
        this.isPowerPMGO = isPowerPMGO || false;
        this.isOtherMGO = isOtherMGO || false;
        this.isMEIFO = isMEIFO || false;
        this.isAEIFO = isAEIFO || false;
        this.isBoilerIFO = isBoilerIFO || false;
        this.isOtherIFO = isOtherIFO || false;

        // Performance MGO
        this.contractSpeedSailingBallastMGO = contractSpeedSailingBallastMGO || 0;
        this.contractSpeedSailingLadenMGO = contractSpeedSailingLadenMGO || 0;
        this.contractSpeedSailingEconomicalMGO = contractSpeedSailingEconomicalMGO || 0;
        this.loadingConsumptionMGO = loadingConsumptionMGO || 0;
        this.dischargeConsumptionMGO = dischargeConsumptionMGO || 0;
        this.sailingBallastConsumptionMGO = sailingBallastConsumptionMGO || 0;
        this.sailingLoadConsumptionMGO = sailingLoadConsumptionMGO || 0;
        this.sailingEconomicConsumptionMGO = sailingEconomicConsumptionMGO || 0;
        this.anchoredConsumptionMGO = anchoredConsumptionMGO || 0;
        this.maneuverConsumptionMGO = maneuverConsumptionMGO || 0;
        this.otherConsumptionMGO = otherConsumptionMGO || 0;


        // Performance IFO
        this.contractSpeedSailingBallastIFO = contractSpeedSailingBallastIFO || 0;
        this.contractSpeedSailingLadenIFO = contractSpeedSailingLadenIFO || 0;
        this.contractSpeedSailingEconomicalIFO = contractSpeedSailingEconomicalIFO || 0;
        this.loadingConsumptionIFO = loadingConsumptionIFO || 0;
        this.dischargeConsumptionIFO = dischargeConsumptionIFO || 0;
        this.sailingBallastConsumptionIFO = sailingBallastConsumptionIFO || 0;
        this.sailingLoadConsumptionIFO = sailingLoadConsumptionIFO || 0;
        this.sailingEconomicConsumptionIFO = sailingEconomicConsumptionIFO || 0;
        this.anchoredConsumptionIFO = anchoredConsumptionIFO || 0;
        this.maneuverConsumptionIFO = maneuverConsumptionIFO || 0;
        this.otherConsumptionIFO = otherConsumptionIFO || 0;


        // Dashboard
        this.isDisplayLSFOConsumption = isDisplayLSFOConsumption || false;
        this.isDisplayMGOConsumption = isDisplayMGOConsumption || false;
        this.isDisplayAverageSpeed = isDisplayAverageSpeed || false;
        this.isDisplayDataMGO = isDisplayDataMGO || false;
        this.isDisplayDataLSFO = isDisplayDataLSFO || false;
        this.isDisplayVesselPerformanceLSFO = isDisplayVesselPerformanceLSFO || false;
        this.isDisplayVesselPerformanceMGO = isDisplayVesselPerformanceMGO || false;



        this.consumptionEquipmentME_MGO = consumptionEquipmentME_MGO || 0;
        this.consumptionEquipmentAE_MGO = consumptionEquipmentAE_MGO || 0;
        this.consumptionEquipmentBOILER_MGO = consumptionEquipmentBOILER_MGO || 0;
        this.consumptionEquipmentIG_MGO = consumptionEquipmentIG_MGO || 0;
        this.consumptionEquipmentPP_MGO = consumptionEquipmentPP_MGO || 0;
        this.consumptionEquipmentOther_MGO = consumptionEquipmentOther_MGO || 0;
        this.consumptionEquipmentME_IFO = consumptionEquipmentME_IFO || 0;
        this.consumptionEquipmentAE_IFO = consumptionEquipmentAE_IFO || 0;
        this.consumptionEquipmentBOILER_IFO = consumptionEquipmentBOILER_IFO || 0;
        this.consumptionEquipmentOther_IFO = consumptionEquipmentOther_IFO || 0;




        // Audiotoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || null;
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || null;
        this.status = status || false;
        this.syncStatus = '';
    }

    lastPortAndTotalConsump: GetLastPortAndTotalConsump;
}


export class Login {
    constructor(
        public username?: string,
        public password?: string,
    ) {
        this.username = username || '';
        this.password = password || '';
    }
}