import { BunkerOilToEquipmentEntity } from 'src/models/buker-oil-to-equipment.entity';
import { Repository } from 'typeorm';
export declare class BunkerOilToEquipmentService {
    private _BunkerOilToEquipment;
    constructor(_BunkerOilToEquipment: Repository<BunkerOilToEquipmentEntity>);
    Gets(groupOilEntity: BunkerOilToEquipmentEntity): Promise<BunkerOilToEquipmentEntity[]>;
}
