import { TypeOfOilEquipmentEntity } from 'src/models/type-of-oils-equipment.entity';
import { Repository } from 'typeorm';
export declare class TypeOfOilEquipmentService {
    private _TypeOfOilEquimentEntity;
    constructor(_TypeOfOilEquimentEntity: Repository<TypeOfOilEquipmentEntity>);
    Gets(typeOfOilEquipmentEntity: TypeOfOilEquipmentEntity): Promise<TypeOfOilEquipmentEntity[]>;
}
