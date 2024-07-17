import { GetReportVoyagePortDaily, InfoFuelStartEndForDate } from '../../models/daily-report.entity';
import { UserEntity } from '../../models/user.entity';
import { MailLastVoyage } from '../../models/sendMailConfig';
export declare class FormatExcelLastVoyageService {
    GenerateFormatObjForExcelEmail(listGetReportVoyagePortDaily: GetReportVoyagePortDaily[], getInfoFuelStartEndByFilterDate: InfoFuelStartEndForDate, selectUser: UserEntity): Promise<GenerateFormatObjForExcelEmail>;
    private ResetColumn;
    private GenerarHojaDataReport;
    private StyleDashLegend;
    private StyleDashInfoVessel;
    private StyleDashBuque;
    private StyleDashSpeed;
    private StyleDashActivity;
    private StyleDashCosumption;
    private AddInfoByPortAccordingToTheTravelreport;
    private cuadroResumentotal;
    private StyleDashReportRegister;
    private MultipleFormateWorksheet;
    private RuleFormatCeroGris;
    private addStyleByColums;
    private addStyleBorder;
    private mergeCellReport;
    private addFormatting;
    PositByCell(positionColum: number): string;
    private addBorder;
    private addStyleToBorders;
    SearchPositByCell(letraColum: string): any;
    private SumaIfo;
    private SumaMgo;
}
export declare class InfoVessel {
    date_start?: string;
    hour_start?: string;
    ifo_start?: number;
    mgo_start?: number;
    date_end?: string;
    hour_end?: string;
    ifo_end?: number;
    mgo_end?: number;
    totalBunkeringIFO?: number;
    totalBunkeringMGO?: number;
    totalConsumptIFO?: number;
    totalConsumptMGO?: number;
    constructor(date_start?: string, hour_start?: string, ifo_start?: number, mgo_start?: number, date_end?: string, hour_end?: string, ifo_end?: number, mgo_end?: number, totalBunkeringIFO?: number, totalBunkeringMGO?: number, totalConsumptIFO?: number, totalConsumptMGO?: number);
}
export declare class PosicionDelosRegistrosNormales {
    startRow?: number;
    endRow?: number;
    startColum?: number;
    constructor(startRow?: number, endRow?: number, startColum?: number);
}
export declare class GenerateFormatObjForExcelEmail {
    success?: boolean;
    buffer?: Buffer;
    objMailLastVoyage?: MailLastVoyage;
    constructor(success?: boolean, buffer?: Buffer, objMailLastVoyage?: MailLastVoyage);
}
