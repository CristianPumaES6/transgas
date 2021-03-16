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
exports.VoyagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const typeorm_4 = require("typeorm");
const voyage_entity_1 = require("../../models/voyage.entity");
let VoyagesService = class VoyagesService {
    constructor(voyageRepository) {
        this.voyageRepository = voyageRepository;
    }
    async Create(voyage) {
        return await this.voyageRepository.find({
            where: [
                {
                    userId: voyage.userId,
                }
            ],
            take: 1,
            order: {
                voyageNumber: 'DESC',
            }
        }).then((result) => {
            if (result && (result.length > 0)) {
                voyage.voyageNumber = Number(result[0].voyageNumber) + 1;
            }
            else {
                voyage.voyageNumber = 1;
            }
            ;
            return this.voyageRepository.save(voyage);
        }).then((resultSave) => {
            if (!resultSave)
                throw new Error('No se puedo registrar el viaje en la BD.');
            return resultSave;
        });
    }
    async Get(id) {
        return await this.voyageRepository.findOne({
            where: {
                id: id,
                status: typeorm_4.Not(false)
            }
        }).then((resultFind) => {
            if (!resultFind)
                throw new Error('voyage_does_not_exist');
            return resultFind;
        });
    }
    async Gets(voyage, page = 1) {
        return await this.voyageRepository.find({
            where: [
                {
                    userId: typeorm_3.Like('%' + (voyage.userId || '') + '%'),
                    voyageNumber: typeorm_3.Like('%' + (voyage.voyageNumber || '') + '%'),
                    year: typeorm_3.Like('%' + (voyage.year || '') + '%'),
                    status: typeorm_4.Not(false)
                }
            ],
            take: 5,
            skip: 5 * (page - 5),
            order: {
                voyageNumber: 'DESC',
            }
        }).then((result) => {
            return result;
        });
    }
    async GetsDetails(voyage, page = 1) {
        return await this.voyageRepository.find({
            relations: ["ports"],
            where: [
                {
                    userId: typeorm_3.Like('%' + (voyage.userId || '') + '%'),
                    voyageNumber: typeorm_3.Like('%' + (voyage.voyageNumber || '') + '%'),
                    year: typeorm_3.Like('%' + (voyage.year || '') + '%'),
                    status: typeorm_4.Not(false)
                }
            ],
            take: 5,
            skip: 5 * (page - 5),
            order: {
                voyageNumber: 'DESC',
            }
        }).then((result) => {
            return result;
        });
    }
    async GetsByYears(voyageFilterByYears) {
        return await this.voyageRepository.find({
            relations: ["ports"],
            where: [
                {
                    userId: voyageFilterByYears.userId,
                    year: typeorm_2.In(voyageFilterByYears.years),
                    status: typeorm_4.Not(false)
                }
            ],
            order: {
                voyageNumber: 'DESC',
            }
        }).then((result) => {
            return result;
        });
    }
    async Update(voyage) {
        return await this.voyageRepository.findOne({
            where: [
                { id: voyage.id }
            ]
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('voyage_does_not_exist');
            return this.voyageRepository.update(voyage.id, voyage);
        }).then(resultUpdate => {
            if (!resultUpdate)
                throw 'TYPEORM_UPDATE_VOYAGE';
            return voyage;
        });
    }
    async Delete(voyage) {
        return await this.voyageRepository.update(voyage.id, voyage).then(resultSave => {
            if (!resultSave)
                throw new Error('error_update_delete_voyage');
            return voyage;
        });
    }
    async ThisVoyageNumberExists(voyageNumber, yearVoyage) {
        return await this.voyageRepository.findOne({
            where: [
                {
                    voyageNumber: voyageNumber,
                    yearVoyage: yearVoyage
                }
            ]
        }).then(resultFind => {
            return resultFind;
        });
    }
};
VoyagesService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(voyage_entity_1.Voyage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VoyagesService);
exports.VoyagesService = VoyagesService;
//# sourceMappingURL=voyages.service.js.map