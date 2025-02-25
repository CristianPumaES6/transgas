import { ImportExcelLubricanteDiario } from '../../../models/oil.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../models/user.entity';
import { ConsumptionEquipmentEntity } from '../../../models/consumptionEquipment.entity';
import { Mapping } from '../../../assets/mappingKeys';
export declare class ConsumptionEquipmentService {
    private _ConsumptionEquipment;
    constructor(_ConsumptionEquipment: Repository<ConsumptionEquipmentEntity>);
    Gets(consumptionEquipment: ConsumptionEquipmentEntity): Promise<ConsumptionEquipmentEntity[]>;
    Create(consumptionEquipment: ConsumptionEquipmentEntity): Promise<ConsumptionEquipmentEntity>;
    SaveList(MappingEquipmentOilCompatibility: Mapping[], consumptionsEquipment: ConsumptionEquipmentEntity[]): Promise<SaveListConsumptionEquipmentEntity>;
    GetInfoPortVoyageSeped(userId: number, startDate: string, endDate: string): Promise<any[]>;
    GetConsumoIFOByActivity(userId: number, startDate: string, endDate: string): Promise<any[]>;
    GetConsumoMGOByActivity(userId: number, startDate: string, endDate: string): Promise<any[]>;
    GetConsumoROBIFO(userId: number, startDate: string, endDate: string): Promise<any[]>;
    GetConsumoROBMGO(userId: number, startDate: string, endDate: string): Promise<any[]>;
    GetConsumoEquipoIFOPorMonth(userId: number, startDate: string, endDate: string): Promise<any[]>;
    GetConsumoEquipoMGOPorMonth(userId: number, startDate: string, endDate: string): Promise<any[]>;
    getConsumoDeLUBRICANTEQUIPOPORFechas(userId: number, startDate: string, endDate: string): Promise<getOilConsumptionPerMonth[]>;
    getOilConsumptionPerMonth(userId: number, startDate: string, endDate: string): Promise<getOilConsumptionPerMonth[]>;
    QueryGetTask(userId: number, ETM_OilAnalysis_Oid: string): Promise<QueryGetTask[]>;
    ViewFileAnalysisOil(buqueId: number, ETM_OilAnalysis_Oid: string): Promise<QueryViewFileAnalysisOil[]>;
    consultEquipmentConsumptionByMonthUser(userId: number, entityEquipmentId: number, DateYEAR_MONTH: string): Promise<consultEquipmentConsumptionByMonthUser[]>;
    GetShips(): Promise<any[]>;
    GetStatusOilStartEnd(userId: number, startDate: string, endDate: string): Promise<consultEquipmentConsumptionByMonthUser[]>;
    GetInfoAllVessel(startDate: string, endDate: string): Promise<consultEquipmentConsumptionByMonthUser[]>;
    ImportExcelLubricantDiario(userEntity: UserEntity, ImportExcelLubricantDiaries: ImportExcelLubricanteDiario[]): Promise<Mapping[]>;
    GetSelectDailyReport_Summary(userId: number, startDate: string, endDate: string): Promise<any[]>;
}
export interface SaveListConsumptionEquipmentEntity {
    MappingConsumptionsEquipment: Mapping[];
    listConsumosValidarSendMail: any[];
}
export interface QueryGetTask {
    ELM_Oid: string;
    ELM_Codigo: string;
    ETM_Oid: string;
    ETM_Descripcion: string;
    FechaProgramacion: string;
    FechaEjecucion: string;
    EstaTerminado: string;
}
export interface QueryViewFileAnalysisOil {
    Filename: string;
    Content: string;
}
export interface getOilConsumptionPerMonth {
    compatibilityId: number;
    year_month: string;
    equipmentId: number;
    equipmentName: string;
    frequencyId: number;
    rateSystems: number;
    groupId: number;
    groupName: string;
    consumptionTypeId: number;
    consumptionTypeName: string;
    total_amount: number;
    total_hourConsumption: number;
    lastOilName: string;
    oilId: number;
    last_oil_cost: string;
    total_cost: number;
}
export interface consultEquipmentConsumptionByMonthUser {
    equipmentSystemUserId: string;
    EquipmentId: number;
    EquipmentName: string;
    RateSystems: number;
    consumptionEquipmentId: number;
    consumptionTypeId: number;
    consumptionTypeName: string;
    TotalConsumption: number;
    HourConsumption: number;
    Rate: number;
    Observations: number;
    ConsumptionDate: string;
    bunkerOilId: number;
    TotalBunker: number;
    BunkerDate: string;
}
