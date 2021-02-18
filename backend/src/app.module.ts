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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(SQLITE_PATH, 'dbTransgas.sqlite3'),
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
