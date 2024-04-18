import { BunkerOilService } from './bunker-oil.service';
import { BunkerOil } from 'src/models/buker-oil-to-equipment.entity';
export declare class BunkerOilController {
    private readonly _BunkerOilToEquipmentService;
    constructor(_BunkerOilToEquipmentService: BunkerOilService);
    Gets(headers: any, bunkerOilToEquipmentEntity: BunkerOil): Promise<any>;
}
