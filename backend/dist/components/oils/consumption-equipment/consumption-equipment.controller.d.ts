import { ConsumptionEquipmentService } from './consumption-equipment.service';
import { ConsumptionEquipmentEntity } from '../../../models/consumptionEquipment.entity';
export declare class ConsumptionEquipmentController {
    private readonly _ConsumptionEquipmentService;
    constructor(_ConsumptionEquipmentService: ConsumptionEquipmentService);
    Gets(headers: any, consumptionEquipment: ConsumptionEquipmentEntity): Promise<any>;
}
