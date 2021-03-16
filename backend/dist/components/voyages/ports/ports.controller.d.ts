import { Port } from 'src/models/port.entity';
import { PortsService } from './ports.service';
export declare class PortsController {
    private readonly _portsService;
    constructor(_portsService: PortsService);
    GetsDetail(headers: any, port: Port): Promise<any>;
    Get(headers: any, id: any): Promise<any>;
    Gets(headers: any, port: Port): Promise<any>;
    CreatePort(headers: any, port: Port): Promise<any>;
    Update(headers: any, id: any, port: Port): Promise<any>;
    Delete(headers: any, id: any): Promise<any>;
}
