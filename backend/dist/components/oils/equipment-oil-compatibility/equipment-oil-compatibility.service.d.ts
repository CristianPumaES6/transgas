import { Repository } from 'typeorm';
import { Mapping } from '../../../assets/mappingKeys';
import { EquipmentOilCompatibilityEntity } from '../../../models/equipment-oil-compatibility.entity';
export declare class EquipmentOilCompatibilityService {
    private _EquipmentOilCompatibilityEntity;
    constructor(_EquipmentOilCompatibilityEntity: Repository<EquipmentOilCompatibilityEntity>);
    Gets(equipmentOilCompatibility: EquipmentOilCompatibilityEntity): Promise<EquipmentOilCompatibilityEntity[]>;
    Create(equipmentOilCompatibility: EquipmentOilCompatibilityEntity): Promise<EquipmentOilCompatibilityEntity>;
    SaveList(MappingOils: Mapping[], MappingEquipmentSystems: Mapping[], equipmentOilCompatibilitys: EquipmentOilCompatibilityEntity[]): Promise<Mapping[]>;
}
