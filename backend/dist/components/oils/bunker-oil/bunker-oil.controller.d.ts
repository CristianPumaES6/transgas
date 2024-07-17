import { BunkerOilService } from './bunker-oil.service';
import { BunkerOil } from '../../../models/buker-oil.entity';
export declare class BunkerOilController {
    private readonly _BunkerOilService;
    constructor(_BunkerOilService: BunkerOilService);
    Gets(headers: any, bunkerOilEntity: BunkerOil): Promise<any>;
}
