import { OilsService } from './oils.service';
import { OilEntity } from '../../models/oil.entity';
export declare class OilsController {
    private readonly _OilsService;
    constructor(_OilsService: OilsService);
    Get(id: any): Promise<any>;
    Gets(headers: any, oilEntity: OilEntity): Promise<any>;
    Create(headers: any, oilEntity: OilEntity): Promise<any>;
    Update(headers: any, id: any, oilEntity: OilEntity): Promise<any>;
    Delete(headers: any, id: any): Promise<any>;
}
