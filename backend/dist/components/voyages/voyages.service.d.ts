import { Repository } from 'typeorm';
import { Voyage, VoyageFilterByYears } from '../../models/voyage.entity';
export declare class VoyagesService {
    private voyageRepository;
    constructor(voyageRepository: Repository<Voyage>);
    Create(voyage: Voyage): Promise<Voyage>;
    Get(id: Number): Promise<Voyage>;
    Gets(voyage: Voyage, page?: number): Promise<Voyage[]>;
    GetsDetails(voyage: Voyage, page?: number): Promise<Voyage[]>;
    GetsByYears(voyageFilterByYears: VoyageFilterByYears): Promise<Voyage[]>;
    Update(voyage: Voyage): Promise<Voyage>;
    Delete(voyage: Voyage): Promise<Voyage>;
    ThisVoyageNumberExists(voyageNumber: number, yearVoyage: number): Promise<Voyage>;
}
