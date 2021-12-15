import { Port } from '../../../models/port.entity';
import { Repository } from 'typeorm';
export declare class PortsService {
    private portRepository;
    constructor(portRepository: Repository<Port>);
    Create(port: Port): Promise<Port>;
    Get(id: Number): Promise<Port>;
    Gets(port: Port): Promise<Port[]>;
    GetsDetail(port: Port): Promise<Port[]>;
    Update(port: Port): Promise<Port>;
    Delete(port: Port): Promise<Port>;
    ThereIsThisPortInTheVoyage(portNumber: number, voyageId: number): Promise<Port>;
}
