import { Controller } from '@nestjs/common';
import { SendMessageService } from './send-message.service';
import { Query, Get, Post, Put, Delete, Body, UseGuards, Param, HttpException, HttpStatus, Headers } from '@nestjs/common';

// Assets || Si es una class lo tego que poner en el constructor y como provverdor del modulo
import { DummyPromise } from '../../assets/promises.assets';
import { JwtDecode } from '../../assets/jwtDecode.assets';

// 1 Importo los servicios

// Entity
import { ImportVoyage, Voyage, VoyageFilterByYears } from '../../models/voyage.entity';
import { UserEntity } from '../../models/user.entity';
import {
  ConvertDateUTC_To_FORMAT_UTC,
  ConvertMMDDYYYToYYYYMMDD,
  ConvertMomentUTC,
  FormatDateUTCToDateHour,
  GetDate,
} from '../../assets/moment.assets';
import { SendMessageEntity } from '../../models/send-message.entity';

@Controller('send-message')
export class SendMessageController {
  constructor(private readonly _sendMessageService: SendMessageService) {}

  @Get('configSendMail')
  async GetConfigSendMail(@Headers() headers, @Query() sendMessageEntity: SendMessageEntity): Promise<any> {
    // Le asigno el valor al token desde la cabecera.
    // Lo decodifico con otra libreria por problemas jwt-module.
    let headerToken: UserEntity = JwtDecode(headers.authorization);

    // Inicio una promesa Dummy.
    return DummyPromise()
      .then((resultDummy: Boolean) => {
        if (sendMessageEntity) {
          // Tiene que llegar el userId
          if (!sendMessageEntity.userId) {
            throw new Error('MISSING_FIELS');
          } else {
            // Validamos que el userId sea el mismo que el del token
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT' || headerToken.role == 'OWNER') {
              // Nose hace nada
            } else if (Number(sendMessageEntity.userId) !== Number(headerToken.id)) throw new Error('ERROR_USERID_FAIL');
            return true;
          }
        } else throw new Error('MISSING_FIELS');
      })
      .then((resultValidate: Boolean) => {
        // Deberiamos consultar que el rol que se desea agregar al envio automatico es rol buque

        // Ejecutamos el servicio de obtener sailingAnalities.
        return this._sendMessageService.BuscamosLaConfiracionDelBuque(sendMessageEntity);
      })
      .then((results: SendMessageEntity) => {
        // Retornamos una Respuesta exitosa.
        return {
          status: HttpStatus.OK,
          message: 'OK',
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

  @Post('saveConfig')
  async SaveConfig(@Headers() headers, @Body() sendMessageEntity: SendMessageEntity): Promise<any> {
    // Le asigno el valor al token desde la cabecera.
    // Lo decodifico con otra libreria por problemas jwt-module.
    let headerToken: UserEntity = JwtDecode(headers.authorization);

    return DummyPromise()
      .then((resultDummy: Boolean) => {
        // Validamos que esten llegando los datos necesarios.
        if (sendMessageEntity && sendMessageEntity.emails && sendMessageEntity.status) {
          if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
            // NO se hace nada
          } else if (sendMessageEntity.userId !== headerToken.id) throw new Error('ERROR_USERID_FAIL');

          if (Number(sendMessageEntity.id) > 0) {
            sendMessageEntity.id = Number(sendMessageEntity.id);
            sendMessageEntity.dateUpdated = GetDate();
            sendMessageEntity.userIdUpdated = headerToken.id;
          } else {
            delete sendMessageEntity.id;
            sendMessageEntity.dateCreated = GetDate();
            sendMessageEntity.userIdCreated = headerToken.id;
          }

          sendMessageEntity.status = Boolean(sendMessageEntity.status);

          return this._sendMessageService.Create(sendMessageEntity);
        } else throw 'MISSING_FIELS';
      })
      .then((resultSave: SendMessageEntity) => {
        // retornamos una Respuesta exitosa.
        return {
          status: HttpStatus.OK,
          message: 'OK',
          data: resultSave,
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
}
