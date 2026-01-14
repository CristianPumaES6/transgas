import { Repository } from 'typeorm';
import { Voyage, VoyageFilterByYears } from '../../models/voyage.entity';
import { Mapping } from '../../assets/mappingKeys';
export declare class VoyagesService {
    private voyageRepository;
    constructor(voyageRepository: Repository<Voyage>);
    Create(voyage: Voyage): Promise<Voyage>;
    Get(id: Number): Promise<Voyage>;
    Gets(voyage: Voyage, page?: number): Promise<Voyage[]>;
    GetsDetails(voyage: Voyage, page?: number): Promise<Voyage[]>;
    private InfoVoyage;
    GetsByYears(voyageFilterByYears: VoyageFilterByYears): Promise<Voyage[]>;
    Update(voyage: Voyage): Promise<Voyage>;
    Delete(voyage: Voyage): Promise<Voyage>;
    ThisVoyageNumberExistsInTheYear(voyageNumber: number, yearVoyage: number, userId: number): Promise<Voyage>;
    ThisVoyageIdExists(voyageId: number, userId: number): Promise<Voyage>;
    GetLastVoyage(userId: number): Promise<any>;
    SaveList(importVoyages: Voyage[]): Promise<Mapping[]>;
}
