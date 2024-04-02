import { AppGateway } from './app.gateway';
import { ConsumptionEquipmentService, getOilConsumptionPerMonth } from './components/oils/consumption-equipment/consumption-equipment/consumption-equipment.service';
import { UsersService } from './components/users/users.service';
export declare class AppService {
    private gateway;
    private readonly _ConsumptionEquipmentService;
    private readonly _UsersService;
    constructor(gateway: AppGateway, _ConsumptionEquipmentService: ConsumptionEquipmentService, _UsersService: UsersService);
    EmitConnect(): boolean;
    ListConsumptionLubricantPerMonth(userid: number): Promise<ListUserConsumptionLubricantPerMonth[]>;
    ConsumptionLubricantPerMonthPerListUsers(users: any[]): Promise<ListUserConsumptionLubricantPerMonth[]>;
}
export interface ListUserConsumptionLubricantPerMonth {
    userId: number;
    userName: string;
    filename: string;
    getOilConsumptionPerMonth: getOilConsumptionPerMonth[];
}
