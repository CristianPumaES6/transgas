import { BunkerOilToEquipmentService } from './bunker-oil-to-equipment.service';
import { BunkerOilToEquipmentEntity } from 'src/models/buker-oil-to-equipment.entity';
export declare class BunkerOilToEquipmentController {
    private readonly _BunkerOilToEquipmentService;
    constructor(_BunkerOilToEquipmentService: BunkerOilToEquipmentService);
    Gets(headers: any, bunkerOilToEquipmentEntity: BunkerOilToEquipmentEntity): Promise<any>;
}
