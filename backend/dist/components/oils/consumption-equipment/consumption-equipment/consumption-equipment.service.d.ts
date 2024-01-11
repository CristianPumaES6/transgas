import { Repository } from 'typeorm';
import { ConsumptionEquipmentEntity } from 'src/models/consumptionEquipment.entity';
export declare class ConsumptionEquipmentService {
    private _ConsumptionEquipment;
    constructor(_ConsumptionEquipment: Repository<ConsumptionEquipmentEntity>);
    Gets(consumptionEquipment: ConsumptionEquipmentEntity): Promise<ConsumptionEquipmentEntity[]>;
}
