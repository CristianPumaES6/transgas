import { Module } from '@nestjs/common';
import { OilsController } from './oils.controller';
import { OilsService } from './oils.service';
import { OilEntity } from 'src/models/oil.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumptionEquipmentController } from './consumption-equipment/consumption-equipment.controller';
import { ConsumptionEquipmentService } from './consumption-equipment/consumption-equipment.service';
import { GroupOilsController } from './group-oils/group-oils.controller';
import { GroupOilsService } from './group-oils/group-oils.service';
import { EquipmentSystemController } from './equipment-system/equipment-system.controller';

import { BunkerOilController } from './bunker-oil/bunker-oil.controller';
import { BunkerOilService } from './bunker-oil/bunker-oil.service';
import { ConsumptionEquipmentEntity } from 'src/models/consumptionEquipment.entity';

import { GroupOilEntity } from 'src/models/group-oils.entity';
import { BunkerOil } from 'src/models/buker-oil.entity';
import { EquipmentSystemEntity } from 'src/models/equipment-system.entity';
import { EquipmentSystemService } from './equipment-system/equipment-system.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OilEntity,ConsumptionEquipmentEntity,GroupOilEntity,BunkerOil,EquipmentSystemEntity]),
  ],
  controllers: [OilsController, ConsumptionEquipmentController, GroupOilsController, EquipmentSystemController, BunkerOilController],
  providers: [OilsService, ConsumptionEquipmentService, GroupOilsService, EquipmentSystemService, BunkerOilService],
  exports: [ConsumptionEquipmentService] 
})
export class OilsModule {}
