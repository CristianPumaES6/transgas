import { OilsService } from './oils.service';
import { OilEntity, SaveDateOils } from '../../models/oil.entity';
import { GroupOilsService } from './group-oils/group-oils.service';
import { TypeOfOilEquipmentService } from './type-of-oil-equiment/type-of-oil-equiment.service';
import { ConsumptionEquipmentService } from './consumption-equipment/consumption-equipment/consumption-equipment.service';
import { BunkerOilToEquipmentService } from './bunker-oil-to-equipment/bunker-oil-to-equipment.service';
export declare class OilsController {
    private readonly _OilsService;
    private readonly _GroupOilEntityService;
    private readonly _TypeOfOilEquipmentService;
    private readonly _ConsumptionEquipmentService;
    private readonly _BunkerOilToEquipmentService;
    constructor(_OilsService: OilsService, _GroupOilEntityService: GroupOilsService, _TypeOfOilEquipmentService: TypeOfOilEquipmentService, _ConsumptionEquipmentService: ConsumptionEquipmentService, _BunkerOilToEquipmentService: BunkerOilToEquipmentService);
    Gets(headers: any, oilEntity: OilEntity): Promise<any>;
    GetsDataServer(headers: any, oilEntity: OilEntity): Promise<any>;
    Get(id: any): Promise<any>;
    Create(headers: any, oilEntity: OilEntity): Promise<any>;
    Update(headers: any, id: any, oilEntity: OilEntity): Promise<any>;
    Delete(headers: any, id: any): Promise<any>;
    SaveDataLubricante(headers: any, saveDateOils: SaveDateOils): Promise<any>;
}
