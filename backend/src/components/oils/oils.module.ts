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

import { BunkerOilController } from './bunker-oil-to-equipment/bunker-oil.controller';
import { BunkerOilService } from './bunker-oil-to-equipment/bunker-oil.service';
import { ConsumptionEquipmentEntity } from 'src/models/consumptionEquipment.entity';

import { GroupOilEntity } from 'src/models/group-oils.entity';
import { BunkerOil } from 'src/models/buker-oil-to-equipment.entity';
import { TypeOfOilEquipmentEntity } from 'src/models/type-of-oils-equipment.entity';
import { TypeOfOilEquipmentService } from './type-of-oil-equiment/type-of-oil-equiment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OilEntity,ConsumptionEquipmentEntity,GroupOilEntity,BunkerOil,TypeOfOilEquipmentEntity]),
  ],
  controllers: [OilsController, ConsumptionEquipmentController, GroupOilsController, TypeOfOilEquipmentController, BunkerOilController],
  providers: [OilsService, ConsumptionEquipmentService, GroupOilsService, TypeOfOilEquipmentService, BunkerOilService],
  exports: [ConsumptionEquipmentService] 
})
export class OilsModule {}
