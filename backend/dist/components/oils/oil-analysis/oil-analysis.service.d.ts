import { Repository } from 'typeorm';
import { OilAnalysisEntity } from '../../../models/oilAnalysis.entity';
import { FileEntity } from '../../../models/file.entity';
export declare class OilAnalysisService {
    private oilAnalysisRepository;
    private fileRepository;
    constructor(oilAnalysisRepository: Repository<OilAnalysisEntity>, fileRepository: Repository<FileEntity>);
    uploadOilAnalysisFile(file: Express.Multer.File, analysisDate: string): Promise<OilAnalysisEntity>;
    getOilAnalysisFiles(): Promise<OilAnalysisEntity[]>;
}
