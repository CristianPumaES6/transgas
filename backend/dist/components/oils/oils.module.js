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
let OilsModule = class OilsModule {
};
OilsModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([oil_entity_1.OilEntity, consumptionEquipment_entity_1.ConsumptionEquipmentEntity, group_oils_entity_1.GroupOilEntity, buker_oil_entity_1.BunkerOil, equipment_system_entity_1.EquipmentSystemEntity]),
        ],
        controllers: [oils_controller_1.OilsController, consumption_equipment_controller_1.ConsumptionEquipmentController, group_oils_controller_1.GroupOilsController, equipment_system_controller_1.EquipmentSystemController, bunker_oil_controller_1.BunkerOilController],
        providers: [oils_service_1.OilsService, consumption_equipment_service_1.ConsumptionEquipmentService, group_oils_service_1.GroupOilsService, equipment_system_service_1.EquipmentSystemService, bunker_oil_service_1.BunkerOilService],
        exports: [consumption_equipment_service_1.ConsumptionEquipmentService]
    })
], OilsModule);
exports.OilsModule = OilsModule;
//# sourceMappingURL=oils.module.js.map