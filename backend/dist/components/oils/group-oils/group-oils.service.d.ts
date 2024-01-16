import { Mapping } from 'src/assets/mappingKeys';
import { GroupOilEntity } from 'src/models/group-oils.entity';
import { Repository } from 'typeorm';
export declare class GroupOilsService {
    private _groupOilRepository;
    constructor(_groupOilRepository: Repository<GroupOilEntity>);
    Gets(groupOilEntity: GroupOilEntity): Promise<GroupOilEntity[]>;
    Create(groupOilEntity: GroupOilEntity): Promise<GroupOilEntity>;
    SaveList(importGroupOils: GroupOilEntity[]): Promise<Mapping[]>;
}
