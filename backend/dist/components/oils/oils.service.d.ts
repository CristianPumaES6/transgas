import { OilEntity } from '../../models/oil.entity';
import { Repository } from 'typeorm';
import { Mapping } from '../../assets/mappingKeys';
export declare class OilsService {
    private _oilRepository;
    constructor(_oilRepository: Repository<OilEntity>);
    Get(id: Number): Promise<OilEntity>;
    Gets(oilEntity: OilEntity): Promise<OilEntity[]>;
    Create(oilEntity: OilEntity): Promise<OilEntity>;
    Update(oilEntity: OilEntity): Promise<OilEntity>;
    Delete(oilEntity: OilEntity, usuarioDelete: number): Promise<OilEntity>;
    SaveList(importOils: OilEntity[]): Promise<Mapping[]>;
    ConsultarListaDeConsumosRegistrados(ListCONSUMOSId: any[]): Promise<DailyOilConsumptionData[]>;
}
export interface DailyOilConsumptionData {
    dateConsumption: string;
    observation: string;
    data: DataDailyOilConsumptionData[];
}
export interface DataDailyOilConsumptionData {
    equipment: string;
    datetimeBunkerOil: string;
    nameOil: string;
    amountConsumption: number;
    hourConsumption: number;
    calcRate: number;
    rate: number;
}
