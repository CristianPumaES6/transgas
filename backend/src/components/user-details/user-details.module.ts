import { Module } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { UserDetailsController } from './user-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetailEntity } from 'src/models/user-detail.entity';

@Module({  
  //Importamos el TypeOrm con el modulo a usar, para que funcione en el servicio.
  imports: [
    TypeOrmModule.forFeature([UserDetailEntity]),
  ],
  providers: [UserDetailsService],
  controllers: [UserDetailsController]
})
export class UserDetailsModule {}
