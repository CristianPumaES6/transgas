import { Controller, Get, Headers, HttpException, HttpStatus, Query } from '@nestjs/common';
import { EquipmentSystemService } from './type-of-oil-equiment.service';
import { EquipmentSystemEntity } from 'src/models/type-of-oils-equipment.entity';
import { UserEntity } from 'src/models/user.entity';
import { JwtDecode } from 'src/assets/jwtDecode.assets';
import { DummyPromise } from 'src/assets/promises.assets';

@Controller('type-of-oil-equipment')
export class EquipmentSystemController {


    constructor(
        private readonly _EquipmentSystemService: EquipmentSystemService ,
    ) { }


    @Get()
    Gets(@Headers() headers, @Query() equipmentSystemEntity: EquipmentSystemEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que los datos sean los necesarios.
                if (equipmentSystemEntity) {

                    equipmentSystemEntity.userId = Number(equipmentSystemEntity.userId);
                    return true;

                } else throw new Error('MISSING_FIELS');

            }
        ).then(
            (resultValidate: Boolean) => {
                // Validamos que el userId sea el mismo que el del sailingAnality
                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                  // Nose hace nada
                } else if (equipmentSystemEntity.userId !== headerToken.id) throw new Error('ERROR_USERID_FAIL');

                // Ejecutamos el servicio de obtener todos los reportes diarios segun filtro.
                return this._EquipmentSystemService.Gets(equipmentSystemEntity);
            }
        ).then(
            (results: EquipmentSystemEntity[]) => {

                // Retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: results
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // Caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

 

}
