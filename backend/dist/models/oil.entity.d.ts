import { GroupOilEntity } from './group-oils.entity';
import { EquipmentSystemEntity } from './equipment-system.entity';
import { ConsumptionEquipmentEntity } from './consumptionEquipment.entity';
import { BunkerOil } from './buker-oil.entity';
import { EquipmentOilCompatibilityEntity } from './equipment-oil-compatibility.entity';
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
export declare class DataModuleOils {
    userId: number;
    listGroups: GroupOilEntity[];
    listEquipmentSystem: EquipmentSystemEntity[];
    listOils: OilEntity[];
    listBunkerOil: BunkerOil[];
    listEquipmentOilCompatibility: EquipmentOilCompatibilityEntity[];
    listConsumptionEquipment: ConsumptionEquipmentEntity[];
    constructor(_userId?: number, _listGroup?: GroupOilEntity[], _listEquipmentSystem?: EquipmentSystemEntity[], _listOil?: OilEntity[], _listBunkerOil?: BunkerOil[], _listEquipmentOilCompatibility?: EquipmentOilCompatibilityEntity[], _listConsumptionEquipment?: ConsumptionEquipmentEntity[]);
}
