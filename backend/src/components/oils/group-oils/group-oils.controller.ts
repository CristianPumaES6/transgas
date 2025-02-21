import { Controller, Get, Headers, HttpException, HttpStatus, Query } from '@nestjs/common';
import { JwtDecode } from '../../../assets/jwtDecode.assets';
import { DummyPromise } from '../../../assets/promises.assets';
import { GroupOilEntity } from '../../../models/group-oils.entity';
import { GroupOilsService } from './group-oils.service';
import { UserEntity } from '../../../models/user.entity';

@Controller('group-oils')
export class GroupOilsController {
  constructor(private readonly _GroupOilEntityService: GroupOilsService) {}

  @Get()
  Gets(@Headers() headers, @Query() groupOilEntity: GroupOilEntity): Promise<any> {
    // Le asigno el valor al token desde la cabecera.
    // Lo decodifico con otra libreria por problemas jwt-module.
    let headerToken: UserEntity = JwtDecode(headers.authorization);

    // Inicio una promesa Dummy.
    return DummyPromise()
      .then((resultDummy: Boolean) => {
        // Validamos que los datos sean los necesarios.
        if (groupOilEntity) {
          groupOilEntity.userId = Number(groupOilEntity.userId);
          return true;
        } else throw new Error('MISSING_FIELS');
      })
      .then((resultValidate: Boolean) => {
        // Validamos que el userId sea el mismo que el del sailingAnality
        if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
          // Nose hace nada
        } else if (groupOilEntity.userId !== headerToken.id) throw new Error('ERROR_USERID_FAIL');

        // Ejecutamos el servicio de obtener todos los reportes diarios segun filtro.
        return this._GroupOilEntityService.Gets(groupOilEntity);
      })
      .then((results: GroupOilEntity[]) => {
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
}
