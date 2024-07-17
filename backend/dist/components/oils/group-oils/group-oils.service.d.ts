import { Mapping } from '../../../assets/mappingKeys';
import { GroupOilEntity } from '../../../models/group-oils.entity';
import { Repository } from 'typeorm';
export declare class GroupOilsService {
    private _groupOilRepository;
    constructor(_groupOilRepository: Repository<GroupOilEntity>);
    Gets(groupOilEntity: GroupOilEntity): Promise<GroupOilEntity[]>;
    Create(groupOilEntity: GroupOilEntity): Promise<GroupOilEntity>;
    SaveList(importGroupOils: GroupOilEntity[]): Promise<Mapping[]>;
}
