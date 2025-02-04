"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OilsModule = void 0;
const common_1 = require("@nestjs/common");
const oils_controller_1 = require("./oils.controller");
const oils_service_1 = require("./oils.service");
const oil_entity_1 = require("../../models/oil.entity");
const typeorm_1 = require("@nestjs/typeorm");
const consumption_equipment_controller_1 = require("./consumption-equipment/consumption-equipment.controller");
const consumption_equipment_service_1 = require("./consumption-equipment/consumption-equipment.service");
const group_oils_controller_1 = require("./group-oils/group-oils.controller");
const group_oils_service_1 = require("./group-oils/group-oils.service");
const equipment_system_controller_1 = require("./equipment-system/equipment-system.controller");
const bunker_oil_controller_1 = require("./bunker-oil/bunker-oil.controller");
const bunker_oil_service_1 = require("./bunker-oil/bunker-oil.service");
const consumptionEquipment_entity_1 = require("../../models/consumptionEquipment.entity");
const group_oils_entity_1 = require("../../models/group-oils.entity");
const buker_oil_entity_1 = require("../../models/buker-oil.entity");
const equipment_system_entity_1 = require("../../models/equipment-system.entity");
const equipment_system_service_1 = require("./equipment-system/equipment-system.service");
const equipment_oil_compatibility_service_1 = require("./equipment-oil-compatibility/equipment-oil-compatibility.service");
const equipment_oil_compatibility_controller_1 = require("./equipment-oil-compatibility/equipment-oil-compatibility.controller");
const equipment_oil_compatibility_entity_1 = require("../../models/equipment-oil-compatibility.entity");
const oilPriceHistory_entity_1 = require("../../models/oilPriceHistory.entity");
const oilAnalysis_entity_1 = require("../../models/oilAnalysis.entity");
const file_entity_1 = require("../../models/file.entity");
let OilsModule = class OilsModule {
};
exports.OilsModule = OilsModule;
exports.OilsModule = OilsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                oil_entity_1.OilEntity,
                oilPriceHistory_entity_1.OilPriceHistory,
                consumptionEquipment_entity_1.ConsumptionEquipmentEntity,
                group_oils_entity_1.GroupOilEntity,
                buker_oil_entity_1.BunkerOil,
                equipment_system_entity_1.EquipmentSystemEntity,
                equipment_oil_compatibility_entity_1.EquipmentOilCompatibilityEntity,
                oilAnalysis_entity_1.OilAnalysisEntity,
                file_entity_1.FileEntity,
            ]),
        ],
        controllers: [
            oils_controller_1.OilsController,
            consumption_equipment_controller_1.ConsumptionEquipmentController,
            group_oils_controller_1.GroupOilsController,
            equipment_system_controller_1.EquipmentSystemController,
            bunker_oil_controller_1.BunkerOilController,
            equipment_oil_compatibility_controller_1.EquipmentOilCompatibilityController,
            equipment_oil_compatibility_controller_1.EquipmentOilCompatibilityController,
        ],
        providers: [
            oils_service_1.OilsService,
            consumption_equipment_service_1.ConsumptionEquipmentService,
            group_oils_service_1.GroupOilsService,
            equipment_system_service_1.EquipmentSystemService,
            bunker_oil_service_1.BunkerOilService,
            equipment_oil_compatibility_service_1.EquipmentOilCompatibilityService,
            equipment_oil_compatibility_service_1.EquipmentOilCompatibilityService,
        ],
        exports: [consumption_equipment_service_1.ConsumptionEquipmentService],
    })
], OilsModule);
//# sourceMappingURL=oils.module.js.map