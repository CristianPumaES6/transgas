import { Controller, Get, Post, Body, UseGuards, Request, HttpException, HttpStatus, Param, Headers, Res, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

// modelos
import { UserEntity } from './models/user.entity';

// servicios
import { AuthService } from './components/auth/auth.service';
import { UsersService } from './components/users/users.service';

// Assets || Si es una class lo tego que poner en el constructor y como provverdor del modulo
import { DummyPromise } from './assets/promises.assets';
import { LoggedUser } from './models/loggedUser';
import { URL_Server } from './config/server.config';
import { AppGateway } from './app.gateway';
import { ConsumptionEquipmentService } from './components/oils/consumption-equipment/consumption-equipment.service';
import { Response } from 'express'; // Asegúrate de que esto esté correcto
import { isBuffer } from 'util';

import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly _ConsumptionEquipmentService: ConsumptionEquipmentService,
    private readonly _AppGateway: AppGateway,
  ) {}

  // Este servicio es para pruebas sin necesidad de tener un token.
  @Get('pruebas')
  Pruebas(@Body() body: any): Promise<any> {
    return DummyPromise()
      .then((result: Boolean) => {
        // Enviamos el mail de prueba.

        return 'PRUEBA :)';
      })
      .catch(err => {
        // Obtengo mensajes de error
        const clientMsg: string = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
        const errorMsg: string = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';

        // caso contrario retornamos un error
        throw new HttpException(
          {
            status: HttpStatus.ACCEPTED,
            error: clientMsg,
            message: errorMsg,
          },
          HttpStatus.ACCEPTED,
        );
      });
  }

  // Consulta para saber que version de proyecto tenemos.
  @Get('platform-version')
  GetVersionPlataform(): any {
    //Obtenemos la version desde el archivo de ocnfiguracion.
    let version = URL_Server.version;

    // Enviamos la estructura de los request.
    return {
      status: HttpStatus.OK,
      data: version,
    };
  }

  // Guards(jwt)  valida que el token no halla caducado y exista, caso contrario invoca un error.
  @UseGuards(AuthGuard('jwt'))
  @Get('testToken')
  getHello(): any {
    let version = URL_Server.version;
    return {
      status: HttpStatus.OK,
      data: version,
    };
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    const user: UserEntity = req.user;

    // El dato que viene desde el parametro es cambiado por el Guards.
    return await DummyPromise()
      .then(result => {
        if (!result) throw Error('Error DummyPromise()');

        if (!user) throw Error('No tiene dato el objUser');

        return this.authService.generateTokenForGuards(user);
      })
      .then((resultGenerateToken: string) => {
        if (!resultGenerateToken) throw Error('Revisar la funcion this.authService.generateTokenForGuards(req.user);');

        return {
          status: HttpStatus.CREATED,
          message: 'OK',
          data: user,
          token: resultGenerateToken,
        };
      })
      .catch(err => {
        // Obtengo mensajes de error
        const clientMsg: string = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
        const errorMsg: string = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';

        // caso contrario retornamos un error
        throw new HttpException(
          {
            status: HttpStatus.ACCEPTED,
            error: clientMsg,
            message: errorMsg,
          },
          HttpStatus.ACCEPTED,
        );
      });
  }

  // Registramos o actualizamos al usuario logeado
  @Post('loggedUsers')
  async loggedUsers(@Headers() headers, @Body() loggedUser: LoggedUser): Promise<any> {
    //console.log("@Post('loggedUsers')");

    return await DummyPromise()
      .then((resultDummy: Boolean) => {
        return this._AppGateway.IsUserLogeatedExit(loggedUser);
      })
      .then((results: boolean) => {
        // Retornamos una Respuesta exitosa.
        return {
          status: HttpStatus.OK,
          message: 'OK REGISTER',
          data: results,
        };
      })
      .catch(err => {
        // Obtengo mensajes de error
        const clientMsg: string = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
        const errorMsg: string = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';

        // Caso contrario retornamos un error
        throw new HttpException(
          {
            status: HttpStatus.ACCEPTED,
            error: clientMsg,
            message: errorMsg,
          },
          HttpStatus.ACCEPTED,
        );
      });
  }

  // Obtenemos los usuarios logeados.
  @Get('loggedUsers')
  async GetLoggedUsers(@Headers() headers, @Query() loggedUser: LoggedUser): Promise<any> {
    //console.log("@Get('loggedUsers')");

    return await DummyPromise()
      .then(result => {
        return this._AppGateway.GetLoggedUsers();
      })
      .then((resultLoggedUsers: LoggedUser[]) => {
        // Retornamos una Respuesta exitosa.
        return {
          status: HttpStatus.OK,
          message: 'OK REGISTER',
          data: resultLoggedUsers,
        };
      })
      .catch(err => {
        // Obtengo mensajes de error
        const clientMsg: string = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
        const errorMsg: string = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';

        // Caso contrario retornamos un error
        throw new HttpException(
          {
            status: HttpStatus.ACCEPTED,
            error: clientMsg,
            message: errorMsg,
          },
          HttpStatus.ACCEPTED,
        );
      });
  }

  // Emitimos una solicitud de que usuarios estan conectados
  @Post('emitConnect')
  async EmitConnect(): Promise<any> {
    //  console.log("EmitConnect()");

    return await DummyPromise()
      .then((resultDummy: Boolean) => {
        return this.appService.EmitConnect();
      })
      .then((resultEmitConnect: boolean) => {
        // Retornamos una Respuesta exitosa.
        return {
          status: HttpStatus.OK,
          message: 'Send Emit Connect',
          data: resultEmitConnect,
        };
      })
      .catch(err => {
        // Obtengo mensajes de error
        const clientMsg: string = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
        const errorMsg: string = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';

        // Caso contrario retornamos un error
        throw new HttpException(
          {
            status: HttpStatus.ACCEPTED,
            error: clientMsg,
            message: errorMsg,
          },
          HttpStatus.ACCEPTED,
        );
      });
  }

  @Get('ListConsumptionLubricantPerMonth/:userId/:startDate/:endDate')
  async ConsultaGeneral(@Param('userId') buqueId, @Param('startDate') startDate, @Param('endDate') endDate) {
    return await DummyPromise().then((resultDummy: Boolean) => {
      let userId = Number(buqueId);
      console.log('ListConsumptionLubricantPerMonth');
      console.log('buqueId : ' + buqueId);
      console.log('startDate : ' + startDate);
      console.log('endDate : ' + endDate);

      return this.appService.ListConsumptionLubricantPerMonth(userId, startDate, endDate);
    });
  }

  @Get('GetOilAnalysis/:userId/:ETM_OilAnalysis_Oid')
  async GetOilAnalysis(@Param('userId') buqueId, @Param('ETM_OilAnalysis_Oid') ETM_OilAnalysis_Oid) {
    return await DummyPromise().then((resultDummy: Boolean) => {
      let buque = Number(buqueId);

      return this.appService.GetOilAnalysis(buque, ETM_OilAnalysis_Oid);
    });
  }

  @Get('ViewFileAnalysisOil/:userId/:tmOid')
  async ViewFileAnalysis(@Param('userId') buqueId, @Param('ETM_OilAnalysis_Oid') ETM_OilAnalysis_Oid, @Res() res: Response) {
    return await DummyPromise()
      .then((resultDummy: Boolean) => {
        let buque = Number(buqueId);

        return this.appService.ViewFileAnalysisOil(buque, ETM_OilAnalysis_Oid);
      })
      .then(
        // Resultado de la BD
        resutlViewFileAnalysisOil => {
          // obtenemos el valor de la columna donde se encuentra el archivo guardad
          let fileAnalysisOil = resutlViewFileAnalysisOil[0];

          let pdfBuffer = fileAnalysisOil.Content;

          // Define la ruta donde se guardará el archivo
          const uploadsDir = path.join(__dirname, '..', 'uploads');
          const filePath = path.join(uploadsDir, fileAnalysisOil.Filename);

          // Asegurarse de que el directorio 'uploads' existe
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }

          // Verificar si realmente es un Buffer
          if (!Buffer.isBuffer(pdfBuffer)) {
            console.error('Error: El contenido no es un Buffer.');
            return;
          }

          return fs.writeFileSync(filePath, pdfBuffer, 'binary');
        },
      )
      .then(result => {
        // Configura los encabezados de respuesta
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="archivo.pdf"',
        });

        // Envía el buffer como respuesta
        return res.send('ok');
      })
      .catch(err => {
        res.status(HttpStatus.NOT_FOUND).send('Archivo no encontrado');
      });
  }

  @Get('ConsultEquipmentConsumptionByMonthUser/:userId/:EquipmentId/:YEAR_MONTH')
  async ConsultEquipmentConsumptionByMonthUser(@Param('userId') buqueId, @Param('EquipmentId') EquipmentId, @Param('YEAR_MONTH') YEAR_MONTH) {
    return await DummyPromise().then((resultDummy: Boolean) => {
      console.log('ConsultEquipmentConsumptionByMonthUser/:userId/:EquipmentId/:YEAR_MONTH');
      console.log('userID:' + buqueId);
      console.log('EquipmentId:' + EquipmentId);
      console.log('YEAR_MONTH:' + YEAR_MONTH);

      let userId = Number(buqueId);
      let entityEquipmentId = Number(EquipmentId);
      let DateYEAR_MONTH = YEAR_MONTH;

      return this.appService.consultEquipmentConsumptionByMonthUser(userId, entityEquipmentId, DateYEAR_MONTH);
    });
  }

  @Get('Ships')
  async GetShips() {
    return await DummyPromise().then((resultDummy: Boolean) => {
      return this.appService.GetShips();
    });
  }

  @Get('GetStatusOilStartEndDate/:userId/:startDate/:endDate')
  async GetStatusOilStartEnd(@Param('userId') userId, @Param('startDate') startDate, @Param('endDate') endDate) {
    return await DummyPromise().then((resultDummy: Boolean) => {
      console.log('GetStatusOilStartEndDate/:userId/:startDate/:endDate');
      console.log('userId:' + userId);
      console.log('startDate:' + startDate);
      console.log('endDate:' + endDate);
      return this._ConsumptionEquipmentService.GetStatusOilStartEnd(userId, startDate, endDate);
    });
  }

  @Get('GetInfoAllVessel/:startDate/:endDate')
  async GetInfoAllVessel(@Param('userId') userId, @Param('startDate') startDate, @Param('endDate') endDate) {
    return await DummyPromise().then((resultDummy: Boolean) => {
      return this._ConsumptionEquipmentService.GetInfoAllVessel(startDate, endDate);
    });
  }
}
