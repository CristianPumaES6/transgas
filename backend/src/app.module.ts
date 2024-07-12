import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// TypeOrm
import { TypeOrmModule } from '@nestjs/typeorm';

// Others
import { join } from 'path';

// Path
import { SQLITE_PATH } from './config/path.config';
import { UsersModule } from './components/users/users.module';
import { AuthModule } from './components/auth/auth.module';
import { Moment } from 'moment';
import { VoyagesModule } from './components/voyages/voyages.module';

import { AppGateway } from './app.gateway';
import { FormatExcelLastVoyageService } from './services/format-excel-last-voyage/format-excel-last-voyage.service';
import { SendMessageModule } from './components/send-message/send-message.module';
import { OilsModule } from './components/oils/oils.module';

@Module({
 
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'sqlite',
//       database: join(SQLITE_PATH, 'dbTransgas.sqlite3'),
//       entities: [join(__dirname, '**/**.entity{.ts,.js}')],
//       synchronize: true,
//     }),  


             imports: [
               TypeOrmModule.forRoot({
                 type: 'mssql',
                 host: '4.227.179.75',
                 port: 1433,
                 username: 'User_sa',
                 password: 'Server_Admin',
                 database: 'FuelOilPlatformDB',
                 entities: [join(__dirname, '**/**.entity{.ts,.js}')],
                 synchronize: true,
                 options: {
                   encrypt: false,
                   enableArithAbort: true,
                 },
                 extra:{
                   trustServerCertificate: true,
                 }
               }),
    UsersModule,
    AuthModule,
    VoyagesModule,
    AppGateway,
    SendMessageModule,
    OilsModule,// por mientras queeste desactivado
  ],

  controllers: [AppController],
  providers: [AppService, 
    AppGateway, FormatExcelLastVoyageService // por mientras queeste desactivado
  ],
})
export class AppModule { }
