import { Mapping } from 'src/assets/mappingKeys';
import { BunkerOil } from 'src/models/buker-oil-to-equipment.entity';
import { Repository } from 'typeorm';
export declare class BunkerOilService {
    private _BunkerOil;
    constructor(_BunkerOil: Repository<BunkerOil>);
    Gets(groupOilEntity: BunkerOil): Promise<BunkerOil[]>;
    Create(bunkerOil: BunkerOil): Promise<BunkerOil>;
    SaveList(MappingOils: Mapping[], MappingTypesOfOilEquipment: Mapping[], bunkerOilEntity: BunkerOil[]): Promise<Mapping[]>;
}
