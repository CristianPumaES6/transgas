import { Controller, Query, Get, Post, Put, Delete, Body, UseGuards, Param, HttpException, HttpStatus, Headers } from '@nestjs/common';

// Assets || Si es una class lo tego que poner en el constructor y como provverdor del modulo
import { DummyPromise } from '../../assets/promises.assets';
import { JwtDecode } from '../../assets/jwtDecode.assets';

// 1 Importo los servicios
import { VoyagesService } from './voyages.service';

// Entity
import { Voyage, VoyageFilterByYears } from '../../models/voyage.entity';
import { UserEntity } from '../../models/user.entity';
import { getDate } from '../../assets/moment.assets';


@Controller('voyages')
export class VoyagesController {

    constructor(
        private readonly _voyagesService: VoyagesService,
    ) { }


    @Get('byYears')
    async GetsByYear(@Headers() headers, @Query() voyageFilterByYears: VoyageFilterByYears): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                if (voyageFilterByYears) {
                    // Tiene que llegar el userId
                    if (!voyageFilterByYears.userId) {
                        throw new Error('MISSING_FIELS');
                    } else {
                        // Validamos que el userId sea el mismo que el del token
                        if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                            // Nose hace nada
                        } else if ((Number(voyageFilterByYears.userId) !== Number(headerToken.id))) throw new Error('ERROR_USERID_FAIL');
                        return true;
                    }
                } else throw new Error('MISSING_FIELS');


            }
        ).then(
            (resultValidate: Boolean) => {


                voyageFilterByYears.years = JSON.parse('' + voyageFilterByYears.years);
                // Ejecutamos el servicio de obtener sailingAnalities.
                return this._voyagesService.GetsByYears(voyageFilterByYears);
            }
        ).then(
            (results: Voyage[]) => {

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

    @Get('detail')
    async GetsDetail(@Headers() headers, @Query() voyage: Voyage, @Query('page') page: number): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                if (voyage) {
                    // Si no existe el user id tiene que ser admin o suppor para seguir
                    if (!voyage.userId) {
                        if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                            return true;
                        } else throw new Error('MISSING_FIELS');
                    } else {
                        // Validamos que el userId sea el mismo que el del token
                        if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                            // Nose hace nada
                        } else if ((Number(voyage.userId) !== Number(headerToken.id))) throw new Error('ERROR_USERID_FAIL');
                        return true;
                    }
                } else throw new Error('MISSING_FIELS');


            }
        ).then(
            (resultValidate: Boolean) => {

                // Ejecutamos el servicio de obtener sailingAnalities.
                return this._voyagesService.GetsDetails(voyage, page);
            }
        ).then(
            (results: Voyage[]) => {

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

    @Get(':id')
    async Get(@Param('id') id): Promise<any> {

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // Validamos que los datos recibidos sean los correctos.
                if (Number(id)) {
                    let voyageId = Number(id);
                    return this._voyagesService.Get(voyageId);
                } else {
                    // caso contrario retornamos un error
                    throw 'MISSING_FIELS';
                }

            }
        ).then(
            (resultGet: Voyage) => {

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

                // Caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    @Get()
    async Gets(@Headers() headers, @Query() voyage: Voyage, @Query('page') page: number): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // Validamos que los datos sean los necesarios.
                if (voyage) {
                    // Si no existe el user id tiene que ser admin o suppor para seguir
                    if (!voyage.userId) {
                        if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                            return true;
                        } else throw new Error('MISSING_FIELS');
                    } else {
                        // Validamos que el userId sea el mismo que el del token
                        if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                            // Nose hace nada
                        } else if (Number(voyage.userId) !== Number(headerToken.id)) throw new Error('ERROR_USERID_FAIL');
                        return true;
                    }
                } else throw new Error('MISSING_FIELS');


            }
        ).then(
            (resultValidate: Boolean) => {

                // Ejecutamos el servicio de obtener sailingAnalities.
                return this._voyagesService.Gets(voyage, page);
            }
        ).then(
            (results: Voyage[]) => {

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
    async CreateVoyage(@Headers() headers, @Body() voyage: Voyage): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que esten llegando los datos necesarios.
                if (voyage && Number(voyage.userId) && Number(voyage.voyageNumber) && Number(voyage.year) && headerToken && headerToken.id) {

                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                        // NO se hace nada
                    } else if (voyage.userId !== headerToken.id) throw new Error('ERROR_USERID_FAIL');

                    // Auditoria.
                    voyage.userIdCreated = headerToken.id;
                    voyage.dateCreated = getDate();
                    delete voyage.userIdUpdated;
                    delete voyage.dateUpdated;
                    voyage.status = Boolean(voyage.status);
                    // Ejecutamos la funcion que registra en bd.
                    return this._voyagesService.Create(voyage);
                }
                else throw 'MISSING_FIELS';
            }
        ).then(
            (resultCreate: Voyage) => {

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


                // Caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    @Put(':id/update')
    async Update(@Headers() headers, @Param('id') id, @Body() voyage: Voyage): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // Validamos los datos del objeto a registar.
                if (voyage && voyage.userId && voyage.voyageNumber && voyage.year && headerToken && headerToken.id) {
                    voyage.id = Number(id);

                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                        // No se hace nada
                    } else if (Number(headerToken.id) !== Number(voyage.userId)) throw new Error('ERROR_USERID_FAIL');

                    // Auditoria.
                    delete voyage.userIdCreated;
                    delete voyage.dateCreated;
                    voyage.userIdUpdated = headerToken.id;
                    voyage.dateUpdated = getDate();
                    voyage.status = Boolean(voyage.status);
                    // Ejecutamos la funcion que actualiza el obj en la bd.
                    return this._voyagesService.Update(voyage);

                } else {

                    // Enviar los datos necesarios.
                    throw 'MISSING_FIELS';

                }
            }
        ).then(
            (resultUpdate: Voyage) => {

                // Validamos el resultado
                if (!resultUpdate) throw new Error('TYPEORM_UPDATE_VOYAGE');

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
    async DeletePort(@Headers() headers, @Param('id') id): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // Validamos que los datos sean los necesarios.
                if (Number(id)) {
                    // Decodeamos.
                    return this._voyagesService.Get(id);

                } else {
                    // Enviar los datos necesarios.
                    throw new Error('MISSING_FIELS');

                }

            }
        ).then(
            (result: Voyage) => {

                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                    // No se hace nada
                } else if (Number(headerToken.id) !== Number(result.userId)) throw new Error('ERROR_USERID_FAIL');

                result.status = false;

                delete result.userIdCreated;
                delete result.dateCreated;
                result.userIdUpdated = headerToken.id;
                result.dateUpdated = getDate();
                return this._voyagesService.Delete(result);
            }
        ).then(
            (resultDelete: Voyage) => {

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
