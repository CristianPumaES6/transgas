import { Body, Controller, Delete, Get, Headers, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { JwtDecode } from 'src/assets/jwtDecode.assets';
import { GetDate } from 'src/assets/moment.assets';
import { DummyPromise } from 'src/assets/promises.assets';
import { DailyReport, GetROBByUser } from 'src/models/daily-report.entity';
import { UserEntity } from 'src/models/user.entity';
import { DailyReportsService } from './daily-reports.service';

@Controller('daily-reports')
export class DailyReportsController {

    constructor(
        private readonly _dailyReportsService: DailyReportsService,
    ) { }


    @Get(':id')
    async Get(@Param('id') id): Promise<any> {

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // Validamos que los datos recibidos sean los correctos.
                if (Number(id)) {
                    let userId = Number(id);
                    return this._dailyReportsService.Get(userId);
                } else {
                    // caso contrario retornamos un error
                    throw 'MISSING_FIELS';
                }

            }
        ).then(
            (resultGet: DailyReport) => {

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
    Gets(@Headers() headers, @Query() dailyReport: DailyReport): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que los datos sean los necesarios.
                if (dailyReport) {

                    dailyReport.userId = Number(dailyReport.userId);
                    return true;

                } else throw new Error('MISSING_FIELS');

            }
        ).then(
            (resultValidate: Boolean) => {
                // Validamos que el userId sea el mismo que el del sailingAnality
                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                    dailyReport.userId = null;
                } else if (dailyReport.userId !== headerToken.id) throw new Error('ERROR_USERID_FAIL');

                // Ejecutamos el servicio de obtener todos los reportes diarios segun filtro.
                return this._dailyReportsService.Gets(dailyReport);
            }
        ).then(
            (results: DailyReport[]) => {

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

    
    @Get('get-rob/:userId')
    GetROBByBuque(@Headers() headers,@Param('userId') userId:number): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que los datos sean los necesarios.
                if (userId) {

                    return true;

                } else throw new Error('MISSING_FIELS');

            }
        ).then(
            (resultValidate: Boolean) => {

                // Validamos que el userId sea el mismo que el del sailingAnality
                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                    return true;
                } else if (userId !== headerToken.id) throw new Error('ERROR_USERID_FAIL');

            }
        ).then(
            (resultValidate: Boolean) => {
                
                // Ejecutamos el servicio de obtener todos los reportes diarios segun filtro.
                return this._dailyReportsService.GetROBByUser(userId);
            }
        ).then(
            (results: GetROBByUser) => {

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
    Create(@Headers() headers, @Body() dailyReport: DailyReport): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que esten llegando los datos necesarios.
                if (dailyReport && dailyReport.userId && dailyReport.portId && dailyReport.date && dailyReport.hour && dailyReport.activityPerformed && headerToken && headerToken.id) {

                    // Si eres un buque 
                    if (headerToken.role === 'BUQUE') {
                        if (Number(headerToken.id) !== Number(dailyReport.userId)) throw new Error('ERROR_USERID_FAIL');
                    }
                    
                    delete dailyReport.id;
                    dailyReport.bunkeringIfo = dailyReport.bunkeringIfo || 0;
                    dailyReport.bunkeringMgo = dailyReport.bunkeringMgo || 0;
                    dailyReport.mplaIfo = dailyReport.mplaIfo || 0;
                    dailyReport.auxIfo = dailyReport.auxIfo || 0;
                    dailyReport.boilerIfo = dailyReport.boilerIfo || 0;
                    dailyReport.otherIfo = dailyReport.otherIfo || 0;
                    dailyReport.mplaMgo = dailyReport.mplaMgo || 0;
                    dailyReport.auxMgo = dailyReport.auxMgo || 0;
                    dailyReport.boilerMgo = dailyReport.boilerMgo || 0;
                    dailyReport.ppMgo = dailyReport.ppMgo || 0;
                    dailyReport.giMgo = dailyReport.giMgo || 0;
                    dailyReport.otherMgo = dailyReport.otherMgo || 0;
                    dailyReport.steamingTime = dailyReport.steamingTime || 0;
                    dailyReport.distance = dailyReport.distance || 0;

                    // Auditoria.
                    dailyReport.userIdCreated = headerToken.id;
                    dailyReport.dateCreated = GetDate();
                    delete dailyReport.userIdUpdated;
                    delete dailyReport.dateUpdated;
                    dailyReport.status = Boolean(dailyReport.status);

                    // Ejecutamos la funcion que registra en bd.
                    return this._dailyReportsService.Create(dailyReport);
                }
                else throw 'MISSING_FIELS';
            }
        ).then(
            (resultCreate: DailyReport) => {

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
    async Update(@Headers() headers, @Param('id') id, @Body() dailyReport: DailyReport): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {


                // Validamos los datos del objeto a registar.
                if (dailyReport && dailyReport.userId && dailyReport.portId && dailyReport.date && dailyReport.hour && dailyReport.activityPerformed && headerToken && headerToken.id) {


                    if (headerToken.role === 'SUPPORT' || headerToken.role === 'ADMIN') {

                    } else if (Number(headerToken.id) !== Number(dailyReport.userId)) throw new Error('ERROR_USERID_FAIL');


                    dailyReport.bunkeringIfo = dailyReport.bunkeringIfo || 0;
                    dailyReport.bunkeringMgo = dailyReport.bunkeringMgo || 0;
                    dailyReport.mplaIfo = dailyReport.mplaIfo || 0;
                    dailyReport.auxIfo = dailyReport.auxIfo || 0;
                    dailyReport.boilerIfo = dailyReport.boilerIfo || 0;
                    dailyReport.otherIfo = dailyReport.otherIfo || 0;
                    dailyReport.mplaMgo = dailyReport.mplaMgo || 0;
                    dailyReport.auxMgo = dailyReport.auxMgo || 0;
                    dailyReport.boilerMgo = dailyReport.boilerMgo || 0;
                    dailyReport.ppMgo = dailyReport.ppMgo || 0;
                    dailyReport.giMgo = dailyReport.giMgo || 0;
                    dailyReport.otherMgo = dailyReport.otherMgo || 0;
                    dailyReport.steamingTime = dailyReport.steamingTime || 0;
                    dailyReport.distance = dailyReport.distance || 0;

                    // Auditoria.
                    delete dailyReport.userIdCreated;
                    delete dailyReport.dateCreated;
                    dailyReport.userIdUpdated = headerToken.id;
                    dailyReport.dateUpdated = GetDate();
                    dailyReport.status = Boolean(dailyReport.status);


                    // Ejecutamos la funcion que actualiza el obj en la bd.
                    return this._dailyReportsService.Update(dailyReport);

                } else {

                    // Enviar los datos necesarios.
                    throw 'MISSING_FIELS';

                }
            }
        ).then(
            (resultUpdate: DailyReport) => {

                // Validamos el resultado
                if (!resultUpdate) throw new Error('TYPEORM_UPDATE_VOYAGE_DETAIL');

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
                    return this._dailyReportsService.Get(id);

                } else {
                    // Enviar los datos necesarios.
                    throw new Error('MISSING_FIELS');

                }

            }
        ).then(
            (result: DailyReport) => {

                result.status = false;
                delete result.userIdCreated;
                delete result.dateCreated;
                result.userIdUpdated = headerToken.id;
                result.dateUpdated = GetDate();

                // 
                return this._dailyReportsService.Delete(result);
            }
        ).then(
            (resultDelete: DailyReport) => {

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
