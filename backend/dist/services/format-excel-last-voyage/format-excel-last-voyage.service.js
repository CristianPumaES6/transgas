"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateFormatObjForExcelEmail = exports.PosicionDelosRegistrosNormales = exports.InfoVessel = exports.FormatExcelLastVoyageService = void 0;
const common_1 = require("@nestjs/common");
const promises_assets_1 = require("../../assets/promises.assets");
const exceljs_1 = require("exceljs");
const user_entity_1 = require("../../models/user.entity");
const port_entity_1 = require("../../models/port.entity");
const moment_assets_1 = require("../../assets/moment.assets");
const sendMailConfig_1 = require("../../models/sendMailConfig");
const translate_assets_1 = require("../../assets/translate.assets");
let FormatExcelLastVoyageService = class FormatExcelLastVoyageService {
    async GenerateFormatObjForExcelEmail(listGetReportVoyagePortDaily, getInfoFuelStartEndByFilterDate, selectUser) {
        let objGenerateFormatObjForExcelEmail = new GenerateFormatObjForExcelEmail();
        objGenerateFormatObjForExcelEmail.success = true;
        let workbook;
        return await (0, promises_assets_1.DummyPromise)().then(result => {
            workbook = new exceljs_1.Workbook();
            workbook.creator = 'transgas.web.app';
            let worksheet = workbook.addWorksheet('Data Report');
            return this.GenerarHojaDataReport(worksheet, listGetReportVoyagePortDaily, getInfoFuelStartEndByFilterDate, selectUser);
        }).then(result => {
            objGenerateFormatObjForExcelEmail.objMailLastVoyage = result;
            this.AddInfoByPortAccordingToTheTravelreport(workbook, 2, 10, new user_entity_1.UserEntity(), listGetReportVoyagePortDaily, getInfoFuelStartEndByFilterDate);
            return workbook.xlsx.writeFile((0, moment_assets_1.GetHours)() + '.xlsx');
        }).then(result => {
            return workbook.xlsx.writeBuffer();
        }).then((result) => {
            if (!result)
                throw 'ERROR_WRITE_BUFFER_1001';
            objGenerateFormatObjForExcelEmail.buffer = result;
            return objGenerateFormatObjForExcelEmail;
        });
    }
    async ResetColumn(worksheet) {
        worksheet.columns = [
            { width: 0 },
            { width: 0 },
            { width: 0 },
            { width: 0 },
            { width: 0 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 6 },
            { width: 6 },
            { width: 6 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
        ];
        return true;
    }
    async GenerarHojaDataReport(worksheet, listGetReportVoyagePortDaily, getInfoFuelStartEndByFilterDate, selectUser) {
        this.ResetColumn(worksheet);
        let colorYellowTransgas = 'FFCD06';
        let blueHard = '001556';
        let blueMedium = '09155694';
        let blueLow = 'b6c2ff94';
        let blueHard1 = '375f9a';
        let blueHard2 = '0040d8';
        let blueHard3 = '001556';
        let greenHard = '091556';
        let greenMedium = '09155694';
        let greenLow = 'b6c2ff94';
        let black = '000000';
        let white = 'ffffff';
        let grisFuerte = 'd4d4d4';
        let grisMedio = 'ebe8e8';
        let grisSuave = 'f3f3f3';
        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';
        let resetColumn = 7;
        let positionColumn = resetColumn;
        let positionRow = 2;
        let cantidadDeFilaInsertadas = this.StyleDashLegend(worksheet, positionRow, positionColumn);
        positionRow += cantidadDeFilaInsertadas;
        let posicionDelosRegistrosNormales = {
            startRow: 47,
            endRow: 46 + listGetReportVoyagePortDaily.length
        };
        let posicionDelosRegistrosActivitPerforment = {
            startRow: 34,
            endRow: 41,
            startColum: 7
        };
        let infoVessel = new InfoVessel();
        infoVessel.date_start = listGetReportVoyagePortDaily[0].date + '';
        infoVessel.date_end = listGetReportVoyagePortDaily[listGetReportVoyagePortDaily.length - 1].date + '';
        infoVessel.ifo_start = getInfoFuelStartEndByFilterDate.infoFuelStart.total_ifo;
        infoVessel.mgo_start = getInfoFuelStartEndByFilterDate.infoFuelStart.total_mgo;
        infoVessel.ifo_end = getInfoFuelStartEndByFilterDate.infoFuelEnd.total_ifo;
        infoVessel.mgo_end = getInfoFuelStartEndByFilterDate.infoFuelEnd.total_mgo;
        let posicionDelInfoVessel = {
            startRow: positionRow + 2,
            endRow: 41,
            startColum: 7
        };
        positionRow += 2;
        positionColumn = 7;
        let tamanioInfoVessel = this.StyleDashInfoVessel(worksheet, positionRow, positionColumn, selectUser, infoVessel, posicionDelosRegistrosNormales, posicionDelosRegistrosActivitPerforment);
        posicionDelInfoVessel.endRow = positionRow + tamanioInfoVessel;
        positionRow += tamanioInfoVessel + 2;
        positionColumn = 7;
        let tamanioCosumptionIFO = this.StyleDashCosumption(worksheet, positionRow, positionColumn, selectUser, 'IFO', posicionDelosRegistrosNormales);
        positionColumn = 47;
        let tamanioCosumptionMGO = this.StyleDashCosumption(worksheet, positionRow, positionColumn, selectUser, 'MGO', posicionDelosRegistrosNormales);
        positionRow += tamanioCosumptionIFO + 2;
        let objMailLastVoyage = this.StyleDashReportRegister(worksheet, positionRow, selectUser, listGetReportVoyagePortDaily, posicionDelInfoVessel);
        objMailLastVoyage.nameBuque = selectUser.name;
        objMailLastVoyage.dateCurrent = infoVessel.date_end;
        objMailLastVoyage.currentMGO = infoVessel.mgo_end;
        objMailLastVoyage.currentVLSFO = infoVessel.ifo_end;
        objMailLastVoyage.consumptionActivity.ifoResumen.loading.dailyConsumptionCharter = selectUser.loadingConsumptionIFO;
        objMailLastVoyage.consumptionActivity.ifoResumen.discharge.dailyConsumptionCharter = selectUser.dischargeConsumptionIFO;
        objMailLastVoyage.consumptionActivity.ifoResumen.ballast.dailyConsumptionCharter = selectUser.sailingBallastConsumptionIFO;
        objMailLastVoyage.consumptionActivity.ifoResumen.laden.dailyConsumptionCharter = selectUser.sailingLoadConsumptionIFO;
        objMailLastVoyage.consumptionActivity.ifoResumen.economical.dailyConsumptionCharter = selectUser.sailingEconomicConsumptionIFO;
        objMailLastVoyage.consumptionActivity.ifoResumen.anchored.dailyConsumptionCharter = selectUser.anchoredConsumptionIFO;
        objMailLastVoyage.consumptionActivity.ifoResumen.maneuver.dailyConsumptionCharter = selectUser.maneuverConsumptionIFO;
        objMailLastVoyage.consumptionActivity.ifoResumen.other_act.dailyConsumptionCharter = selectUser.otherConsumptionIFO;
        objMailLastVoyage.consumptionActivity.mgoResumen.loading.dailyConsumptionCharter = selectUser.loadingConsumptionMGO;
        objMailLastVoyage.consumptionActivity.mgoResumen.discharge.dailyConsumptionCharter = selectUser.dischargeConsumptionMGO;
        objMailLastVoyage.consumptionActivity.mgoResumen.ballast.dailyConsumptionCharter = selectUser.sailingBallastConsumptionMGO;
        objMailLastVoyage.consumptionActivity.mgoResumen.laden.dailyConsumptionCharter = selectUser.sailingLoadConsumptionMGO;
        objMailLastVoyage.consumptionActivity.mgoResumen.economical.dailyConsumptionCharter = selectUser.sailingEconomicConsumptionMGO;
        objMailLastVoyage.consumptionActivity.mgoResumen.anchored.dailyConsumptionCharter = selectUser.anchoredConsumptionMGO;
        objMailLastVoyage.consumptionActivity.mgoResumen.maneuver.dailyConsumptionCharter = selectUser.maneuverConsumptionMGO;
        objMailLastVoyage.consumptionActivity.mgoResumen.other_act.dailyConsumptionCharter = selectUser.otherConsumptionMGO;
        return objMailLastVoyage;
    }
    StyleDashLegend(worksheet, posit, colum) {
        let colorYellowTransgas = 'FFCD06';
        let blueHard = '001556';
        let blueMedium = '09155694';
        let blueLow = 'b6c2ff94';
        let blueHard1 = '375f9a';
        let blueHard2 = '0040d8';
        let blueHard3 = '001556';
        let greenHard = '091556';
        let greenMedium = '';
        let greenLow = 'b6c2ff94';
        let black = '000';
        let white = 'ffffff';
        let grisFuerte = 'd4d4d4';
        let grisMedio = 'ebe8e8';
        let grisSuave = 'f3f3f3';
        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';
        let position = [posit, posit];
        let positionColumn = [colum, colum + 11];
        let posititonRow = posit;
        this.addStyleByColums(worksheet, position, positionColumn, 'LEGEND', 10, colorYellowTransgas, blueHard3);
        this.addBorder(worksheet, posit, colum, 'thick', blueHard3, '');
        posititonRow = posititonRow + 2;
        position = [posititonRow, posititonRow];
        positionColumn = [colum + 1, colum + 1];
        this.addStyleByColums(worksheet, position, positionColumn, '', 10, null, blueHard1);
        positionColumn = [colum + 3, colum + 10];
        this.addStyleByColums(worksheet, position, positionColumn, 'Data recorded by the captain', 8, black, white);
        posititonRow = posititonRow + 1;
        position = [posititonRow, posititonRow];
        positionColumn = [colum + 1, colum + 1];
        this.addStyleByColums(worksheet, position, positionColumn, '', 10, null, blueHard2);
        positionColumn = [colum + 3, colum + 10];
        this.addStyleByColums(worksheet, position, positionColumn, 'Value obtained by a formula.', 8, black, white);
        posititonRow = posititonRow + 1;
        position = [posititonRow, posititonRow];
        positionColumn = [colum + 1, colum + 1];
        this.addStyleByColums(worksheet, position, positionColumn, 0, 10, grisSuave, null);
        positionColumn = [colum + 3, colum + 10];
        this.addStyleByColums(worksheet, position, positionColumn, 'Null value', 8, black, white);
        posititonRow = posititonRow + 1;
        position = [posititonRow, posititonRow];
        positionColumn = [colum + 1, colum + 1];
        this.addStyleByColums(worksheet, position, positionColumn, '', 10, null, greenLow);
        positionColumn = [colum + 3, colum + 10];
        this.addStyleByColums(worksheet, position, positionColumn, 'Positive value', 8, black, white);
        posititonRow = posititonRow + 1;
        position = [posititonRow, posititonRow];
        positionColumn = [colum + 1, colum + 1];
        this.addStyleByColums(worksheet, position, positionColumn, '', 10, null, redLow);
        positionColumn = [colum + 3, colum + 10];
        this.addStyleByColums(worksheet, position, positionColumn, 'Negative value', 8, black, white);
        position = [posititonRow - 5, posititonRow = posititonRow + 1];
        positionColumn = [colum, colum + 11];
        this.addStyleBorder(worksheet, position, positionColumn, 'thick', blueHard3);
        let totaldeRow = 8;
        return totaldeRow;
    }
    StyleDashInfoVessel(worksheet, posit, colum, selectUser, infoVessel, posicionDelosRegistrosNormales, posicionDelosRegistrosActivitPerforment) {
        let colorYellowTransgas = 'FFCD06';
        let blueHard = '001556';
        let blueMedium = '09155694';
        let blueLow = 'b6c2ff94';
        let blueHard1 = '375f9a';
        let blueHard2 = '0040d8';
        let blueHard3 = '001556';
        let greenHard = '091556';
        let greenMedium = '';
        let greenLow = 'b6c2ff94';
        let black = '000';
        let white = 'ffffff';
        let grisFuerte = 'd4d4d4';
        let grisMedio = 'ebe8e8';
        let grisSuave = 'f3f3f3';
        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';
        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';
        let positionRow = posit;
        let positionRows = [positionRow, positionRow];
        let positionColumns = [colum, colum + 56];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'INFO VESSEL', 20, colorYellowTransgas, blueHard3);
        this.addBorder(worksheet, positionRow, colum, 'thick', blueHard3, '');
        positionRow += 1;
        positionRows = [positionRow, positionRow + 15];
        this.addStyleBorder(worksheet, positionRows, positionColumns, 'thick', blueHard3);
        positionRow += 1;
        positionRow += 1;
        positionRows = positionRow;
        let positionColumn = colum;
        let tamanioBuque = this.StyleDashBuque(worksheet, positionRows, positionColumn, selectUser, infoVessel, posicionDelosRegistrosNormales);
        positionColumn = colum + 19;
        let tamanioSpeed = this.StyleDashSpeed(worksheet, positionRows, positionColumn, selectUser, 'IFO', posicionDelosRegistrosActivitPerforment);
        positionColumn = colum + 27;
        let tamanioActivity = this.StyleDashActivity(worksheet, positionRows, positionColumn, selectUser, 'IFO', posicionDelosRegistrosActivitPerforment);
        positionColumn = colum + 40;
        let tamanioSpeedMGO = this.StyleDashSpeed(worksheet, positionRows, positionColumn, selectUser, 'MGO', posicionDelosRegistrosActivitPerforment);
        positionColumn = colum + 48;
        let tamanioActivityMGO = this.StyleDashActivity(worksheet, positionRows, positionColumn, selectUser, 'MGO', posicionDelosRegistrosActivitPerforment);
        positionRow += 2;
        positionRow = tamanioBuque;
        positionRow += 2;
        return positionRow - posit;
    }
    StyleDashBuque(worksheet, posit, colum, selectUser, infoVessel, posicionDelosRegistrosNormales) {
        let date_start = infoVessel.date_start;
        let hour_start = infoVessel.hour_start;
        let ifo_start = infoVessel.ifo_start;
        let mgo_start = infoVessel.mgo_start;
        let date_end = infoVessel.date_end;
        let hour_end = infoVessel.hour_end;
        let ifo_end = infoVessel.ifo_end;
        let mgo_end = infoVessel.mgo_end;
        let totalBunkeringIFO = 0;
        let totalBunkeringMGO = 0;
        let totalConsumptIFO = 0;
        let totalConsumptMGO = 0;
        let startRowReport = posicionDelosRegistrosNormales.startRow;
        let endRowReport = posicionDelosRegistrosNormales.endRow;
        let colorYellowTransgas = 'FFCD06';
        let blueHard = '001556';
        let blueMedium = '09155694';
        let blueLow = 'b6c2ff94';
        let blueHard1 = '375f9a';
        let blueHard2 = '0040d8';
        let blueHard3 = '001556';
        let greenHard = '091556';
        let greenMedium = '';
        let greenLow = 'b6c2ff94';
        let black = '000000';
        let white = 'ffffff';
        let grisFuerte = 'd4d4d4';
        let grisMedio = 'ebe8e8';
        let grisSuave = 'f3f3f3';
        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';
        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';
        let positionRows = [posit, posit];
        colum += 1;
        positionRows = [posit, posit];
        let positionColumns = [colum, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.name, 15, black, white);
        this.addBorder(worksheet, posit, colum, 'thick', blueHard3, '');
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, textIFOorVLSFOorLSFO, 8, white, blueHard2, '');
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'MGO', 8, white, blueHard2, '');
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'START DATE', 8, black, white, '');
        positionColumns = [colum + 5, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, moment_assets_1.ConvertDateUTC_To_FORMAT_UTC)(date_start) + ' GMT', 8, black, white, '');
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, ifo_start, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, mgo_start, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 14, colum + 15];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'TIME', 8, white, blueHard1, '');
        posit += 1;
        positionRows = [posit, posit + 6];
        positionColumns = [colum, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'CONSUMPTION', 8, black, white, '');
        positionRows = [posit, posit];
        positionColumns = [colum + 7, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('LOADING').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($BT$' + startRowReport + ':$BT$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 14, colum + 15];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum + 7, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('DOWNLOADING').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($BT$' + startRowReport + ':$BT$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 14, colum + 15];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum + 7, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('SAILING_IN_BALLAST').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($BT$' + startRowReport + ':$BT$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 14, colum + 15];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum + 7, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('SAILING_WITH_LADEN').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($BT$' + startRowReport + ':$BT$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 14, colum + 15];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum + 7, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('ANCHORED').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($BT$' + startRowReport + ':$BT$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 14, colum + 15];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum + 7, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('MANEUVER').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($BT$' + startRowReport + ':$BT$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 14, colum + 15];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum + 7, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('OTHER_ACT').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($AZ$' + startRowReport + ':$AZ$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($BT$' + startRowReport + ':$BT$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 14, colum + 15];
        this.addStyleByColums(worksheet, positionRows, positionColumns, {
            formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport +
                ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum + 7) + posit
                + ')'
        }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'Total Consumption'.toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUM(AR' + posicionDelosRegistrosNormales.startRow + ':AY' + posicionDelosRegistrosNormales.endRow + ')' }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUM(BH' + posicionDelosRegistrosNormales.startRow + ':BS' + posicionDelosRegistrosNormales.endRow + ')' }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'Total Bunkering'.toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUM(BD' + posicionDelosRegistrosNormales.startRow + ':BD' + posicionDelosRegistrosNormales.endRow + ')' }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUM(BX' + posicionDelosRegistrosNormales.startRow + ':BX' + posicionDelosRegistrosNormales.endRow + ')' }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'Lubricant Consumption'.toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 10, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'END DATE', 8, black, white, '');
        positionColumns = [colum + 5, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, moment_assets_1.ConvertDateUTC_To_FORMAT_UTC)(date_end) + ' GMT', 8, black, white, '');
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: this.PositByCell(positionColumns[0]) + (posit - 11) + '-' + this.PositByCell(positionColumns[0]) + (posit - 3) + '+' + this.PositByCell(positionColumns[0]) + (posit - 2) }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: this.PositByCell(positionColumns[0]) + (posit - 11) + '-' + this.PositByCell(positionColumns[0]) + (posit - 3) + '+' + this.PositByCell(positionColumns[0]) + (posit - 2) }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum, colum + 13];
        positionRows = [posit - 11, posit - 11];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, true, true, true);
        positionColumns = [colum, colum + 15];
        positionRows = [posit - 10, posit - 10];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, true, true, true);
        positionRows = [posit - 9, posit - 9];
        positionColumns = [colum + 6, colum + 15];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, true, true, true);
        positionRows = [posit - 8, posit - 8];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, true, true, true);
        positionRows = [posit - 7, posit - 7];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, true, true, true);
        positionRows = [posit - 6, posit - 6];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, true, true, true);
        positionRows = [posit - 5, posit - 5];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, true, true, true);
        positionRows = [posit - 4, posit - 4];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, true, true, true);
        positionColumns = [colum, colum + 13];
        positionRows = [posit - 3, posit - 3];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, true, true, true);
        positionRows = [posit - 2, posit - 2];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, true, true, true);
        positionRows = [posit - 1, posit - 1];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, true, true, true);
        positionRows = [posit, posit];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, true, true, true);
        positionColumns = [colum - 1, colum - 1];
        positionRows = [posit - 11, posit];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, true, false, false);
        positionColumns = [colum, colum + 13];
        positionRows = [posit + 1, posit + 1];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, true, false, false, false);
        positionColumns = [colum + 14, colum + 15];
        positionRows = [posit - 3, posit - 3];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, true, false, false, false);
        positionColumns = [colum + 14, colum + 14];
        positionRows = [posit - 3, posit];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, true);
        positionColumns = [colum + 15, colum + 15];
        positionRows = [posit - 11, posit - 4];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, true, false, false);
        positionColumns = [colum + 4, colum + 9];
        positionRows = [posit - 12, posit - 12];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, true, false);
        return posit;
    }
    StyleDashSpeed(worksheet, posit, colum, selectUser, isIFOorMGO, posicionDelosRegistrosActivitPerforment) {
        let colorYellowTransgas = 'FFCD06';
        let blueHard2 = '0040d8';
        let blueHard3 = '001556';
        let greenHard = '';
        let greenMedium = 'b6c2ff94';
        let greenLow = 'b6c2ff94';
        let black = '000';
        let white = 'ffffff';
        let grisFuerte = 'd4d4d4';
        let grisMedio = 'ebe8e8';
        let grisSuave = 'f3f3f3';
        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';
        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';
        let positionRows = [posit, posit];
        let positionColumns = [colum, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? textIFOorVLSFOorLSFO : 'MGO', 10, colorYellowTransgas, blueHard3, '');
        posit += 1;
        positionRows = [posit, posit + 1];
        positionColumns = [colum, colum + 1];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'SPEED', 10, colorYellowTransgas, blueHard3, '');
        positionRows = [posit, posit];
        positionColumns = [colum + 2, colum + 3];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'CHARTER', 8, white, blueHard3, '');
        positionColumns = [colum + 4, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'PERFORMEND', 8, white, blueHard2, '');
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum + 2, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'FULL', 8, white, blueHard3, '');
        positionColumns = [colum + 3, colum + 3];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'ECO', 8, white, blueHard3, '');
        positionColumns = [colum + 4, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'FULL', 8, white, blueHard2, '');
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'ECO', 8, white, blueHard2, '');
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 1];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('BALLAST').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 2, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingBallastIFO : selectUser.contractSpeedSailingBallastMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 3, colum + 3];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingEconomicalIFO : selectUser.contractSpeedSailingEconomicalMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 4, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: isIFOorMGO == 'IFO' ? 'Q' + (posicionDelosRegistrosActivitPerforment.startRow + 2) : 'BE' + (posicionDelosRegistrosActivitPerforment.startRow + 2) }, 8, black, white, '');
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 1];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('LADEN').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 2, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingLadenIFO : selectUser.contractSpeedSailingLadenMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 3, colum + 3];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingEconomicalIFO : selectUser.contractSpeedSailingEconomicalMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 4, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: isIFOorMGO == 'IFO' ? 'Q' + (posicionDelosRegistrosActivitPerforment.startRow + 3) : 'BE' + (posicionDelosRegistrosActivitPerforment.startRow + 3) }, 8, black, white, '');
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(colum + 4) + positionRows[0],
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionRows = [posit - 1, posit - 1];
        positionColumns = [colum, colum + 3];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, true);
        positionColumns = [colum + 4, colum + 5];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard2, false, false, true, true);
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 3];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, true);
        positionColumns = [colum + 4, colum + 5];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard2, false, false, true, true);
        positionColumns = [colum, colum + 3];
        positionRows = [posit - 3, posit];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false);
        positionColumns = [colum + 4, colum + 5];
        positionRows = [posit - 3, posit];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard2, false, false, false, false);
        return posit;
    }
    StyleDashActivity(worksheet, posit, colum, selectUser, isIFOorMGO, posicionDelosRegistrosActivitPerforment) {
        let colorYellowTransgas = 'FFCD06';
        let blueHard2 = '0040d8';
        let blueHard3 = '001556';
        let greenMedium = 'b6c2ff94';
        let black = '000';
        let white = 'ffffff';
        let grisMedio = 'ebe8e8';
        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';
        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';
        let positionRows = [posit, posit];
        let positionColumns = [colum, colum + 7];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? textIFOorVLSFOorLSFO : 'MGO', 10, colorYellowTransgas, blueHard3, '');
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 7];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'DAILY CONSUMPTION', 10, colorYellowTransgas, blueHard3, '');
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, '', 10, colorYellowTransgas, blueHard3, '');
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'CHARTER', 8, white, blueHard3, '');
        positionColumns = [colum + 5, colum + 7];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'PERFORMEND', 8, white, blueHard2, '');
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('LOADING').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.loadingConsumptionIFO : selectUser.loadingConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 5, colum + 7];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: isIFOorMGO == 'IFO' ? 'Z' + (posicionDelosRegistrosActivitPerforment.startRow) : 'BN' + (posicionDelosRegistrosActivitPerforment.startRow) }, 8, black, white, '');
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('DOWNLOADING').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.dischargeConsumptionIFO : selectUser.dischargeConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 5, colum + 7];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: (isIFOorMGO == 'IFO' ? 'Z' : 'BN') + (posicionDelosRegistrosActivitPerforment.startRow + 1) }, 8, black, white, '');
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('BALLAST').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.sailingBallastConsumptionIFO : selectUser.sailingBallastConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 5, colum + 7];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: (isIFOorMGO == 'IFO' ? 'Z' : 'BN') + (posicionDelosRegistrosActivitPerforment.startRow + 2) }, 8, black, white, '');
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('LADEN').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.sailingLoadConsumptionIFO : selectUser.sailingLoadConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 5, colum + 7];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: (isIFOorMGO == 'IFO' ? 'Z' : 'BN') + (posicionDelosRegistrosActivitPerforment.startRow + 3) }, 8, black, white, '');
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('ECONOMICAL').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.sailingEconomicConsumptionIFO : selectUser.sailingEconomicConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 5, colum + 7];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: (isIFOorMGO == 'IFO' ? 'Z' : 'BN') + (posicionDelosRegistrosActivitPerforment.startRow + 4) }, 8, black, white, '');
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('ANCHORED').toUpperCase(), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.anchoredConsumptionIFO : selectUser.anchoredConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 5, colum + 7];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: (isIFOorMGO == 'IFO' ? 'Z' : 'BN') + (posicionDelosRegistrosActivitPerforment.startRow + 5) }, 8, black, white, '');
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('MANEUVER').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.maneuverConsumptionIFO : selectUser.maneuverConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 5, colum + 7];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: (isIFOorMGO == 'IFO' ? 'Z' : 'BN') + (posicionDelosRegistrosActivitPerforment.startRow + 6) }, 8, black, white, '');
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        posit += 1;
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('OTHER').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.otherConsumptionIFO : selectUser.otherConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionColumns = [colum + 5, colum + 7];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: (isIFOorMGO == 'IFO' ? 'Z' : 'BN') + (posicionDelosRegistrosActivitPerforment.startRow + 7) }, 8, black, white, '');
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        this.RuleFormatCeroGris(worksheet, posit, positionColumns[0]);
        positionRows = [posit - 8, posit];
        positionColumns = [colum, colum];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionColumns = [colum + 3, colum + 3];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionColumns = [colum + 5, colum + 5];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionColumns = [colum, colum + 6];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false);
        return posit;
    }
    StyleDashCosumption(worksheet, posit, colum, selectUser, isIFOorMGO, posicionDelosRegistrosNormales) {
        let colorYellowTransgas = 'FFCD06';
        let blueHard1 = '375f9a';
        let blueHard2 = '0040d8';
        let blueHard3 = '001556';
        let white = 'ffffff';
        let black = '000';
        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';
        let positionRow = posit;
        let positionRows = [positionRow, positionRow];
        let positionColumns = [colum, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'VESSEL PERFORMANCE ' + (isIFOorMGO == 'IFO' ? textIFOorVLSFOorLSFO : 'MGO'), 20, colorYellowTransgas, blueHard3, '');
        let startRowReport = posicionDelosRegistrosNormales.startRow;
        let endRowReport = posicionDelosRegistrosNormales.endRow;
        positionRow += 1;
        positionRows = [positionRow, positionRow + 1];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'ACTIVITY\nPERFORMED', 8, white, blueHard1, '');
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'TOTAL TIME\nPER ACTIVITY\n(HRS)', 8, white, blueHard1, '');
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'TOTAL DISTANCE (MILES)', 8, white, blueHard1, '');
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'AVERAGE SPEED\n(MILES/HRS)', 8, white, blueHard2, '');
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'AVERAGE SPEED\n(MILES/HRS)\n(CHARTER)', 8, white, blueHard3, '');
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'TOTAL CONSUMPTION\n(MT)', 8, white, blueHard1, '');
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'DAILY CONSUMPTION\n(MT)', 8, white, blueHard2, '');
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'DAILY CONSUMPTION\n(MT) (CHARTER)', 8, white, blueHard3, '');
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'SAILING TIME\n(HRS) (CHARTER)', 8, white, blueHard3, '');
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'TOTAL CONSUMPTION\n(MT) (CHARTER)', 8, white, blueHard3, '');
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'BALANCE CONSUMPTION\n(MT)', 8, white, blueHard2, '');
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'BALANCE TIME\n(HRS)', 8, white, blueHard2, '');
        positionRow += 2;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('LOADING').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME');
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED');
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + '' : '$BT$' + startRowReport + ':$BT$' + endRowReport + '') + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION');
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION');
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.loadingConsumptionIFO : selectUser.loadingConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + '),0,' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + +positionRow + '=0, ' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 24) + +positionRow + '/24)', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + +positionRow, result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION');
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME');
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('DOWNLOADING').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME');
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED');
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + '' : '$BT$' + startRowReport + ':$BT$' + endRowReport + '') + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION');
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION');
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.dischargeConsumptionIFO : selectUser.dischargeConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + '),0,' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + +positionRow + '=0, ' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 24) + +positionRow + '/24)', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + +positionRow, result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION');
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME');
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('BALLAST').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME');
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED');
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingBallastIFO : selectUser.contractSpeedSailingBallastMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 15, colum + 17];
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION');
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + '' : '$BT$' + startRowReport + ':$BT$' + endRowReport + '') + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION');
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.sailingBallastConsumptionIFO : selectUser.sailingBallastConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + '),0,' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + +positionRow + '=0, ' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 24) + +positionRow + '/24)', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + +positionRow, result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION');
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 3) + positionRow + '-' + this.PositByCell(colum + 24) + +positionRow, result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME');
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('LADEN').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME');
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED');
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingLadenIFO : selectUser.contractSpeedSailingLadenMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + '' : '$BT$' + startRowReport + ':$BT$' + endRowReport + '') + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION');
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION');
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.sailingLoadConsumptionIFO : selectUser.sailingLoadConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + '),0,' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + +positionRow + '=0, ' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 24) + +positionRow + '/24)', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + +positionRow, result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION');
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 3) + positionRow + '-' + this.PositByCell(colum + 24) + +positionRow, result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME');
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('ECONOMICAL').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME');
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED');
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingEconomicalIFO : selectUser.contractSpeedSailingEconomicalMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + '' : '$BT$' + startRowReport + ':$BT$' + endRowReport + '') + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION');
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION');
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.sailingEconomicConsumptionIFO : selectUser.sailingEconomicConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + '),0,' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + +positionRow + '=0, ' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 24) + +positionRow + '/24)', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + +positionRow, result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION');
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 3) + positionRow + '-' + this.PositByCell(colum + 24) + +positionRow, result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME');
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('ANCHORED').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME');
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED');
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + '' : '$BT$' + startRowReport + ':$BT$' + endRowReport + '') + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION');
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION');
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(Number(isIFOorMGO == 'IFO' ? selectUser.anchoredConsumptionIFO : selectUser.anchoredConsumptionMGO)), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + '),0,' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + +positionRow + '=0, ' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 24) + +positionRow + '/24)', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + +positionRow, result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION');
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME');
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('MANEUVER').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME');
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED');
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + '' : '$BT$' + startRowReport + ':$BT$' + endRowReport + '') + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION');
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION');
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.maneuverConsumptionIFO : selectUser.maneuverConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + '),0,' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + +positionRow + '=0, ' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 24) + +positionRow + '/24)', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + +positionRow, result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION');
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME');
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, (0, translate_assets_1.translateActivity)('OTHER_ACT').toUpperCase(), 8, black, white, '');
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME');
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$' + endRowReport + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED');
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + '' : '$BT$' + startRowReport + ':$BT$' + endRowReport + '') + ',$W$' + startRowReport + ':$W$' + endRowReport + ',' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$' + endRowReport + ',">0"' : '$BT$' + startRowReport + ':$BT$' + endRowReport + ',">0"') + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION');
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION');
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, Number(isIFOorMGO == 'IFO' ? selectUser.otherConsumptionIFO : selectUser.otherConsumptionMGO), 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + '),0,' + this.PositByCell(colum + 6) + +positionRow + '/' + this.PositByCell(colum + 12) + +positionRow + ')', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + +positionRow + '=0, ' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + +positionRow + '*' + this.PositByCell(colum + 24) + +positionRow + '/24)', result: 0.14 }, 8, black, white, '');
        this.RuleFormatCeroGris(worksheet, positionRows[0], positionColumns[0]);
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + +positionRow, result: 0.14 }, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION');
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, black, white, '');
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME');
        positionRows = [posit + 2, posit + 10];
        positionColumns = [colum, colum + 2];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionRows = [posit + 2, posit + 10];
        positionColumns = [colum + 3, colum + 5];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionRows = [posit + 2, posit + 10];
        positionColumns = [colum + 6, colum + 8];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionRows = [posit + 2, posit + 10];
        positionColumns = [colum + 9, colum + 11];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionRows = [posit + 2, posit + 10];
        positionColumns = [colum + 12, colum + 14];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionColumns = [colum + 15, colum + 18];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionColumns = [colum + 19, colum + 21];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionColumns = [colum + 22, colum + 24];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionColumns = [colum + 25, colum + 27];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionColumns = [colum + 28, colum + 30];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionColumns = [colum + 31, colum + 33];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionColumns = [colum + 34, colum + 35];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false);
        positionRows = [posit, positionRow];
        positionColumns = [colum, colum + 35];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false);
        return positionRow - posit + 1;
    }
    AddInfoByPortAccordingToTheTravelreport(workbook, posit, columReset, selectUser, listGetReportVoyagePortDaily, getInfoFuelStartEndByFilterDate) {
        let colorYellowTransgas = 'FFCD06';
        let blueHard1 = '375f9a';
        let blueHard2 = '0040d8';
        let blueHard3 = '001556';
        let white = 'ffffff';
        let black = '000000';
        let grisSuave = 'f3f3f3';
        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';
        let worksheetPuerto;
        let puertoActual = new port_entity_1.Port();
        let positionRow = posit;
        let colum = columReset;
        let positionRows = [positionRow, positionRow];
        let positionColumns = [colum, colum];
        let numeroDePuerto = 0;
        let itemReportBefore;
        let existeUnValorAnterior = false;
        let contadorDeItemPorPuerto = 0;
        let refreshFecha = {
            row: 0,
            colum: 0
        };
        let firshRow = 0;
        let lastRow = 0;
        let firstROB = {
            IFO: getInfoFuelStartEndByFilterDate.infoFuelStart.total_ifo,
            MGO: getInfoFuelStartEndByFilterDate.infoFuelStart.total_mgo,
        };
        let lastROB = {
            IFO: firstROB.IFO,
            MGO: firstROB.MGO
        };
        let itemDelRegistro = [];
        itemReportBefore = listGetReportVoyagePortDaily[0];
        listGetReportVoyagePortDaily.forEach((getReportVoyagePortDaily, index) => {
            let primerNuevoPuerto = puertoActual.id != getReportVoyagePortDaily.portId;
            if (primerNuevoPuerto) {
                if (index > 0) {
                    this.cuadroResumentotal(contadorDeItemPorPuerto, positionRow, columReset, worksheetPuerto, lastRow, firstROB, lastROB, firshRow);
                    firstROB.IFO = lastROB.IFO;
                    firstROB.MGO = lastROB.MGO;
                    itemDelRegistro = [];
                }
                numeroDePuerto++;
                puertoActual.id = getReportVoyagePortDaily.portId;
                positionRow = posit;
                puertoActual.departurePort = getReportVoyagePortDaily.departurePort;
                puertoActual.arrivalPort = getReportVoyagePortDaily.arrivalPort;
                contadorDeItemPorPuerto = 0;
                worksheetPuerto = workbook.addWorksheet("Port N°" + numeroDePuerto + ' - ' + puertoActual.arrivalPort);
                positionRow += 1;
                positionRows = [positionRow, positionRow];
                positionColumns = [columReset, columReset + 21];
                this.ResetColumn(worksheetPuerto);
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'NAVIGATION DATA', 20, colorYellowTransgas, blueHard3, '');
                colum = columReset + 1;
                positionRow += 2;
                positionRows = [positionRow, positionRow];
                positionColumns = [colum, colum + 3];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'SAILING FROM :', 8, black, white, '');
                colum += 4;
                positionColumns = [colum, colum + 6];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, getReportVoyagePortDaily.departurePort, 8, black, white, '');
                colum += 7;
                positionRows = [positionRow, positionRow];
                positionColumns = [colum, colum + 2];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'DATE :', 8, black, white, '');
                colum += 3;
                positionColumns = [colum, colum + 5];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, (0, moment_assets_1.ConvertDateUTC_To_FORMAT_UTC)(itemReportBefore.date) + " GMT", 8, black, white, '');
                positionRow += 1;
                colum = columReset + 1;
                positionRows = [positionRow, positionRow];
                positionColumns = [colum, colum + 3];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'ARRIVE TO :', 8, black, white, '');
                colum += 4;
                positionColumns = [colum, colum + 6];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, getReportVoyagePortDaily.arrivalPort, 8, black, white, '');
                colum += 7;
                positionRows = [positionRow, positionRow];
                positionColumns = [colum, colum + 2];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'DATE :', 8, black, white, '');
                colum += 3;
                positionColumns = [colum, colum + 5];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, " -- CAMBIAR VALOR 1 --", 8, black, white, '');
                refreshFecha = {
                    row: positionRow,
                    colum: colum
                };
                positionRow += 2;
                colum = columReset + 1;
                positionRows = [positionRow, positionRow];
                positionColumns = [colum, colum + 4];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'DATE UTC:', 8, black, white, '');
                worksheetPuerto.getCell(this.PositByCell(colum) + positionRow).style = {
                    alignment: {
                        horizontal: 'center',
                        vertical: 'middle'
                    },
                    font: {
                        size: 8,
                        bold: true,
                        color: { argb: white },
                    },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: blueHard1
                        }
                    },
                    border: {
                        top: { style: 'thin', color: { argb: grisSuave } },
                        left: { style: 'thin', color: { argb: grisSuave } },
                        bottom: { style: 'thin', color: { argb: grisSuave } },
                        right: { style: 'thin', color: { argb: grisSuave } }
                    }
                };
                colum += 5;
                positionColumns = [colum, colum + 5];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'POSITION / ACTIVITY', 8, black, white, '');
                worksheetPuerto.getCell(this.PositByCell(colum) + positionRow).style = {
                    alignment: {
                        horizontal: 'center',
                        vertical: 'middle'
                    },
                    font: {
                        size: 8,
                        bold: true,
                        color: { argb: white },
                    },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: blueHard1
                        }
                    },
                    border: {
                        top: { style: 'thin', color: { argb: grisSuave } },
                        left: { style: 'thin', color: { argb: grisSuave } },
                        bottom: { style: 'thin', color: { argb: grisSuave } },
                        right: { style: 'thin', color: { argb: grisSuave } }
                    }
                };
                colum += 6;
                positionColumns = [colum, colum + 2];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'HOURS SAILED', 8, black, white, '');
                worksheetPuerto.getCell(this.PositByCell(colum) + positionRow).style = {
                    alignment: {
                        horizontal: 'center',
                        vertical: 'middle'
                    },
                    font: {
                        size: 8,
                        bold: true,
                        color: { argb: white },
                    },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: blueHard2
                        }
                    },
                    border: {
                        top: { style: 'thin', color: { argb: grisSuave } },
                        left: { style: 'thin', color: { argb: grisSuave } },
                        bottom: { style: 'thin', color: { argb: grisSuave } },
                        right: { style: 'thin', color: { argb: grisSuave } }
                    }
                };
                colum += 3;
                positionColumns = [colum, colum + 1];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'DISTANCE', 8, black, white, '');
                worksheetPuerto.getCell(this.PositByCell(colum) + positionRow).style = {
                    alignment: {
                        horizontal: 'center',
                        vertical: 'middle'
                    },
                    font: {
                        size: 8,
                        bold: true,
                        color: { argb: white },
                    },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: blueHard1
                        }
                    },
                    border: {
                        top: { style: 'thin', color: { argb: grisSuave } },
                        left: { style: 'thin', color: { argb: grisSuave } },
                        bottom: { style: 'thin', color: { argb: grisSuave } },
                        right: { style: 'thin', color: { argb: grisSuave } }
                    }
                };
                colum += 2;
                positionColumns = [colum, colum + 1];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'SPEED', 8, black, white, '');
                worksheetPuerto.getCell(this.PositByCell(colum) + positionRow).style = {
                    alignment: {
                        horizontal: 'center',
                        vertical: 'middle'
                    },
                    font: {
                        size: 8,
                        bold: true,
                        color: { argb: white },
                    },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: blueHard1
                        }
                    },
                    border: {
                        top: { style: 'thin', color: { argb: grisSuave } },
                        left: { style: 'thin', color: { argb: grisSuave } },
                        bottom: { style: 'thin', color: { argb: grisSuave } },
                        right: { style: 'thin', color: { argb: grisSuave } }
                    }
                };
                colum += 2;
                positionColumns = [colum, colum + 1];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'BEAUFORT', 8, black, white, '');
                worksheetPuerto.getCell(this.PositByCell(colum) + positionRow).style = {
                    alignment: {
                        horizontal: 'center',
                        vertical: 'middle'
                    },
                    font: {
                        size: 8,
                        bold: true,
                        color: { argb: white },
                    },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: blueHard1
                        }
                    },
                    border: {
                        top: { style: 'thin', color: { argb: grisSuave } },
                        left: { style: 'thin', color: { argb: grisSuave } },
                        bottom: { style: 'thin', color: { argb: grisSuave } },
                        right: { style: 'thin', color: { argb: grisSuave } }
                    }
                };
                itemReportBefore = getReportVoyagePortDaily;
                existeUnValorAnterior = !itemReportBefore ? false : true;
                contadorDeItemPorPuerto++;
                firshRow = positionRow + 1;
            }
            if (getReportVoyagePortDaily.typeActivityPerformed == 'REPORT_AT_08_00'
                || getReportVoyagePortDaily.distance > 0
                || getReportVoyagePortDaily.activityPerformed == 'SAILING_IN_BALLAST'
                || getReportVoyagePortDaily.activityPerformed == 'SAILING_WITH_LADEN') {
                positionRow += 1;
                colum = columReset + 1;
                positionRows = [positionRow, positionRow];
                positionColumns = [colum, colum + 4];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, (0, moment_assets_1.ConvertDateUTC_To_FORMAT_UTC)(getReportVoyagePortDaily.date), 8, black, white, '');
                this.addBorder(worksheetPuerto, positionRow, colum, 'thin', blueHard3, '');
                colum += 5;
                positionColumns = [colum, colum + 5];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, getReportVoyagePortDaily.typeActivityPerformed == 'REPORT_AT_08_00' ?
                    getReportVoyagePortDaily.north_degree + 'º' + getReportVoyagePortDaily.north_minutes + "'" + getReportVoyagePortDaily.north_north_south + " / " + getReportVoyagePortDaily.east_degree + 'º' + getReportVoyagePortDaily.east_minutes + "'" + getReportVoyagePortDaily.east_east_west :
                    (0, translate_assets_1.translateActivity)(getReportVoyagePortDaily.activityPerformed), 8, black, white, '');
                this.addBorder(worksheetPuerto, positionRow, colum, 'thin', blueHard3, '');
                colum += 6;
                positionColumns = [colum, colum + 2];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, getReportVoyagePortDaily.distance ? getReportVoyagePortDaily.steamingTime : '', 8, black, white, '');
                this.addBorder(worksheetPuerto, positionRow, colum, 'thin', blueHard3, '');
                this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
                colum += 3;
                positionColumns = [colum, colum + 1];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, getReportVoyagePortDaily.distance ? getReportVoyagePortDaily.distance : '', 8, black, white, '');
                this.addBorder(worksheetPuerto, positionRow, colum, 'thin', blueHard3, '');
                this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
                colum += 2;
                positionColumns = [colum, colum + 1];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, getReportVoyagePortDaily.distance ? { formula: this.PositByCell(colum - 2) + positionRow + '/' + this.PositByCell(colum - 5) + positionRow } : '', 8, black, white, '');
                this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
                this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
                colum += 2;
                positionColumns = [colum, colum + 1];
                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, getReportVoyagePortDaily.beaufour, 8, black, white, '');
                this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
                lastRow = positionRow;
            }
            worksheetPuerto.getCell(this.PositByCell(refreshFecha.colum) + refreshFecha.row).value = (0, moment_assets_1.ConvertDateUTC_To_FORMAT_UTC)(getReportVoyagePortDaily.date) + ' GMT';
            itemReportBefore = getReportVoyagePortDaily;
            existeUnValorAnterior = !itemReportBefore ? false : true;
            contadorDeItemPorPuerto++;
            lastROB.IFO = (lastROB.IFO - this.SumaIfo(getReportVoyagePortDaily)) + getReportVoyagePortDaily.bunkeringIfo;
            lastROB.MGO = (lastROB.MGO - this.SumaMgo(getReportVoyagePortDaily)) + getReportVoyagePortDaily.bunkeringMgo;
            if (index == (listGetReportVoyagePortDaily.length - 1)) {
                this.cuadroResumentotal(contadorDeItemPorPuerto, positionRow, columReset, worksheetPuerto, lastRow, firstROB, lastROB, firshRow);
            }
            itemDelRegistro.push(getReportVoyagePortDaily);
        });
        return positionRow - posit;
    }
    cuadroResumentotal(contadorDeItemPorPuerto, positionRow, columReset, worksheetPuerto, lastRow, firstROB, lastROB, firshRow) {
        contadorDeItemPorPuerto++;
        positionRow += 1;
        let colum = columReset + 1;
        let positionRows = [positionRow, positionRow];
        let positionColumns = [colum, colum + 10];
        let colorYellowTransgas = 'FFCD06';
        let blueHard = '001556';
        let blueMedium = '09155694';
        let blueLow = 'b6c2ff94';
        let blueHard1 = '375f9a';
        let blueHard2 = '0040d8';
        let blueHard3 = '001556';
        let greenHard = '091556';
        let greenMedium = '09155694';
        let greenLow = 'b6c2ff94';
        let black = '000000';
        let white = 'ffffff';
        let grisFuerte = 'd4d4d4';
        let grisMedio = 'ebe8e8';
        let grisSuave = 'f3f3f3';
        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'TOTAL', 8, black, white, '');
        worksheetPuerto.getCell(this.PositByCell(colum) + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        colum += 11;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, { formula: 'SUM(' + this.PositByCell(colum) + (firshRow) + ':' + this.PositByCell(colum) + (lastRow) + ')' }, 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        colum += 3;
        positionColumns = [colum, colum + 1];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, { formula: 'SUM(' + this.PositByCell(colum) + (firshRow) + ':' + this.PositByCell(colum) + (lastRow) + ')' }, 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        colum += 2;
        positionColumns = [colum, colum + 1];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, { formula: this.PositByCell(colum - 2) + positionRow + '/' + this.PositByCell(colum - 5) + positionRow }, 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        colum = columReset + 1;
        positionColumns = [colum, colum + 7];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'DAYS SAIL:', 8, black, white, '');
        worksheetPuerto.getCell(this.PositByCell(colum) + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        colum += 8;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, { formula: "(" + this.PositByCell(colum + 3) + (positionRow - 1) + ")/24" }, 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', blueHard3, '');
        colum += 3;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'LSFO', 8, black, white, '');
        worksheetPuerto.getCell(this.PositByCell(colum) + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        colum += 3;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'MGO', 8, black, white, '');
        worksheetPuerto.getCell(this.PositByCell(colum) + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        colum += 3;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'Oil', 8, black, white, '');
        worksheetPuerto.getCell(this.PositByCell(colum) + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        positionRow += 1;
        colum = columReset + 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 10];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'BUNKERSAT THE BEGINNING OF VOYAGE:', 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        colum += 11;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, firstROB.IFO, 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        colum += 3;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, firstROB.MGO, 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        colum += 3;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '', 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        positionRow += 1;
        colum = columReset + 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 10];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'BUNKERS AT THE END OF PORT', 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        colum += 11;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, lastROB.IFO, 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        colum += 3;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, lastROB.MGO, 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        colum += 3;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '', 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        positionRow += 1;
        colum = columReset + 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 10];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'BUNKERS CONSUMED ON PORT', 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        colum += 11;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, { formula: this.PositByCell(colum) + (positionRow - 2) + '-' + this.PositByCell(colum) + (positionRow - 1) }, 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        colum += 3;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, { formula: this.PositByCell(colum) + (positionRow - 2) + '-' + this.PositByCell(colum) + (positionRow - 1) }, 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        colum += 3;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '', 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        positionRow += 1;
        colum = columReset + 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 10];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'CONSUMO PROMEDIO / DIA', 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        colum += 11;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, { formula: this.PositByCell(colum) + (positionRow - 1) + '*' + this.PositByCell(colum - 3) + (positionRow - 4) }, 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        colum += 3;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, { formula: this.PositByCell(colum) + (positionRow - 1) + '*' + this.PositByCell(colum - 6) + (positionRow - 4) }, 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        colum += 3;
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '', 8, black, white, '');
        this.addBorder(worksheetPuerto, positionRow, colum, 'thin', black, '');
        this.RuleFormatCeroGris(worksheetPuerto, positionRow, positionColumns[0]);
        positionRows = [firshRow - 6, positionRow + 1];
        positionColumns = [columReset, columReset + 21];
        this.addStyleBorder(worksheetPuerto, positionRows, positionColumns, 'thick', blueHard3);
    }
    StyleDashReportRegister(worksheet, posit, selectUser, listGetReportVoyagePortDaily, posicionDelInfoVessel) {
        let colorYellowTransgas = 'FFCD06';
        let blueHard = '001556';
        let blueMedium = '09155694';
        let blueLow = 'b6c2ff94';
        let blueHard1 = '375f9a';
        let blueHard2 = '0040d8';
        let blueHard3 = '001556';
        let greenHard = '091556';
        let greenMedium = '09155694';
        let greenLow = 'b6c2ff94';
        let black = '000000';
        let white = 'ffffff';
        let grisFuerte = 'd4d4d4';
        let grisMedio = 'ebe8e8';
        let grisSuave = 'f3f3f3';
        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';
        let positionRow = posit;
        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';
        let objMailLastVoyage = new sendMailConfig_1.MailLastVoyage();
        worksheet.getCell('AR' + positionRow).value = textIFOorVLSFOorLSFO + " CONSUMPTION IN MT";
        worksheet.getCell('AR' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 20,
                bold: true,
                color: { argb: colorYellowTransgas },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'double', color: { argb: grisSuave } },
                left: { style: 'double', color: { argb: grisSuave } },
                bottom: { style: 'double', color: { argb: grisSuave } },
                right: { style: 'double', color: { argb: grisSuave } }
            }
        };
        worksheet.mergeCells('AR' + positionRow, 'BG' + positionRow);
        worksheet.getCell('BH' + positionRow).value = "MGO CONSUMPTION IN MT";
        worksheet.getCell('BH' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 20,
                bold: true,
                color: { argb: colorYellowTransgas },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'double', color: { argb: grisSuave } },
                left: { style: 'double', color: { argb: grisSuave } },
                bottom: { style: 'double', color: { argb: grisSuave } },
                right: { style: 'double', color: { argb: grisSuave } }
            }
        };
        worksheet.mergeCells('BH' + positionRow, 'CA' + positionRow);
        positionRow += 1;
        worksheet.getCell('AJ' + positionRow).value = "NAVIGATION DATA";
        worksheet.getCell('AJ' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 15,
                bold: true,
                color: { argb: colorYellowTransgas },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'double', color: { argb: grisSuave } },
                left: { style: 'double', color: { argb: grisSuave } },
                bottom: { style: 'double', color: { argb: grisSuave } },
                right: { style: 'double', color: { argb: grisSuave } }
            }
        };
        worksheet.mergeCells('AJ' + positionRow, 'AQ' + positionRow);
        worksheet.getCell('AR' + positionRow).value = "PREVIOUS VOYAGE";
        worksheet.getCell('AR' + positionRow).style = {
            alignment: {
                horizontal: 'right',
                vertical: 'middle'
            },
            font: {
                size: 10,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.mergeCells('AR' + positionRow, 'BD' + positionRow);
        worksheet.getCell('BE' + positionRow).value = { formula: 'S' + (posicionDelInfoVessel.startRow + 4) };
        worksheet.getCell('BE' + positionRow).style = {
            alignment: {
                horizontal: 'right',
                vertical: 'middle'
            },
            font: {
                size: 18,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.mergeCells('BE' + positionRow, 'BG' + positionRow);
        worksheet.getCell('BE' + positionRow).numFmt = '0.00';
        worksheet.getCell('BH' + positionRow).value = "PREVIOUS VOYAGE";
        worksheet.getCell('BH' + positionRow).style = {
            alignment: {
                horizontal: 'right',
                vertical: 'middle'
            },
            font: {
                size: 10,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.mergeCells('BH' + positionRow, 'BX' + positionRow);
        worksheet.getCell('BY' + positionRow).value = { formula: 'U' + (posicionDelInfoVessel.startRow + 4) };
        worksheet.getCell('BY' + positionRow).style = {
            alignment: {
                horizontal: 'right',
                vertical: 'middle'
            },
            font: {
                size: 18,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.mergeCells('BY' + positionRow, 'CA' + positionRow);
        worksheet.getCell('BY' + positionRow).numFmt = '0.00';
        positionRow += 1;
        worksheet.addRow([
            'voyageId', 'portId', 'dailyReportId', '', '',
            'VOYAGE', '',
            'DEPARTURE', '', '', '',
            'ARRIVAL', '', '', '',
            'DATE UTC', '', '',
            'HOUR LOCAL', '',
            'TIME', '',
            'ACTIVITY PERFORMED', '', '', '',
            'SPEED', '',
            'OBSERVATION', '', '', '', '', '', '',
            'DISTANCE', '',
            'TIME', '',
            'SPEED', '',
            'BEAUFORT', '',
            'MPLA', '',
            'AUX', '',
            'BOILER', '',
            'OTHER', '',
            'TOTAL', '',
            'DAILY COSUMTION', '',
            'BUNKERING', '',
            'ROB', '',
            'MPLA', '',
            'AUX', '',
            'BOILER', '',
            'P.P', '',
            'G.I', '',
            'OTHER', '',
            'TOTAL', '',
            'DAILY COSUMTION', '',
            'BUNKERING', '',
            'ROB', '',
        ]);
        worksheet.getCell('F' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('H' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('L' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('P' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('S' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('U' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('W' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AA' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AC' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AJ' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AL' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AN' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AP' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AR' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AT' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AV' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AX' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AZ' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BB' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BD' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BF' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BH' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BJ' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BL' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BN' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BP' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BR' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BT' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BV' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BX' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BZ' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        this.mergeCellReport(worksheet, positionRow, false);
        listGetReportVoyagePortDaily.forEach((getReportVoyagePortDaily, index) => {
            let sumaTotalIFO = (getReportVoyagePortDaily.mplaIfo + getReportVoyagePortDaily.auxIfo + getReportVoyagePortDaily.boilerIfo + getReportVoyagePortDaily.otherIfo);
            if (sumaTotalIFO > 0) {
                if (getReportVoyagePortDaily.activityPerformed === 'LOADING') {
                    objMailLastVoyage.consumptionActivity.ifoResumen.loading.consumption += sumaTotalIFO;
                    objMailLastVoyage.consumptionActivity.ifoResumen.loading.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.activityPerformed === 'DOWNLOADING') {
                    objMailLastVoyage.consumptionActivity.ifoResumen.discharge.consumption += sumaTotalIFO;
                    objMailLastVoyage.consumptionActivity.ifoResumen.discharge.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.activityPerformed === 'SAILING_IN_BALLAST' && getReportVoyagePortDaily.speedStraction === 'FULL_SPEED') {
                    objMailLastVoyage.consumptionActivity.ifoResumen.ballast.consumption += sumaTotalIFO;
                    objMailLastVoyage.consumptionActivity.ifoResumen.ballast.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.activityPerformed === 'SAILING_WITH_LADEN' && getReportVoyagePortDaily.speedStraction === 'FULL_SPEED') {
                    objMailLastVoyage.consumptionActivity.ifoResumen.laden.consumption += sumaTotalIFO;
                    objMailLastVoyage.consumptionActivity.ifoResumen.laden.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.speedStraction === 'ECO_SPEED') {
                    objMailLastVoyage.consumptionActivity.ifoResumen.economical.consumption += sumaTotalIFO;
                    objMailLastVoyage.consumptionActivity.ifoResumen.economical.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.activityPerformed === 'ANCHORED') {
                    objMailLastVoyage.consumptionActivity.ifoResumen.anchored.consumption += sumaTotalIFO;
                    objMailLastVoyage.consumptionActivity.ifoResumen.anchored.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.activityPerformed === 'MANEUVER') {
                    objMailLastVoyage.consumptionActivity.ifoResumen.maneuver.consumption += sumaTotalIFO;
                    objMailLastVoyage.consumptionActivity.ifoResumen.maneuver.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.activityPerformed === 'OTHER_ACT') {
                    objMailLastVoyage.consumptionActivity.ifoResumen.other_act.consumption += sumaTotalIFO;
                    objMailLastVoyage.consumptionActivity.ifoResumen.other_act.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
            }
            let sumaTotalMGO = (getReportVoyagePortDaily.mplaMgo + getReportVoyagePortDaily.auxMgo + getReportVoyagePortDaily.boilerMgo + getReportVoyagePortDaily.ppMgo + getReportVoyagePortDaily.giMgo + getReportVoyagePortDaily.otherMgo);
            if (sumaTotalMGO > 0) {
                if (getReportVoyagePortDaily.activityPerformed === 'LOADING') {
                    objMailLastVoyage.consumptionActivity.mgoResumen.loading.consumption += sumaTotalMGO;
                    objMailLastVoyage.consumptionActivity.mgoResumen.loading.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.activityPerformed === 'DOWNLOADING') {
                    objMailLastVoyage.consumptionActivity.mgoResumen.discharge.consumption += sumaTotalMGO;
                    objMailLastVoyage.consumptionActivity.mgoResumen.discharge.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.activityPerformed === 'SAILING_IN_BALLAST' && getReportVoyagePortDaily.speedStraction === 'FULL_SPEED') {
                    objMailLastVoyage.consumptionActivity.mgoResumen.ballast.consumption += sumaTotalMGO;
                    objMailLastVoyage.consumptionActivity.mgoResumen.ballast.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.activityPerformed === 'SAILING_WITH_LADEN' && getReportVoyagePortDaily.speedStraction === 'FULL_SPEED') {
                    objMailLastVoyage.consumptionActivity.mgoResumen.laden.consumption += sumaTotalMGO;
                    objMailLastVoyage.consumptionActivity.mgoResumen.laden.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.speedStraction === 'ECO_SPEED') {
                    objMailLastVoyage.consumptionActivity.mgoResumen.economical.consumption += sumaTotalMGO;
                    objMailLastVoyage.consumptionActivity.mgoResumen.economical.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.activityPerformed === 'ANCHORED') {
                    objMailLastVoyage.consumptionActivity.mgoResumen.anchored.consumption += sumaTotalMGO;
                    objMailLastVoyage.consumptionActivity.mgoResumen.anchored.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.activityPerformed === 'MANEUVER') {
                    objMailLastVoyage.consumptionActivity.mgoResumen.maneuver.consumption += sumaTotalMGO;
                    objMailLastVoyage.consumptionActivity.mgoResumen.maneuver.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
                else if (getReportVoyagePortDaily.activityPerformed === 'OTHER_ACT') {
                    objMailLastVoyage.consumptionActivity.mgoResumen.other_act.consumption += sumaTotalMGO;
                    objMailLastVoyage.consumptionActivity.mgoResumen.other_act.timeActivity += getReportVoyagePortDaily.steamingTime;
                }
            }
            if (getReportVoyagePortDaily.bunkeringIfo > 0) {
                objMailLastVoyage.bunkeringIFO += getReportVoyagePortDaily.bunkeringIfo;
            }
            if (getReportVoyagePortDaily.bunkeringMgo > 0) {
                objMailLastVoyage.bunkeringMGO += getReportVoyagePortDaily.bunkeringMgo;
            }
            positionRow += 1;
            let dataRow = [
                getReportVoyagePortDaily.voyageId,
                getReportVoyagePortDaily.portId,
                getReportVoyagePortDaily.dailyReportId,
                '', { formula: 'AND( AI' + positionRow + ' <12, AI' + positionRow + ' > 0 )' },
                'V' + getReportVoyagePortDaily.voyageNumber + '-' + getReportVoyagePortDaily.year, '',
                getReportVoyagePortDaily.departurePort, '', '', '',
                getReportVoyagePortDaily.arrivalPort, '', '', '',
                (0, moment_assets_1.ConvertDateUTC_To_FORMAT_UTC)(getReportVoyagePortDaily.date), '', '',
                getReportVoyagePortDaily.hour, '',
                getReportVoyagePortDaily.steamingTime, '',
                (0, translate_assets_1.translateActivity)(getReportVoyagePortDaily.activityPerformed), '', '', '',
                getReportVoyagePortDaily.speedStraction, '',
                getReportVoyagePortDaily.observation, '', '', '', '', '', '',
                getReportVoyagePortDaily.distance, '',
                { formula: '(P' + positionRow + ' - P' + (positionRow - 1) + ')*24' }, '',
                { formula: 'IF(ISERROR(AJ' + positionRow + '/AL' + positionRow + '),0,AJ' + positionRow + '/AL' + positionRow + ')' }, '',
                getReportVoyagePortDaily.beaufour, '',
                getReportVoyagePortDaily.mplaIfo, '',
                getReportVoyagePortDaily.auxIfo, '',
                getReportVoyagePortDaily.boilerIfo, '',
                getReportVoyagePortDaily.otherIfo, '',
                { formula: 'SUM(AR' + positionRow + ':AX' + positionRow + ')' }, '',
                { formula: 'IF(ISERROR(' + 'AZ' + positionRow + '*24/' + 'AL' + positionRow + '),0,' + 'AZ' + positionRow + '*24/' + 'AL' + positionRow + ')' }, '',
                getReportVoyagePortDaily.bunkeringIfo, '',
                { formula: 'BF' + (positionRow - 1) + '-AZ' + positionRow + '+BD' + positionRow }, '',
                getReportVoyagePortDaily.mplaMgo, '',
                getReportVoyagePortDaily.auxMgo, '',
                getReportVoyagePortDaily.boilerMgo, '',
                getReportVoyagePortDaily.ppMgo, '',
                getReportVoyagePortDaily.giMgo, '',
                getReportVoyagePortDaily.otherMgo, '',
                { formula: 'SUM(BH' + positionRow + ':BS' + positionRow + ')' }, '',
                { formula: 'IF(ISERROR(' + 'BT' + positionRow + '*24/' + 'AL' + positionRow + '),0,' + 'BT' + positionRow + '*24/' + 'AL' + positionRow + ')' }, '',
                getReportVoyagePortDaily.bunkeringMgo, '',
                { formula: 'BZ' + (positionRow - 1) + '-BT' + positionRow + '+BX' + positionRow }, '',
            ];
            worksheet.addRow(dataRow);
            this.mergeCellReport(worksheet, positionRow, true);
            if (index == 0) {
                worksheet.getCell('U' + positionRow).value = getReportVoyagePortDaily.steamingTime;
                worksheet.getCell('AL' + positionRow).value = getReportVoyagePortDaily.steamingTime;
                worksheet.getCell('BF' + positionRow).value = { formula: 'BE' + (positionRow - 2) + '-AZ' + positionRow + '+BD' + positionRow };
                worksheet.getCell('BZ' + positionRow).value = { formula: 'BY' + (positionRow - 2) + '-BT' + positionRow + '+BX' + positionRow };
                this.addFormatting(worksheet, positionRow);
            }
            else {
                this.addFormatting(worksheet, positionRow);
            }
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('U'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('AJ'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('AN'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('AL'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('AR'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('AT'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('AV'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('AX'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('AZ'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BB'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BD'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BF'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BH'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BJ'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BL'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BN'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BP'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BR'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BT'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BV'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BX'));
            this.RuleFormatCeroGris(worksheet, positionRow, this.SearchPositByCell('BZ'));
        });
        return objMailLastVoyage;
    }
    MultipleFormateWorksheet(worksheet, positionRow, positionColum, typeFormat) {
        let greenLow = 'b6c2ff94';
        let redLow = 'ffd6d6';
        let grisMedio = 'ebe8e8';
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColum) + positionRow,
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
        worksheet.getCell(this.PositByCell(positionColum) + positionRow).numFmt = '0.00';
    }
    RuleFormatCeroGris(worksheet, positionRow, positionColum) {
        let grisMedio = 'ebe8e8';
        worksheet.getCell(this.PositByCell(positionColum) + positionRow).numFmt = '0.00';
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColum) + positionRow,
            rules: [
                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },
            ],
        });
    }
    addStyleByColums(worksheet, position, column, textorFormule, sizeFont, colortText, colorBackgraund, Eliminar) {
        let positionDesde = position[0];
        let positionHasta = position[1];
        let columnDesde = column[0];
        let columnHasta = column[1];
        let style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true
            },
            font: {
                size: sizeFont,
                bold: sizeFont <= 7 ? false : true,
                color: { argb: colortText },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: colorBackgraund
                }
            }
        };
        worksheet.getCell(this.PositByCell(columnDesde) + positionDesde).value = textorFormule;
        worksheet.getCell(this.PositByCell(columnDesde) + positionDesde).style = style;
        worksheet.mergeCells(this.PositByCell(columnDesde) + positionDesde, this.PositByCell(columnHasta) + positionHasta);
    }
    addStyleBorder(worksheet, position, column, borderStyle, colorborder) {
        let positionDesde = position[0];
        let positionHasta = position[1];
        let columnDesde = column[0];
        let columnHasta = column[1];
        let positionColum = columnDesde;
        for (let index = positionDesde; index <= positionHasta; index++) {
            if (false) {
                this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'leftUpperRorner');
                this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'righUpperRorner');
            }
            else if (index == positionHasta) {
                this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'leftLowRorner');
                this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'righLowRorner');
            }
            else {
                this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'left');
                this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'right');
            }
        }
        for (let index = columnDesde + 1; index <= columnHasta - 1; index++) {
            this.addBorder(worksheet, positionHasta, index, borderStyle, colorborder, 'bottom');
        }
    }
    mergeCellReport(worksheet, position, addFontSize) {
        let blueHard3 = '001556';
        let black = '000000';
        worksheet.mergeCells('F' + position, 'G' + position);
        worksheet.mergeCells('H' + position, 'K' + position);
        worksheet.mergeCells('L' + position, 'O' + position);
        worksheet.mergeCells('P' + position, 'R' + position);
        worksheet.mergeCells('S' + position, 'T' + position);
        worksheet.mergeCells('U' + position, 'V' + position);
        worksheet.mergeCells('W' + position, 'Z' + position);
        worksheet.mergeCells('AA' + position, 'AB' + position);
        worksheet.mergeCells('AC' + position, 'AI' + position);
        worksheet.mergeCells('AJ' + position, 'AK' + position);
        worksheet.mergeCells('AL' + position, 'AM' + position);
        worksheet.mergeCells('AN' + position, 'AO' + position);
        worksheet.mergeCells('AP' + position, 'AQ' + position);
        worksheet.mergeCells('AR' + position, 'AS' + position);
        worksheet.mergeCells('AT' + position, 'AU' + position);
        worksheet.mergeCells('AV' + position, 'AW' + position);
        worksheet.mergeCells('AX' + position, 'AY' + position);
        worksheet.mergeCells('AZ' + position, 'BA' + position);
        worksheet.mergeCells('BB' + position, 'BC' + position);
        worksheet.mergeCells('BD' + position, 'BE' + position);
        worksheet.mergeCells('BF' + position, 'BG' + position);
        worksheet.mergeCells('BH' + position, 'BI' + position);
        worksheet.mergeCells('BJ' + position, 'BK' + position);
        worksheet.mergeCells('BL' + position, 'BM' + position);
        worksheet.mergeCells('BN' + position, 'BO' + position);
        worksheet.mergeCells('BP' + position, 'BQ' + position);
        worksheet.mergeCells('BR' + position, 'BS' + position);
        worksheet.mergeCells('BT' + position, 'BU' + position);
        worksheet.mergeCells('BV' + position, 'BW' + position);
        worksheet.mergeCells('BX' + position, 'BY' + position);
        worksheet.mergeCells('BZ' + position, 'CA' + position);
        if (addFontSize) {
            worksheet.getCell('F' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('H' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('L' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('P' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('S' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('U' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('W' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('AA' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('AC' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('AJ' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('AL' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('AN' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('AP' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('AR' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('AT' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('AV' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('AX' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('AZ' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BB' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BD' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BF' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BH' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BJ' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BL' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BN' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BP' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BR' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BT' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BV' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BX' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
            worksheet.getCell('BZ' + position).style = {
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                font: {
                    size: 8,
                    bold: true,
                    color: { argb: black },
                }
            };
        }
    }
    addFormatting(worksheet, position) {
        let grisFuerte = 'd4d4d4';
        let grisMedio = 'ebe8e8';
        let grisSuave = 'f3f3f3';
        let greenHard = '228e30';
        let greenMedium = '0eb924';
        let greenLow = 'c0fdc8';
        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';
        worksheet.getCell('P' + position).numFmt = 'm/d/yyyy';
        worksheet.addConditionalFormatting({
            ref: 'W' + position + ':Z' + position,
            rules: [
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND( OR(EXACT(W' + position + ',"SAILING_WITH_LADEN"), EXACT(W' + position + ',"SAILING_IN_BALLAST"), EXACT(W' + position + ',"ECONOMICAL_NAVIGATION") ), (0<=AJ' + position + ') )'],
                    style: {
                        border: {
                            top: { style: 'double', color: { argb: redHard } },
                            left: { style: 'double', color: { argb: redHard } },
                            bottom: { style: 'double', color: { argb: redHard } },
                            right: { style: 'double', color: { argb: redHard } }
                        }
                    },
                },
            ],
        });
        worksheet.addConditionalFormatting({
            ref: 'AJ' + position + ':AK' + position,
            rules: [
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND( OR(EXACT(W' + position + ',"SAILING_WITH_LADEN"), EXACT(W' + position + ',"SAILING_IN_BALLAST"), EXACT(W' + position + ',"ECONOMICAL_NAVIGATION") ), (0<=AJ' + position + ') )'],
                    style: {
                        border: {
                            top: { style: 'double', color: { argb: redHard } },
                            left: { style: 'double', color: { argb: redHard } },
                            bottom: { style: 'double', color: { argb: redHard } },
                            right: { style: 'double', color: { argb: redHard } }
                        }
                    },
                },
            ],
        });
        if (position % 2 === 0) {
            worksheet.addConditionalFormatting({
                ref: 'F' + position + ':CA' + position,
                rules: [
                    {
                        type: 'expression',
                        priority: 20,
                        formulae: [true],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: grisSuave } },
                        },
                    },
                ],
            });
        }
        else {
        }
    }
    PositByCell(positionColum) {
        let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
            'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ',
            'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ'];
        return letras[positionColum];
    }
    addBorder(worksheet, positionRow, positionColumn, borderStyle, colorborder, lugardelBorde) {
        borderStyle = borderStyle || 'solid';
        let border = worksheet.getCell(this.PositByCell(positionColumn) + positionRow).style.border;
        border = border || {};
        if (lugardelBorde == 'left') {
            border.left = { style: borderStyle, color: { argb: colorborder } };
        }
        else if (lugardelBorde == 'right') {
            border.right = { style: borderStyle, color: { argb: colorborder } };
        }
        else if (lugardelBorde == 'bottom') {
            border.bottom = { style: borderStyle, color: { argb: colorborder } };
        }
        else if (lugardelBorde == 'top') {
            border.top = { style: borderStyle, color: { argb: colorborder } };
        }
        else if (lugardelBorde == 'righUpperRorner') {
            border.top = { style: borderStyle, color: { argb: colorborder } };
            border.right = { style: borderStyle, color: { argb: colorborder } };
        }
        else if (lugardelBorde == 'righLowRorner') {
            border.bottom = { style: borderStyle, color: { argb: colorborder } };
            border.right = { style: borderStyle, color: { argb: colorborder } };
        }
        else if (lugardelBorde == 'leftUpperRorner') {
            border.top = { style: borderStyle, color: { argb: colorborder } };
            border.left = { style: borderStyle, color: { argb: colorborder } };
        }
        else if (lugardelBorde == 'leftLowRorner') {
            border.bottom = { style: borderStyle, color: { argb: colorborder } };
            border.left = { style: borderStyle, color: { argb: colorborder } };
        }
        else {
            border.top = { style: borderStyle, color: { argb: colorborder } };
            border.right = { style: borderStyle, color: { argb: colorborder } };
            border.bottom = { style: borderStyle, color: { argb: colorborder } };
            border.left = { style: borderStyle, color: { argb: colorborder } };
        }
        worksheet.getCell(this.PositByCell(positionColumn) + positionRow).border = border;
    }
    addStyleToBorders(worksheet, position, column, borderStyle, colorborder, top, right, bottom, left) {
        let positionDesde = position[0];
        let positionHasta = position[1];
        let columnDesde = column[0];
        let columnHasta = column[1];
        let positionColum = columnDesde;
        for (let index = positionDesde; index <= positionHasta; index++) {
            if (top || right || bottom || left) {
                if (top) {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'top');
                }
                if (right) {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'right');
                }
                if (bottom) {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'bottom');
                }
                if (left) {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'left');
                }
            }
            else {
                if (index == positionDesde) {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'leftUpperRorner');
                    this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'righUpperRorner');
                }
                else if (index == positionHasta) {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'leftLowRorner');
                    this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'righLowRorner');
                }
                else {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'left');
                    this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'right');
                }
            }
        }
        for (let index = columnDesde; index <= columnHasta; index++) {
            if (top || right || bottom || left) {
                if (top) {
                    this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'top');
                }
                if (right) {
                    this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'right');
                }
                if (bottom) {
                    this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'bottom');
                }
                if (left) {
                    this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'left');
                }
            }
            else {
                this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'top');
                this.addBorder(worksheet, positionHasta, index, borderStyle, colorborder, 'bottom');
            }
        }
    }
    SearchPositByCell(letraColum) {
        let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
            'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ',
            'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ'];
        return letras.indexOf(letraColum);
        letras.forEach((letra, index) => {
            if (letra === letraColum) {
                return index;
            }
        });
    }
    SumaIfo(report) {
        let ifo = report.mplaIfo + report.auxIfo + report.boilerIfo + report.otherIfo;
        return ifo;
    }
    SumaMgo(report) {
        let mgo = report.mplaMgo + report.auxMgo + report.boilerMgo + report.ppMgo + report.giMgo + report.otherMgo;
        return mgo;
    }
};
exports.FormatExcelLastVoyageService = FormatExcelLastVoyageService;
exports.FormatExcelLastVoyageService = FormatExcelLastVoyageService = __decorate([
    (0, common_1.Injectable)()
], FormatExcelLastVoyageService);
class InfoVessel {
    constructor(date_start, hour_start, ifo_start, mgo_start, date_end, hour_end, ifo_end, mgo_end, totalBunkeringIFO, totalBunkeringMGO, totalConsumptIFO, totalConsumptMGO) {
        this.date_start = date_start;
        this.hour_start = hour_start;
        this.ifo_start = ifo_start;
        this.mgo_start = mgo_start;
        this.date_end = date_end;
        this.hour_end = hour_end;
        this.ifo_end = ifo_end;
        this.mgo_end = mgo_end;
        this.totalBunkeringIFO = totalBunkeringIFO;
        this.totalBunkeringMGO = totalBunkeringMGO;
        this.totalConsumptIFO = totalConsumptIFO;
        this.totalConsumptMGO = totalConsumptMGO;
        this.date_start = date_start || '';
        this.hour_start = hour_start || '';
        this.ifo_start = ifo_start || 0;
        this.mgo_start = mgo_start || 0;
        this.date_end = date_end || '';
        this.hour_end = hour_end || '';
        this.ifo_end = ifo_end || 0;
        this.mgo_end = mgo_end || 0;
        this.totalBunkeringIFO = totalBunkeringIFO || 0;
        this.totalBunkeringMGO = totalBunkeringMGO || 0;
        this.totalConsumptIFO = totalConsumptIFO || 0;
        this.totalConsumptMGO = totalConsumptMGO || 0;
    }
}
exports.InfoVessel = InfoVessel;
class PosicionDelosRegistrosNormales {
    constructor(startRow, endRow, startColum) {
        this.startRow = startRow;
        this.endRow = endRow;
        this.startColum = startColum;
        this.startRow = startRow || 0;
        this.endRow = endRow || 0;
        this.startColum = startColum || 0;
    }
}
exports.PosicionDelosRegistrosNormales = PosicionDelosRegistrosNormales;
;
class GenerateFormatObjForExcelEmail {
    constructor(success, buffer, objMailLastVoyage) {
        this.success = success;
        this.buffer = buffer;
        this.objMailLastVoyage = objMailLastVoyage;
        this.success = success || false;
        this.buffer = buffer || null;
        this.objMailLastVoyage = objMailLastVoyage || new sendMailConfig_1.MailLastVoyage();
    }
}
exports.GenerateFormatObjForExcelEmail = GenerateFormatObjForExcelEmail;
//# sourceMappingURL=format-excel-last-voyage.service.js.map