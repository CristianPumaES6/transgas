import { AppGateway } from './app.gateway';
import { ConsumptionEquipmentService, getOilConsumptionPerMonth, QueryViewFileAnalysisOil } from './components/oils/consumption-equipment/consumption-equipment.service';
import { UsersService } from './components/users/users.service';
import { UserEntity } from './models/user.entity';
export declare class AppService {
    private gateway;
    private readonly _ConsumptionEquipmentService;
    private readonly _UsersService;
    constructor(gateway: AppGateway, _ConsumptionEquipmentService: ConsumptionEquipmentService, _UsersService: UsersService);
    EmitConnect(): boolean;
    ListConsumptionLubricantPerMonth(userid: number, startDate: string, endDate: string): Promise<ListUserConsumptionLubricantPerMonth[]>;
    GetOilAnalysis(buqueId: number, ETM_OilAnalysis_Oid: string): Promise<any[] | import("./components/oils/consumption-equipment/consumption-equipment.service").QueryGetTask[]>;
    SaveFileAnalysisOil(buqueId: number, ETM_OilAnalysis_Oid: string): Promise<QueryViewFileAnalysisOil[]>;
    ViewFileAnalysisOil(buqueId: number, ETM_OilAnalysis_Oid: string): Promise<QueryViewFileAnalysisOil[]>;
    consultEquipmentConsumptionByMonthUser(userId: number, entityEquipmentId: number, DateYEAR_MONTH: string): Promise<any[] | import("./components/oils/consumption-equipment/consumption-equipment.service").consultEquipmentConsumptionByMonthUser[]>;
    GetShips(): Promise<any[] | import("./components/oils/consumption-equipment/consumption-equipment.service").consultEquipmentConsumptionByMonthUser[]>;
    ConsumptionLubricantPerMonthPerListUsers(users: UserEntity[], startDate: string, endDate: string): Promise<ListUserConsumptionLubricantPerMonth[]>;
}
export interface ListUserConsumptionLubricantPerMonth {
    userId: number;
    userName: string;
    filename: string;
    role: string;
    getOilConsumptionPerMonth: getOilConsumptionPerMonth[];
}
