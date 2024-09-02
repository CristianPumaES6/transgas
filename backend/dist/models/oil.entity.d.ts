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
export declare class ImportExcelLubricanteDiario {
    USER_ID: number;
    DATE: string;
    IDENT_ME1: number;
    IDENT_ME2: number;
    IDENT_AUX1: number;
    IDENT_AUX2: number;
    IDENT_AUX3: number;
    HOUR_ME: number;
    HOUR_AUX1: number;
    HOUR_AUX2: number;
    HOUR_AUX3: number;
    LUB_ME: number;
    LUB_AUX1: number;
    LUB_AUX2: number;
    LUB_AUX3: number;
    LUB_ME_CYLINDER: number;
}
