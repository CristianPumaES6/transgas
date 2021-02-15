import { Controller, Get, Param, Headers, HttpException, HttpStatus, Body, Post } from '@nestjs/common';
import { JwtDecode } from 'src/assets/jwtDecode.assets';
import { DummyPromise } from 'src/assets/promises.assets';
import { UserDetailEntity } from 'src/models/user-detail.entity';
import { UserEntity } from 'src/models/user.entity';
import { UserDetailsService } from './user-details.service';

@Controller('user-details')
export class UserDetailsController {

    constructor(
        private readonly _userDetailsService: UserDetailsService,
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
                let idDetail = Number(id);

                // Validamos que los datos recibidos sean los correctos.
                if (idDetail && headerToken.id) {

                    // Validamos si es un admin o un support.
                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                        // No hacemos nada.
                    } else {
                        // caso contrario verificamos si el id es el mismo.
                        if (headerToken.id !== id) throw new Error('ERROR_USERID_FAIL');
                    }

                    return this._userDetailsService.Get(idDetail);
                } else {
                    // caso contrario retornamos un error
                    throw new Error('MISSING_FIELS');
                }

            }
        ).then(
            (resultGet: UserDetailEntity) => {

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

    @Post('create')
    async CreateOrUpdate(@Headers() headers, @Body() userDetail: UserDetailEntity): Promise<any> {

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
                if (userDetail && userDetail.UserId) {

                    if (!userDetail.id) {
                        return this._userDetailsService.Update(userDetail);
                    } else {
                        // retornamos la respuesta del servicio.
                        return this._userDetailsService.Create(userDetail);
                    }
                } else {
                    // Enviar los datos necesarios.
                    throw 'MISSING_FIELS';
                }
            }
        ).then(
            (resultCreate: UserDetailEntity) => {

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
        );
    }


}
