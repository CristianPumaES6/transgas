import { Module } from '@nestjs/common';
import { OilsController } from './oils.controller';
import { OilsService } from './oils.service';
import { OilEntity } from '../../models/oil.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumptionEquipmentController } from './consumption-equipment/consumption-equipment.controller';
import { ConsumptionEquipmentService } from './consumption-equipment/consumption-equipment.service';
import { GroupOilsController } from './group-oils/group-oils.controller';
import { GroupOilsService } from './group-oils/group-oils.service';
import { EquipmentSystemController } from './equipment-system/equipment-system.controller';

import { BunkerOilController } from './bunker-oil/bunker-oil.controller';
import { BunkerOilService } from './bunker-oil/bunker-oil.service';
import { ConsumptionEquipmentEntity } from '../../models/consumptionEquipment.entity';

import { GroupOilEntity } from '../../models/group-oils.entity';
import { BunkerOil } from '../../models/buker-oil.entity';
import { EquipmentSystemEntity } from '../../models/equipment-system.entity';
import { EquipmentSystemService } from './equipment-system/equipment-system.service';
import { EquipmentOilCompatibilityService } from './equipment-oil-compatibility/equipment-oil-compatibility.service';
import { EquipmentOilCompatibilityController } from './equipment-oil-compatibility/equipment-oil-compatibility.controller';
import { EquipmentOilCompatibilityEntity } from'../../models/equipment-oil-compatibility.entity';
import { OilPriceHistory } from '../../models/oilPriceHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OilEntity,OilPriceHistory,ConsumptionEquipmentEntity,GroupOilEntity,BunkerOil,EquipmentSystemEntity,EquipmentOilCompatibilityEntity]),
  ],
  controllers: [OilsController, ConsumptionEquipmentController, GroupOilsController, EquipmentSystemController, BunkerOilController, EquipmentOilCompatibilityController,EquipmentOilCompatibilityController],
  providers: [OilsService, ConsumptionEquipmentService, GroupOilsService, EquipmentSystemService, BunkerOilService, EquipmentOilCompatibilityService,EquipmentOilCompatibilityService ],
  exports: [ConsumptionEquipmentService] 
})
export class OilsModule {}
