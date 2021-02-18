import { Module } from '@nestjs/common';
import { VoyagesService } from './voyages.service';
import { VoyagesController } from './voyages.controller';

// modelos de ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voyage } from '../../models/voyage.entity';

@Module({  
  //Importamos el TypeOrm con el modulo a usar, para que funcione en el servicio.
  imports: [
    TypeOrmModule.forFeature([Voyage]),
  ],
  providers: [VoyagesService],
  controllers: [VoyagesController]
})
export class VoyagesModule {}
