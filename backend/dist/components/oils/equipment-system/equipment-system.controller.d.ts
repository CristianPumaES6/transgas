import { EquipmentSystemService } from './equipment-system.service';
import { EquipmentSystemEntity } from 'src/models/equipment-system.entity';
export declare class EquipmentSystemController {
    private readonly _EquipmentSystemService;
    constructor(_EquipmentSystemService: EquipmentSystemService);
    Gets(headers: any, equipmentSystemEntity: EquipmentSystemEntity): Promise<any>;
}
