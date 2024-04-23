import { OilsService } from './oils.service';
import { OilEntity, DataModuleOils } from '../../models/oil.entity';
import { GroupOilsService } from './group-oils/group-oils.service';
import { EquipmentSystemService } from './equipment-system/equipment-system.service';
import { ConsumptionEquipmentService } from './consumption-equipment/consumption-equipment.service';
import { BunkerOilService } from './bunker-oil/bunker-oil.service';
import { EquipmentOilCompatibilityService } from './equipment-oil-compatibility/equipment-oil-compatibility.service';
export declare class OilsController {
    private readonly _OilsService;
    private readonly _GroupOilEntityService;
    private readonly _EquipmentSystemService;
    private readonly _ConsumptionEquipmentService;
    private readonly _BunkerOilService;
    private readonly _EquipmentOilCompatibilityService;
    constructor(_OilsService: OilsService, _GroupOilEntityService: GroupOilsService, _EquipmentSystemService: EquipmentSystemService, _ConsumptionEquipmentService: ConsumptionEquipmentService, _BunkerOilService: BunkerOilService, _EquipmentOilCompatibilityService: EquipmentOilCompatibilityService);
    Gets(headers: any, oilEntity: OilEntity): Promise<any>;
    GetsDataServer(headers: any, oilEntity: OilEntity): Promise<any>;
    getDataBuque(buqueId: any): Promise<any>;
    Get(id: any): Promise<any>;
    Create(headers: any, oilEntity: OilEntity): Promise<any>;
    Update(headers: any, id: any, oilEntity: OilEntity): Promise<any>;
    Delete(headers: any, id: any): Promise<any>;
    SaveDataLubricante(headers: any, saveDateOils: DataModuleOils): Promise<any>;
}
