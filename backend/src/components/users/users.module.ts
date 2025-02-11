import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// Dependencias TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../models/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { FOLDER_UPLOADS } from '../../config/path.config';

@Module({
  providers: [UsersService],
  controllers: [UsersController],

  //Importamos el TypeOrm con el modulo a usar, para que funcione en el servicio.
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MulterModule.register({
      dest: FOLDER_UPLOADS,
    }),
  ],
  // Exportamos el servicio para que lo usemos desde otro lado.
  exports: [UsersService],
})
export class UsersModule {}
