import { Body, Controller, Delete, Get, Headers, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { OilsService } from './oils.service';
import { DummyPromise } from '../../assets/promises.assets';
import { OilEntity } from '../../models/oil.entity';
import { UserEntity } from '../../models/user.entity';
import { JwtDecode } from '../../assets/jwtDecode.assets';
import { GetDate } from '../../assets/moment.assets';

@Controller('oils')
export class OilsController {

    
    constructor(
        private readonly _OilsService: OilsService,
    ) { }


    @Get (':id')
    async Get(@Param('id') id): Promise<any> {

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // Validamos que los datos recibidos sean los correctos.
                if (Number(id)) {
                    let userId = Number(id);
                    return this._OilsService.Get(userId);
                } else {
                    // caso contrario retornamos un error
                    throw 'MISSING_FIELS';
                }

            }
        ).then(
            (resultGet: OilEntity) => {

                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultGet
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    @Get()
    Gets(@Headers() headers, @Query() oilEntity: OilEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que los datos sean los necesarios.
                if (oilEntity) {

                    oilEntity.userId = Number(oilEntity.userId);
                    return true;

                } else throw new Error('MISSING_FIELS');

            }
        ).then(
            (resultValidate: Boolean) => {
                // Validamos que el userId sea el mismo que el del sailingAnality
                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                     // Nose hace nada
                } else if (oilEntity.userId !== headerToken.id) throw new Error('ERROR_USERID_FAIL');

                // Ejecutamos el servicio de obtener todos los reportes diarios segun filtro.
                return this._OilsService.Gets(oilEntity);
            }
        ).then(
            (results: OilEntity[]) => {

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

    @Post('create')
    Create(@Headers() headers, @Body() oilEntity: OilEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que esten llegando los datos necesarios.
                if (oilEntity && oilEntity.userId && oilEntity.name) {



                    delete oilEntity.id; 
                    // Auditoria.
                    oilEntity.userIdCreated = headerToken.id;
                    oilEntity.dateCreated = GetDate();
                    delete oilEntity.userIdUpdated;
                    delete oilEntity.dateUpdated;
                    oilEntity.status = Boolean(oilEntity.status);

                    // Ejecutamos la funcion que registra en bd.
                    return this._OilsService.Create(oilEntity);
                }
                else throw 'MISSING_FIELS';
            }
        ).then(
            (resultCreate: OilEntity) => {

                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultCreate
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );;
    }

    @Put(':id/update')
    async Update(@Headers() headers, @Param('id') id, @Body() oilEntity: OilEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {


                // Validamos los datos del objeto a registar.
                if (oilEntity && oilEntity.name && headerToken && headerToken.id) {
                    oilEntity.id = Number(id);

                    if (headerToken.role === 'SUPPORT' || headerToken.role === 'ADMIN') {

                    } else if (Number(headerToken.id) !== Number(oilEntity.userId)) throw new Error('ERROR_USERID_FAIL');


                    oilEntity.name = oilEntity.name || '';
         

                    // Auditoria.
                    delete oilEntity.userIdCreated;
                    delete oilEntity.dateCreated;
                    oilEntity.userIdUpdated = headerToken.id;
                    oilEntity.dateUpdated = GetDate();
                    oilEntity.status = Boolean(oilEntity.status);


                    // Ejecutamos la funcion que actualiza el obj en la bd.
                    return this._OilsService.Update(oilEntity);

                } else {

                    // Enviar los datos necesarios.
                    throw 'MISSING_FIELS';

                }
            }
        ).then(
            (resultUpdate: OilEntity) => {

                // Validamos el resultado
                if (!resultUpdate) throw new Error('TYPEORM_UPDATE_OIL_DETAIL');

                // Retornamos una! Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultUpdate
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

    @Delete(':id/delete')
    async Delete(@Headers() headers, @Param('id') id): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // Validamos que los datos sean los necesarios.
                if (Number(id)) {
                    // Decodeamos.
                    return this._OilsService.Get(id);

                } else {
                    // Enviar los datos necesarios.
                    throw new Error('MISSING_FIELS');

                }

            }
        ).then(
            (result: OilEntity) => {

                result.status = false;
                /* 
                delete result.userIdCreated;
                delete result.dateCreated;
                result.userIdUpdated = headerToken.id;
                result.dateUpdated =  GetDate();
 */
                // 


                
                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                    // No se hace nada
                } else if (Number(headerToken.id) !== Number(result.userId)) throw new Error('ERROR_USERID_FAIL');


                
                return this._OilsService.Delete(result, headerToken.id);
            }
        ).then(
            (resultDelete: OilEntity) => {

                // Retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultDelete
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );

    }

}
