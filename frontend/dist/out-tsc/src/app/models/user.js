export class User {
    constructor(id, imo, nick, name, filename, password, language, role, years, minSpeed, maxSpeed, isConsumptionIFO, isConsumptionLSFO, isConsumptionVLSFO, isConsumptionMGO, maxIFOConsumption, maxMGOConsumption, minIFOConsumption, minMGOConsumption, isMEMGO, isAEMGO, isBoilerMGO, isIGMGO, isPowerPMGO, isOtherMGO, isMEIFO, isAEIFO, isBoilerIFO, isOtherIFO, 
    // Performance MGO
    contractSpeedSailingBallastMGO, contractSpeedSailingLadenMGO, contractSpeedSailingEconomicalMGO, loadingConsumptionMGO, dischargeConsumptionMGO, sailingBallastConsumptionMGO, sailingLoadConsumptionMGO, sailingEconomicConsumptionMGO, anchoredConsumptionMGO, maneuverConsumptionMGO, otherConsumptionMGO, 
    // Performance IFO
    contractSpeedSailingBallastIFO, contractSpeedSailingLadenIFO, contractSpeedSailingEconomicalIFO, loadingConsumptionIFO, dischargeConsumptionIFO, sailingBallastConsumptionIFO, sailingLoadConsumptionIFO, sailingEconomicConsumptionIFO, anchoredConsumptionIFO, maneuverConsumptionIFO, otherConsumptionIFO, 
    // Dashboard
    isDisplayLSFOConsumption, isDisplayMGOConsumption, isDisplayAverageSpeed, isDisplayDataMGO, isDisplayDataLSFO, isDisplayVesselPerformanceLSFO, isDisplayVesselPerformanceMGO, consumptionEquipmentME_MGO, consumptionEquipmentAE_MGO, consumptionEquipmentBOILER_MGO, consumptionEquipmentIG_MGO, consumptionEquipmentPP_MGO, consumptionEquipmentOther_MGO, consumptionEquipmentME_IFO, consumptionEquipmentAE_IFO, consumptionEquipmentBOILER_IFO, consumptionEquipmentOther_IFO, 
    // Auditoria
    userIdCreated, dateCreated, userIdUpdated, dateUpdated, status, syncStatus) {
        this.id = id;
        this.imo = imo;
        this.nick = nick;
        this.name = name;
        this.filename = filename;
        this.password = password;
        this.language = language;
        this.role = role;
        this.years = years;
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;
        this.isConsumptionIFO = isConsumptionIFO;
        this.isConsumptionLSFO = isConsumptionLSFO;
        this.isConsumptionVLSFO = isConsumptionVLSFO;
        this.isConsumptionMGO = isConsumptionMGO;
        this.maxIFOConsumption = maxIFOConsumption;
        this.maxMGOConsumption = maxMGOConsumption;
        this.minIFOConsumption = minIFOConsumption;
        this.minMGOConsumption = minMGOConsumption;
        this.isMEMGO = isMEMGO;
        this.isAEMGO = isAEMGO;
        this.isBoilerMGO = isBoilerMGO;
        this.isIGMGO = isIGMGO;
        this.isPowerPMGO = isPowerPMGO;
        this.isOtherMGO = isOtherMGO;
        this.isMEIFO = isMEIFO;
        this.isAEIFO = isAEIFO;
        this.isBoilerIFO = isBoilerIFO;
        this.isOtherIFO = isOtherIFO;
        this.contractSpeedSailingBallastMGO = contractSpeedSailingBallastMGO;
        this.contractSpeedSailingLadenMGO = contractSpeedSailingLadenMGO;
        this.contractSpeedSailingEconomicalMGO = contractSpeedSailingEconomicalMGO;
        this.loadingConsumptionMGO = loadingConsumptionMGO;
        this.dischargeConsumptionMGO = dischargeConsumptionMGO;
        this.sailingBallastConsumptionMGO = sailingBallastConsumptionMGO;
        this.sailingLoadConsumptionMGO = sailingLoadConsumptionMGO;
        this.sailingEconomicConsumptionMGO = sailingEconomicConsumptionMGO;
        this.anchoredConsumptionMGO = anchoredConsumptionMGO;
        this.maneuverConsumptionMGO = maneuverConsumptionMGO;
        this.otherConsumptionMGO = otherConsumptionMGO;
        this.contractSpeedSailingBallastIFO = contractSpeedSailingBallastIFO;
        this.contractSpeedSailingLadenIFO = contractSpeedSailingLadenIFO;
        this.contractSpeedSailingEconomicalIFO = contractSpeedSailingEconomicalIFO;
        this.loadingConsumptionIFO = loadingConsumptionIFO;
        this.dischargeConsumptionIFO = dischargeConsumptionIFO;
        this.sailingBallastConsumptionIFO = sailingBallastConsumptionIFO;
        this.sailingLoadConsumptionIFO = sailingLoadConsumptionIFO;
        this.sailingEconomicConsumptionIFO = sailingEconomicConsumptionIFO;
        this.anchoredConsumptionIFO = anchoredConsumptionIFO;
        this.maneuverConsumptionIFO = maneuverConsumptionIFO;
        this.otherConsumptionIFO = otherConsumptionIFO;
        this.isDisplayLSFOConsumption = isDisplayLSFOConsumption;
        this.isDisplayMGOConsumption = isDisplayMGOConsumption;
        this.isDisplayAverageSpeed = isDisplayAverageSpeed;
        this.isDisplayDataMGO = isDisplayDataMGO;
        this.isDisplayDataLSFO = isDisplayDataLSFO;
        this.isDisplayVesselPerformanceLSFO = isDisplayVesselPerformanceLSFO;
        this.isDisplayVesselPerformanceMGO = isDisplayVesselPerformanceMGO;
        this.consumptionEquipmentME_MGO = consumptionEquipmentME_MGO;
        this.consumptionEquipmentAE_MGO = consumptionEquipmentAE_MGO;
        this.consumptionEquipmentBOILER_MGO = consumptionEquipmentBOILER_MGO;
        this.consumptionEquipmentIG_MGO = consumptionEquipmentIG_MGO;
        this.consumptionEquipmentPP_MGO = consumptionEquipmentPP_MGO;
        this.consumptionEquipmentOther_MGO = consumptionEquipmentOther_MGO;
        this.consumptionEquipmentME_IFO = consumptionEquipmentME_IFO;
        this.consumptionEquipmentAE_IFO = consumptionEquipmentAE_IFO;
        this.consumptionEquipmentBOILER_IFO = consumptionEquipmentBOILER_IFO;
        this.consumptionEquipmentOther_IFO = consumptionEquipmentOther_IFO;
        this.userIdCreated = userIdCreated;
        this.dateCreated = dateCreated;
        this.userIdUpdated = userIdUpdated;
        this.dateUpdated = dateUpdated;
        this.status = status;
        this.syncStatus = syncStatus;
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
}
export class Login {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.username = username || '';
        this.password = password || '';
    }
}
//# sourceMappingURL=user.js.map