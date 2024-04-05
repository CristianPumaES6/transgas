import { Repository } from 'typeorm';
import { ConsumptionEquipmentEntity } from 'src/models/consumptionEquipment.entity';
import { Mapping } from 'src/assets/mappingKeys';
export declare class ConsumptionEquipmentService {
    private _ConsumptionEquipment;
    constructor(_ConsumptionEquipment: Repository<ConsumptionEquipmentEntity>);
    Gets(consumptionEquipment: ConsumptionEquipmentEntity): Promise<ConsumptionEquipmentEntity[]>;
    Create(consumptionEquipment: ConsumptionEquipmentEntity): Promise<ConsumptionEquipmentEntity>;
    SaveList(MappingGroupOils: Mapping[], consumptionsEquipment: ConsumptionEquipmentEntity[]): Promise<SaveListConsumptionEquipmentEntity>;
    getOilConsumptionPerMonth(userId: number): Promise<getOilConsumptionPerMonth[]>;
    consultEquipmentConsumptionByMonthUser(userId: number, entityEquipmentId: number, DateYEAR_MONTH: string): Promise<consultEquipmentConsumptionByMonthUser[]>;
}
export interface SaveListConsumptionEquipmentEntity {
    MappingConsumptionsEquipment: Mapping[];
    listConsumosValidarSendMail: any[];
}
export interface getOilConsumptionPerMonth {
    year_month: string;
    entityEquipmentId: number;
    total_amount: number;
    total_hourConsumption: number;
    rate: number;
    equipment: string;
    entityGroupId: number;
    total_bunker: number;
    last_entityOilId: number;
    last_oil_name: string;
}
export interface consultEquipmentConsumptionByMonthUser {
    typeOfOilEquipmentUserId: string;
    EquipmentId: number;
    EquipmentName: string;
    RateSystems: number;
    consumptionEquipmentId: number;
    TotalConsumption: number;
    HourConsumption: number;
    Rate: number;
    Observations: number;
    ConsumptionDate: string;
    bunkerOilToEquipmentId: number;
    TotalBunker: number;
    BunkerDate: string;
}
