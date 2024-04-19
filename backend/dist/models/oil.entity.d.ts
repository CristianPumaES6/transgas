import { GroupOilEntity } from './group-oils.entity';
import { EquipmentSystemEntity } from './equipment-system.entity';
import { ConsumptionEquipmentEntity } from './consumptionEquipment.entity';
import { BunkerOil } from './buker-oil.entity';
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
    listEquipmentSystem: EquipmentSystemEntity[];
    listConsumptionEquipment: ConsumptionEquipmentEntity[];
    listBunkerOil: BunkerOil[];
    listOils: OilEntity[];
    constructor(userId?: number, listGroups?: GroupOilEntity[], listEquipmentSystem?: EquipmentSystemEntity[], listConsumptionEquipment?: ConsumptionEquipmentEntity[], listBunkerOil?: BunkerOil[], listOil?: OilEntity[]);
}
