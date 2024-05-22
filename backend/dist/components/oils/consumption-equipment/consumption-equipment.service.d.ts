import { Repository } from 'typeorm';
import { ConsumptionEquipmentEntity } from 'src/models/consumptionEquipment.entity';
import { Mapping } from 'src/assets/mappingKeys';
export declare class ConsumptionEquipmentService {
    private _ConsumptionEquipment;
    constructor(_ConsumptionEquipment: Repository<ConsumptionEquipmentEntity>);
    Gets(consumptionEquipment: ConsumptionEquipmentEntity): Promise<ConsumptionEquipmentEntity[]>;
    Create(consumptionEquipment: ConsumptionEquipmentEntity): Promise<ConsumptionEquipmentEntity>;
    SaveList(MappingEquipmentOilCompatibility: Mapping[], consumptionsEquipment: ConsumptionEquipmentEntity[]): Promise<SaveListConsumptionEquipmentEntity>;
    getOilConsumptionPerMonth(userId: number): Promise<getOilConsumptionPerMonth[]>;
    consultEquipmentConsumptionByMonthUser(userId: number, entityEquipmentId: number, DateYEAR_MONTH: string): Promise<consultEquipmentConsumptionByMonthUser[]>;
}
export interface SaveListConsumptionEquipmentEntity {
    MappingConsumptionsEquipment: Mapping[];
    listConsumosValidarSendMail: any[];
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
