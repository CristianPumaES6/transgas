import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Request } from 'express';
import { Inject } from '@nestjs/common';
import { OilAnalysisEntity } from '../../../models/oilAnalysis.entity';
import { FileEntity } from '../../../models/file.entity';

@Injectable()
export class OilAnalysisService {
  constructor(
    @InjectRepository(OilAnalysisEntity)
    private oilAnalysisRepository: Repository<OilAnalysisEntity>,
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}

  // Método para subir un archivo y registrar el análisis de aceite
  async uploadOilAnalysisFile(file: Express.Multer.File, analysisDate: string): Promise<OilAnalysisEntity> {
    // Guardamos el archivo en una carpeta local (puedes cambiar la ruta si es necesario)
    const filePath = join(__dirname, '..', '..', 'uploads', file.filename);

    // Creamos un registro del archivo en la base de datos
    let fileEntity = new FileEntity();
    fileEntity.fileName = file.originalname;
    fileEntity.filePath = filePath;
    fileEntity.fileType = file.mimetype;
    fileEntity.fileSize = file.size;

    await this.fileRepository.save(fileEntity);

    // Luego, registramos el análisis de aceite en la base de datos
    const oilAnalysis = new OilAnalysisEntity();
    oilAnalysis.analysisDate = analysisDate;
    oilAnalysis.fileId = fileEntity.id; // Relacionamos el archivo con el análisis de aceite

    return this.oilAnalysisRepository.save(oilAnalysis);
  }

  // Método para leer los archivos de análisis de aceite
  async getOilAnalysisFiles(): Promise<OilAnalysisEntity[]> {
    return this.oilAnalysisRepository.find({ relations: ['file'] }); // Incluye los archivos relacionados
  }
}
