import { AppGateway } from './app.gateway';
export declare class AppService {
    private gateway;
    constructor(gateway: AppGateway);
    EmitConnect(): boolean;
}
