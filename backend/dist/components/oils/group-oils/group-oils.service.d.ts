import { GroupOilEntity } from 'src/models/group-oils.entity';
import { Repository } from 'typeorm';
export declare class GroupOilsService {
    private _groupOilEntity;
    constructor(_groupOilEntity: Repository<GroupOilEntity>);
    Gets(groupOilEntity: GroupOilEntity): Promise<GroupOilEntity[]>;
}
