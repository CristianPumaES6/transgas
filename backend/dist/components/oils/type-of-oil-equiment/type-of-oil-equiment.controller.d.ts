import { TypeOfOilEquipmentService } from './type-of-oil-equiment.service';
import { TypeOfOilEquipmentEntity } from 'src/models/type-of-oils-equipment.entity';
export declare class TypeOfOilEquipmentController {
    private readonly _TypeOfOilEquipmentService;
    constructor(_TypeOfOilEquipmentService: TypeOfOilEquipmentService);
    Gets(headers: any, typeOfOilEquimentEntity: TypeOfOilEquipmentEntity): Promise<any>;
}
