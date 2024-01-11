import { GroupOilEntity } from 'src/models/group-oils.entity';
import { GroupOilsService } from './group-oils.service';
export declare class GroupOilsController {
    private readonly _GroupOilEntityService;
    constructor(_GroupOilEntityService: GroupOilsService);
    Gets(headers: any, groupOilEntity: GroupOilEntity): Promise<any>;
}
