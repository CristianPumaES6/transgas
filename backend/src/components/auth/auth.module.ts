import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

import { JWTCONFIG } from '../../config/jwt.config';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

// modelos de ORM
import { UsersModule } from '../users/users.module';


@Module({
  
  providers: [AuthService, LocalStrategy, JwtStrategy],
  // Importamos los modulos que usaremos.
  imports: [
    JwtModule.register(JWTCONFIG),
    UsersModule,
  ],
  // Exports son los servicios que deseamos exportar para que otros modulos puedan importarlos.
  exports: [AuthService],
})
export class AuthModule { }
