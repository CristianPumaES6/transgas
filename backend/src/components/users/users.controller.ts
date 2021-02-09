import { Controller, Query, Get, Post, Put, Delete, Body, UseGuards, Param, HttpException, HttpStatus, Headers } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// Si es una class lo tego que poner en el constructor y como proverdor del modulo
// 1 Importo los servicios
import { UsersService } from './users.service';

import { DummyPromise } from '../../assets/promises.assets';
import { JwtDecode } from '../../assets/jwtDecode.assets';

// Entity
import { UserEntity } from '../../models/user.entity';

@Controller('users')
export class UsersController {

    constructor(
        private readonly _usersService: UsersService,
    ) { }

    @Get(':id')
    async Get(@Headers() headers, @Param('id') id): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (result: Boolean) => {

                // Convertimos a numeros.
                let userId = Number(id);

                // Validamos que los datos recibidos sean los correctos.
                if (userId && headerToken.id) {

                    // Validamos si es un admin o un support.
                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                        // No hacemos nada.
                    } else {
                        // caso contrario verificamos si el id es el mismo.
                        if (headerToken.id !== id) throw new Error('ERROR_USERID_FAIL');
                    }

                    return this._usersService.Get(userId);


                } else {
                    // caso contrario retornamos un error
                    throw new Error('MISSING_FIELS');
                }

            }
        ).then(
            (resultGet: UserEntity) => {

                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.ACCEPTED,
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
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.NOT_ACCEPTABLE);
            }
        );
    }

    // Solo si eres admin podras consultar por todos los usurios.
    @Get()
    Gets(@Headers() headers, @Query() user: UserEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que los datos sean los necesarios.
                if (headerToken && (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') && user) {

                    // Ejecutamos el servicio de obtener sailingAnalities.
                    return this._usersService.Gets(user);

                } else throw new Error('MISSING_FIELS');

            }
        ).then(
            (results: UserEntity[]) => {

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
    Create(@Headers() headers, @Body() user: UserEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // que solo puedan registrar un nuevo usuario los administradores o support.
                if (!(headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT')) {
                    throw new Error('Se esta intentado registrar con un rol no valido.');
                }

                // Validamos que los datos sean los necesarios.
                if (user && user.name && user.nick && user.password && user.role) {
                    user.status = true;
                    // retornamos la respuesta del servicio.
                    return this._usersService.CreateUserNickUnique(user);
                } else {
                    // Enviar los datos necesarios.
                    throw 'MISSING_FIELS';
                }
            }
        ).then(
            (resultCreate: UserEntity) => {

                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.CREATED,
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
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: clientMsg,
                    message: errorMsg,
                }, 202);
            }
        );
    }

    @Put(':id/update')
    async UpdateUser(@Headers() headers, @Param('id') id, @Body() user: UserEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // que solo puedan registrar un nuevo usuario los administradores o support.
                if (!(headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT')) {
                    throw new Error('Se esta intentado registrar con un rol no valido.');
                }

                if (!isNaN(id) && user && user.name && user.nick && user.password && user.role) {
                    user.id = Number(id);
                    user.status = true;
                    // retornamos la respuesta del servicio.
                    return this._usersService.UpdateUserNickUnique(user);
                } else {
                    // caso contrario retornamos un error
                    throw 'MISSING_FIELS';
                }
            }
        ).then(
            (resultUpdate: UserEntity) => {

                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.CREATED,
                    message: 'OK',
                    data: resultUpdate
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: clientMsg,
                    message: errorMsg,
                }, 202);
            }
        );


    }

    @Delete(':id/delete')
    async delete(@Headers() headers, @Param('id') id): Promise<any> {


        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);


        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // que solo puedan registrar un nuevo usuario los administradores o support.
                if (!(headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT')) {
                    throw new Error('Se esta intentado registrar con un rol no valido.');
                }

                // Validamos que esten los campos necesarios.
                if (Number(id)) {
                    // retornamos la respuesta del servicio.
                    return this._usersService.Delete(id);
                } else {
                    // aso contrario retornamos un error
                    throw new Error('MISSING_FIELS');
                }
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: clientMsg,
                    message: errorMsg,
                }, 202);
            }
        );
    }
}
