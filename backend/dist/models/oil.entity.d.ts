import { GroupOilEntity } from './group-oils.entity';
import { TypeOfOilEquipmentEntity } from './type-of-oils-equipment.entity';
import { ConsumptionEquipmentEntity } from './consumptionEquipment.entity';
import { BunkerOilToEquipmentEntity } from './buker-oil-to-equipment.entity';
export declare class OilEntity {
    id: number;
    userId: number;
    name: string;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    constructor(id?: number, userId?: number, name?: string, userIdCreated?: number, dateCreated?: string, userIdUpdated?: number, dateUpdated?: string, status?: boolean);
    SyncStatus: string;
}
export declare class SaveDateOils {
    userId: number;
    listGroups: GroupOilEntity[];
    listTypeOfOilEquipment: TypeOfOilEquipmentEntity[];
    listConsumptionEquipment: ConsumptionEquipmentEntity[];
    listBunkerOilToEquipment: BunkerOilToEquipmentEntity[];
    listOils: OilEntity[];
    constructor(userId?: number, listGroups?: GroupOilEntity[], listTypeOfOilEquipment?: TypeOfOilEquipmentEntity[], listConsumptionEquipment?: ConsumptionEquipmentEntity[], listBunkerOilToEquipment?: BunkerOilToEquipmentEntity[], listOil?: OilEntity[]);
}
