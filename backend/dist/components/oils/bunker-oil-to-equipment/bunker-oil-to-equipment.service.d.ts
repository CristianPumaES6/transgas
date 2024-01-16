import { Mapping } from 'src/assets/mappingKeys';
import { BunkerOilToEquipmentEntity } from 'src/models/buker-oil-to-equipment.entity';
import { Repository } from 'typeorm';
export declare class BunkerOilToEquipmentService {
    private _BunkerOilToEquipment;
    constructor(_BunkerOilToEquipment: Repository<BunkerOilToEquipmentEntity>);
    Gets(groupOilEntity: BunkerOilToEquipmentEntity): Promise<BunkerOilToEquipmentEntity[]>;
    Create(bunkerOilToEquipment: BunkerOilToEquipmentEntity): Promise<BunkerOilToEquipmentEntity>;
    SaveList(MappingOils: Mapping[], MappingTypesOfOilEquipment: Mapping[], bunkerOilToEquipmentEntity: BunkerOilToEquipmentEntity[]): Promise<Mapping[]>;
}
