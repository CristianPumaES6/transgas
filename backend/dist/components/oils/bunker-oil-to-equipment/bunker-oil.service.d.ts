import { Mapping } from 'src/assets/mappingKeys';
import { BunkerOil } from 'src/models/buker-oil-to-equipment.entity';
import { Repository } from 'typeorm';
export declare class BunkerOilService {
    private _BunkerOilToEquipment;
    constructor(_BunkerOilToEquipment: Repository<BunkerOil>);
    Gets(groupOilEntity: BunkerOil): Promise<BunkerOil[]>;
    Create(bunkerOilToEquipment: BunkerOil): Promise<BunkerOil>;
    SaveList(MappingOils: Mapping[], MappingTypesOfOilEquipment: Mapping[], bunkerOilToEquipmentEntity: BunkerOil[]): Promise<Mapping[]>;
}
