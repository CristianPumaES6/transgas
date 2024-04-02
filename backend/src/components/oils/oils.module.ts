import { Module } from '@nestjs/common';
import { OilsController } from './oils.controller';
import { OilsService } from './oils.service';
import { OilEntity } from 'src/models/oil.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumptionEquipmentController } from './consumption-equipment/consumption-equipment/consumption-equipment.controller';
import { ConsumptionEquipmentService } from './consumption-equipment/consumption-equipment/consumption-equipment.service';
import { GroupOilsController } from './group-oils/group-oils.controller';
import { GroupOilsService } from './group-oils/group-oils.service';
import { TypeOfOilEquipmentController } from './type-of-oil-equiment/type-of-oil-equiment.controller';

import { BunkerOilToEquipmentController } from './bunker-oil-to-equipment/bunker-oil-to-equipment.controller';
import { BunkerOilToEquipmentService } from './bunker-oil-to-equipment/bunker-oil-to-equipment.service';
import { ConsumptionEquipmentEntity } from 'src/models/consumptionEquipment.entity';

import { GroupOilEntity } from 'src/models/group-oils.entity';
import { BunkerOilToEquipmentEntity } from 'src/models/buker-oil-to-equipment.entity';
import { TypeOfOilEquipmentEntity } from 'src/models/type-of-oils-equipment.entity';
import { TypeOfOilEquipmentService } from './type-of-oil-equiment/type-of-oil-equiment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OilEntity,ConsumptionEquipmentEntity,GroupOilEntity,BunkerOilToEquipmentEntity,TypeOfOilEquipmentEntity]),
  ],
  controllers: [OilsController, ConsumptionEquipmentController, GroupOilsController, TypeOfOilEquipmentController, BunkerOilToEquipmentController],
  providers: [OilsService, ConsumptionEquipmentService, GroupOilsService, TypeOfOilEquipmentService, BunkerOilToEquipmentService],
  exports: [ConsumptionEquipmentService] 
})
export class OilsModule {}
