import { Body, Controller, Delete, Get, Headers, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { DummyPromise } from '../../../assets/promises.assets';
import { UserEntity } from '../../../models/user.entity';
import { JwtDecode } from '../../../assets/jwtDecode.assets';
import { GetDate } from '../../../assets/moment.assets';
import { ConsumptionEquipmentService } from './consumption-equipment.service';
import { ConsumptionEquipmentEntity } from '../../../models/consumptionEquipment.entity';
import { Mapping, searchKey } from '../../../assets/mappingKeys';

@Controller('consumption-equipment')
export class ConsumptionEquipmentController {

    
    constructor(
        private readonly _ConsumptionEquipmentService: ConsumptionEquipmentService,
    ) { }



    @Get()
    Gets(@Headers() headers, @Query() consumptionEquipment: ConsumptionEquipmentEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que los datos sean los necesarios.
                if (consumptionEquipment) {

                    consumptionEquipment.userId = Number(consumptionEquipment.userId);
                    return true;

                } else throw new Error('MISSING_FIELS');

            }
        ).then(
            (resultValidate: Boolean) => {
                // Validamos que el userId sea el mismo que el del sailingAnality
                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                   // Nose hace nada
                } else if (consumptionEquipment.userId !== headerToken.id) throw new Error('ERROR_USERID_FAIL');

                // Ejecutamos el servicio de obtener todos los reportes diarios segun filtro.
                return this._ConsumptionEquipmentService.Gets(consumptionEquipment);
            }
        ).then(
            (results: ConsumptionEquipmentEntity[]) => {

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
