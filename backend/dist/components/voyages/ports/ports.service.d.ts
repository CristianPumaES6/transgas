import { Port } from '../../../models/port.entity';
import { Repository } from 'typeorm';
import { Mapping } from '../../../assets/mappingKeys';
export declare class PortsService {
    private portRepository;
    constructor(portRepository: Repository<Port>);
    Create(port: Port): Promise<Port>;
    Get(id: Number): Promise<Port>;
    Gets(port: Port): Promise<Port[]>;
    GetsDetail(port: Port): Promise<Port[]>;
    Update(port: Port): Promise<Port>;
    Delete(port: Port): Promise<Port>;
    ThereIsThisPortInTheVoyage(portNumber: number, voyageId: number, userId: number): Promise<Port>;
    GetLastPortTotalConsumpByUserId(userId: number): Promise<any[]>;
    SaveList(MappingVoyages: Mapping[], importPorts: Port[]): Promise<Mapping[]>;
}
