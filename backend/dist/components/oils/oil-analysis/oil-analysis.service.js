"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OilAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const path_1 = require("path");
const oilAnalysis_entity_1 = require("../../../models/oilAnalysis.entity");
const file_entity_1 = require("../../../models/file.entity");
let OilAnalysisService = class OilAnalysisService {
    constructor(oilAnalysisRepository, fileRepository) {
        this.oilAnalysisRepository = oilAnalysisRepository;
        this.fileRepository = fileRepository;
    }
    async uploadOilAnalysisFile(file, analysisDate) {
        const filePath = (0, path_1.join)(__dirname, '..', '..', 'uploads', file.filename);
        let fileEntity = new file_entity_1.FileEntity();
        fileEntity.fileName = file.originalname;
        fileEntity.filePath = filePath;
        fileEntity.fileType = file.mimetype;
        fileEntity.fileSize = file.size;
        await this.fileRepository.save(fileEntity);
        const oilAnalysis = new oilAnalysis_entity_1.OilAnalysisEntity();
        oilAnalysis.analysisDate = analysisDate;
        oilAnalysis.fileId = fileEntity.id;
        return this.oilAnalysisRepository.save(oilAnalysis);
    }
    async getOilAnalysisFiles() {
        return this.oilAnalysisRepository.find({ relations: ['file'] });
    }
};
exports.OilAnalysisService = OilAnalysisService;
exports.OilAnalysisService = OilAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(oilAnalysis_entity_1.OilAnalysisEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(file_entity_1.FileEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OilAnalysisService);
//# sourceMappingURL=oil-analysis.service.js.map