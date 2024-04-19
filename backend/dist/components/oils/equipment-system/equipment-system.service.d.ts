import { Mapping } from 'src/assets/mappingKeys';
import { EquipmentSystemEntity } from 'src/models/equipment-system.entity';
import { Repository } from 'typeorm';
export declare class EquipmentSystemService {
    private _EquipmentSystemEntity;
    constructor(_EquipmentSystemEntity: Repository<EquipmentSystemEntity>);
    Gets(equipmentSystemEntity: EquipmentSystemEntity): Promise<EquipmentSystemEntity[]>;
    Create(equipmentSystemEntity: EquipmentSystemEntity): Promise<EquipmentSystemEntity>;
    SaveList(MappingGroupOils: Mapping[], typesOfOilEquipmentEntity: EquipmentSystemEntity[]): Promise<Mapping[]>;
}
