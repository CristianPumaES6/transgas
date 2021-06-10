import { Controller, Query, Get, Post, Put, Delete, Body, UseGuards, Param, HttpException, HttpStatus, Headers, UseInterceptors, UploadedFile } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// Si es una class lo tego que poner en el constructor y como proverdor del modulo
// 1 Importo los servicios
import { UsersService } from './users.service';

import { DummyPromise } from '../../assets/promises.assets';
import { JwtDecode } from '../../assets/jwtDecode.assets';
import { diskStorage } from 'multer';
import { GetDate } from '../../assets/moment.assets';


// Entity
import { UserEntity } from '../../models/user.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { EditFileName, ImageFileFilter } from '../../middleware/image.middleware';
import { FOLDER_UPLOADS } from '../../config/path.config';

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

    // Solo si eres admin podras consultar por todos los usurios.
    @Get()
    async Gets(@Headers() headers, @Query() user: UserEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que los datos sean los necesarios.
                if (headerToken && (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT' ||  headerToken.role == 'OWNER') && user) {

                    // Ejecutamos el servicio de obtener sailingAnalities.
                    return this._usersService.Gets(user);

                } else {
                    if (Number(user.id) === Number(headerToken.id)) {
                        // Ejecutamos el servicio de obtener sailingAnalities.
                        return this._usersService.Gets(user);
                    } else {
                        throw new Error('MISSING_FIELS');
                    }
                }

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
    async Create(@Headers() headers, @Body() user: UserEntity): Promise<any> {

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

                    user.years = user.years || '[]';

                    user.minSpeed = user.minSpeed || 0;
                    user.maxSpeed = user.maxSpeed || 0;
                    user.isConsumptionIFO = user.isConsumptionIFO || false;
                    user.isConsumptionLSFO = user.isConsumptionLSFO || false;
                    user.isConsumptionMGO = user.isConsumptionMGO || false;
                    user.maxIFOConsumption = user.maxIFOConsumption || 0;
                    user.maxMGOConsumption = user.maxMGOConsumption || 0;
                    user.minIFOConsumption = user.minIFOConsumption || 0;
                    user.minMGOConsumption = user.minMGOConsumption || 0;
                    user.isMEMGO = user.isMEMGO || false;
                    user.isAEMGO = user.isAEMGO || false;
                    user.isBoilerMGO = user.isBoilerMGO || false;
                    user.isIGMGO = user.isIGMGO || false;
                    user.isPowerPMGO = user.isPowerPMGO || false;
                    user.isOtherMGO = user.isOtherMGO || false;
                    user.isMEIFO = user.isMEIFO || false;
                    user.isAEIFO = user.isAEIFO || false;
                    user.isBoilerIFO = user.isBoilerIFO || false;
                    user.isOtherIFO = user.isOtherIFO || false;

                    // Performance MGO
                    user.contractSpeedSailingBallastMGO = user.contractSpeedSailingBallastMGO || 0;
                    user.contractSpeedSailingLadenMGO = user.contractSpeedSailingLadenMGO || 0;
                    user.contractSpeedSailingEconomicalMGO = user.contractSpeedSailingEconomicalMGO || 0;
                    user.loadingConsumptionMGO = user.loadingConsumptionMGO || 0;
                    user.dischargeConsumptionMGO = user.dischargeConsumptionMGO || 0;
                    user.sailingBallastConsumptionMGO = user.sailingBallastConsumptionMGO || 0;
                    user.sailingLoadConsumptionMGO = user.sailingLoadConsumptionMGO || 0;
                    user.sailingEconomicConsumptionMGO = user.sailingEconomicConsumptionMGO || 0;
                    user.anchoredConsumptionMGO = user.anchoredConsumptionMGO || 0;
                    user.maneuverConsumptionMGO = user.maneuverConsumptionMGO || 0;
                    user.otherConsumptionMGO = user.otherConsumptionMGO || 0;

                    // Performance IFO
                    user.contractSpeedSailingBallastIFO = user.contractSpeedSailingBallastIFO || 0;
                    user.contractSpeedSailingLadenIFO = user.contractSpeedSailingLadenIFO || 0;
                    user.contractSpeedSailingEconomicalIFO = user.contractSpeedSailingEconomicalIFO || 0;
                    user.loadingConsumptionIFO = user.loadingConsumptionIFO || 0;
                    user.dischargeConsumptionIFO = user.dischargeConsumptionIFO || 0;
                    user.sailingBallastConsumptionIFO = user.sailingBallastConsumptionIFO || 0;
                    user.sailingLoadConsumptionIFO = user.sailingLoadConsumptionIFO || 0;
                    user.sailingEconomicConsumptionIFO = user.sailingEconomicConsumptionIFO || 0;
                    user.anchoredConsumptionIFO = user.anchoredConsumptionIFO || 0;
                    user.maneuverConsumptionIFO = user.maneuverConsumptionIFO || 0;
                    user.otherConsumptionIFO = user.otherConsumptionIFO || 0;

                    // Display Dashboard
                    user.isDisplayLSFOConsumption = user.isDisplayLSFOConsumption || false;
                    user.isDisplayMGOConsumption = user.isDisplayMGOConsumption || false;
                    user.isDisplayAverageSpeed = user.isDisplayAverageSpeed || false;
                    user.isDisplayDataMGO = user.isDisplayDataMGO || false;
                    user.isDisplayDataLSFO = user.isDisplayDataLSFO || false;
                    user.isDisplayVesselPerformanceLSFO = user.isDisplayVesselPerformanceLSFO || false;
                    user.isDisplayVesselPerformanceMGO = user.isDisplayVesselPerformanceMGO || false;

                    // Conusmo por equipo.
                    user.consumptionEquipmentME_MGO = user.consumptionEquipmentME_MGO || 0;
                    user.consumptionEquipmentAE_MGO = user.consumptionEquipmentAE_MGO || 0;
                    user.consumptionEquipmentBOILER_MGO = user.consumptionEquipmentBOILER_MGO || 0;
                    user.consumptionEquipmentIG_MGO = user.consumptionEquipmentIG_MGO || 0;
                    user.consumptionEquipmentPP_MGO = user.consumptionEquipmentPP_MGO || 0;
                    user.consumptionEquipmentOther_MGO = user.consumptionEquipmentOther_MGO || 0;
                    user.consumptionEquipmentME_IFO = user.consumptionEquipmentME_IFO || 0;
                    user.consumptionEquipmentAE_IFO = user.consumptionEquipmentAE_IFO || 0;
                    user.consumptionEquipmentBOILER_IFO = user.consumptionEquipmentBOILER_IFO || 0;
                    user.consumptionEquipmentOther_IFO = user.consumptionEquipmentOther_IFO || 0;


                    user.userIdCreated = headerToken.id;
                    user.dateCreated = GetDate();
                    delete user.userIdUpdated;
                    delete user.dateUpdated;
                    user.status = Boolean(user.status);
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

                    user.years = user.years || '[]';

                    user.minSpeed = user.minSpeed || 0;
                    user.maxSpeed = user.maxSpeed || 0;
                    user.isConsumptionIFO = user.isConsumptionIFO || false;
                    user.isConsumptionLSFO = user.isConsumptionLSFO || false;
                    user.isConsumptionMGO = user.isConsumptionMGO || false;
                    user.maxIFOConsumption = user.maxIFOConsumption || 0;
                    user.maxMGOConsumption = user.maxMGOConsumption || 0;
                    user.minIFOConsumption = user.minIFOConsumption || 0;
                    user.minMGOConsumption = user.minMGOConsumption || 0;
                    user.isMEMGO = user.isMEMGO || false;
                    user.isAEMGO = user.isAEMGO || false;
                    user.isBoilerMGO = user.isBoilerMGO || false;
                    user.isIGMGO = user.isIGMGO || false;
                    user.isPowerPMGO = user.isPowerPMGO || false;
                    user.isOtherMGO = user.isOtherMGO || false;
                    user.isMEIFO = user.isMEIFO || false;
                    user.isAEIFO = user.isAEIFO || false;
                    user.isBoilerIFO = user.isBoilerIFO || false;
                    user.isOtherIFO = user.isOtherIFO || false;

                    // Performance MGO
                    user.contractSpeedSailingBallastMGO = user.contractSpeedSailingBallastMGO || 0;
                    user.contractSpeedSailingLadenMGO = user.contractSpeedSailingLadenMGO || 0;
                    user.contractSpeedSailingEconomicalMGO = user.contractSpeedSailingEconomicalMGO || 0;
                    user.loadingConsumptionMGO = user.loadingConsumptionMGO || 0;
                    user.dischargeConsumptionMGO = user.dischargeConsumptionMGO || 0;
                    user.sailingBallastConsumptionMGO = user.sailingBallastConsumptionMGO || 0;
                    user.sailingLoadConsumptionMGO = user.sailingLoadConsumptionMGO || 0;
                    user.sailingEconomicConsumptionMGO = user.sailingEconomicConsumptionMGO || 0;
                    user.anchoredConsumptionMGO = user.anchoredConsumptionMGO || 0;
                    user.maneuverConsumptionMGO = user.maneuverConsumptionMGO || 0;
                    user.otherConsumptionMGO = user.otherConsumptionMGO || 0;

                    // Performance IFO
                    user.contractSpeedSailingBallastIFO = user.contractSpeedSailingBallastIFO || 0;
                    user.contractSpeedSailingLadenIFO = user.contractSpeedSailingLadenIFO || 0;
                    user.contractSpeedSailingEconomicalIFO = user.contractSpeedSailingEconomicalIFO || 0;
                    user.loadingConsumptionIFO = user.loadingConsumptionIFO || 0;
                    user.dischargeConsumptionIFO = user.dischargeConsumptionIFO || 0;
                    user.sailingBallastConsumptionIFO = user.sailingBallastConsumptionIFO || 0;
                    user.sailingLoadConsumptionIFO = user.sailingLoadConsumptionIFO || 0;
                    user.sailingEconomicConsumptionIFO = user.sailingEconomicConsumptionIFO || 0;
                    user.anchoredConsumptionIFO = user.anchoredConsumptionIFO || 0;
                    user.maneuverConsumptionIFO = user.maneuverConsumptionIFO || 0;
                    user.otherConsumptionIFO = user.otherConsumptionIFO || 0;

                    // Display Dashboard
                    user.isDisplayLSFOConsumption = user.isDisplayLSFOConsumption || false;
                    user.isDisplayMGOConsumption = user.isDisplayMGOConsumption || false;
                    user.isDisplayAverageSpeed = user.isDisplayAverageSpeed || false;
                    user.isDisplayDataMGO = user.isDisplayDataMGO || false;
                    user.isDisplayDataLSFO = user.isDisplayDataLSFO || false;
                    user.isDisplayVesselPerformanceLSFO = user.isDisplayVesselPerformanceLSFO || false;
                    user.isDisplayVesselPerformanceMGO = user.isDisplayVesselPerformanceMGO || false;

                    // Conusmo por equipo.
                    user.consumptionEquipmentME_MGO = user.consumptionEquipmentME_MGO || 0;
                    user.consumptionEquipmentAE_MGO = user.consumptionEquipmentAE_MGO || 0;
                    user.consumptionEquipmentBOILER_MGO = user.consumptionEquipmentBOILER_MGO || 0;
                    user.consumptionEquipmentIG_MGO = user.consumptionEquipmentIG_MGO || 0;
                    user.consumptionEquipmentPP_MGO = user.consumptionEquipmentPP_MGO || 0;
                    user.consumptionEquipmentOther_MGO = user.consumptionEquipmentOther_MGO || 0;
                    user.consumptionEquipmentME_IFO = user.consumptionEquipmentME_IFO || 0;
                    user.consumptionEquipmentAE_IFO = user.consumptionEquipmentAE_IFO || 0;
                    user.consumptionEquipmentBOILER_IFO = user.consumptionEquipmentBOILER_IFO || 0;
                    user.consumptionEquipmentOther_IFO = user.consumptionEquipmentOther_IFO || 0;

                    delete user.userIdCreated;
                    delete user.dateCreated;
                    user.userIdUpdated = headerToken.id;
                    user.dateUpdated = GetDate();

                    user.status = Boolean(user.status);



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

                // caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
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
        ).then(
            (resultUpdate: UserEntity) => {

                // retornamos una Respuesta exitosa.
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

                // caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    @Post(':id/image')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: FOLDER_UPLOADS,
            filename: EditFileName,
        }),
        fileFilter: ImageFileFilter
    }))
    async UploadImagePerfil(@Headers() headers, @Param('id') id, @UploadedFile() file): Promise<any> {

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

                if (!file || !file.filename) {
                    // caso contrario retornamos un error
                    throw 'MISSING_IMAGE';
                }

                return this._usersService.UpdateImageUser(id, file.filename);
            }
        ).then(
            (resultFilenameUpdate: string) => {

                if (!resultFilenameUpdate) throw new Error('No se guardo la imagen correctamente.');
                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultFilenameUpdate
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
