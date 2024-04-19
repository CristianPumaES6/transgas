import { Body, Controller, Delete, Get, Headers, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { DailyOilConsumptionData, OilsService } from './oils.service';
import { DummyPromise } from '../../assets/promises.assets';
import { OilEntity, SaveDateOils } from '../../models/oil.entity';
import { UserEntity } from '../../models/user.entity';
import { JwtDecode } from '../../assets/jwtDecode.assets';
import { DateDayMonthYear, FormatDateUTCToDate, GetDate } from '../../assets/moment.assets';
import { GroupOilEntity } from '../../models/group-oils.entity';
import { EquipmentSystemEntity } from '../../models/equipment-system.entity';
import { ConsumptionEquipmentEntity } from '../../models/consumptionEquipment.entity';
import { BunkerOil } from '../../models/buker-oil.entity';
import { GroupOilsService } from './group-oils/group-oils.service';
import { EquipmentSystemService } from './equipment-system/equipment-system.service';
import { ConsumptionEquipmentService, SaveListConsumptionEquipmentEntity } from './consumption-equipment/consumption-equipment.service';
import { BunkerOilService } from './bunker-oil/bunker-oil.service';
import { Mapping } from '../../assets/mappingKeys';
import { SendMailHTMLOverCosumption } from 'src/assets/nodemailer.assets';


@Controller('oils')
export class OilsController {


    constructor(
        private readonly _OilsService: OilsService,
        private readonly _GroupOilEntityService: GroupOilsService,
        private readonly _EquipmentSystemService: EquipmentSystemService,
        private readonly _ConsumptionEquipmentService: ConsumptionEquipmentService,
        private readonly _BunkerOilService: BunkerOilService,
    ) { }

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

    @Get('loadModuleOils')
    GetsDataServer(@Headers() headers, @Query() oilEntity: OilEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // lista de la data del aplicativo control de Aceite
        let listOils: OilEntity[] = [];
        let listGroups: GroupOilEntity[] = [];
        let listEquipmentSystem: EquipmentSystemEntity[] = [];
        let listConsumptionEquipment: ConsumptionEquipmentEntity[] = [];
        let listBunkerOil: BunkerOil[] = [];

        // Inicio una promesa Dummy.
        return DummyPromise().then((resultDummy: Boolean) => {
            // Validamos que los datos sean los necesarios.
            if (oilEntity) {

                oilEntity.userId = Number(oilEntity.userId);
                return true;

            } else throw new Error('MISSING_FIELS2222');

        }
        ).then(
            (resultValidate: Boolean) => {
                // Validamos que el userId sea el mismo que el del sailingAnality
                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                    // Nose hace nada
                } else if (oilEntity.userId !== headerToken.id) throw new Error('ERROR_USERID_FAIL');

                let oilEntityFilter: OilEntity = <any>{};
                oilEntityFilter.userId = oilEntity.userId;
                // Ejecutamos el servicio de obtener todos los reportes diarios segun filtro.
                return this._OilsService.Gets(oilEntityFilter);
            }
        ).then(
            (Oils: OilEntity[]) => {
                listOils = Oils;

                let groupOilEntity: GroupOilEntity = <any>{};
                groupOilEntity.userId = oilEntity.userId;

                // Ejecutamos el servicio de obtener todos los reportes diarios segun filtro.
                return this._GroupOilEntityService.Gets(groupOilEntity);
            }
        ).then(
            (GroupsOilEntity: GroupOilEntity[]) => {
                listGroups = GroupsOilEntity;

                let equipmentSystemEntity: EquipmentSystemEntity = <any>{};
                equipmentSystemEntity.userId = oilEntity.userId;

                // Ejecutamos el servicio de obtener todos los reportes diarios segun filtro.
                return this._EquipmentSystemService.Gets(equipmentSystemEntity);
            }
        ).then(
            (TypesOfOilEquipmentEntity: EquipmentSystemEntity[]) => {
                listEquipmentSystem = TypesOfOilEquipmentEntity;

                let consumptionEquipmentEntity: ConsumptionEquipmentEntity = <any>{};
                consumptionEquipmentEntity.userId = oilEntity.userId;

                // Ejecutamos el servicio de obtener todos los reportes diarios segun filtro.
                return this._ConsumptionEquipmentService.Gets(consumptionEquipmentEntity);
            }
        ).then(
            (ConsumptionsEquipmentEntity: ConsumptionEquipmentEntity[]) => {
                listConsumptionEquipment = ConsumptionsEquipmentEntity;


                let bunkersOilEntity: BunkerOil = <any>{};
                bunkersOilEntity.userId = oilEntity.userId;
                // Ejecutamos el servicio de obtener todos los reportes diarios segun filtro.
                return this._BunkerOilService.Gets(bunkersOilEntity);
            }
        ).then(
            (bunkersOilEntity: BunkerOil[]) => {
                listBunkerOil = bunkersOilEntity;

                // Retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: {
                        listOils: listOils,
                        listGroups: listGroups,
                        listEquipmentSystem: listEquipmentSystem,
                        listConsumptionEquipment: listConsumptionEquipment,
                        listBunkerOil: listBunkerOil
                    }
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

    @Get('getDataBuque/:userId')
    async getDataBuque(@Param('userId') buqueId): Promise<any> {

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // Validamos que los datos recibidos sean los correctos.
                if (Number(buqueId)) {
                    let userId = Number(buqueId);
                    return this._OilsService.ConsultarListaDeConsumosPorBuque(buqueId);
                } else {
                    // caso contrario retornamos un error
                    throw 'MISSING_FIELS';
                }

            }
        ).then(
            (resultGet: any) => {

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

    @Get(':id')
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
        );
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

    @Post('saveModuleOils')
    async SaveDataLubricante(@Headers() headers, @Body() saveDateOils: SaveDateOils): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Mapping de Id del server con el id del cliente
        let mappingGroupOils: Mapping[] = [];
        let mappingTypesOfOilEquipment: Mapping[] = [];
        let mappingConsumptionsEquipment: Mapping[] = [];
        let mappingOils: Mapping[] = [];
        let mappingBunkersOil: Mapping[] = [];
        let listConsumosValidarSendMail = [];

        console.log('--------------------------');
        console.log('-----------[   START saveModuleOils   ]---------------');
        console.log(JSON.stringify(saveDateOils))
        console.log('-----------[   END saveModuleOils   ]---------------');
        console.log('--------------------------');

        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que esten llegando los datos necesarios.
                if (saveDateOils) {
                    if (saveDateOils.listGroups) {
                        // Ejecutamos la funcion que registra en bd.
                        return this._GroupOilEntityService.SaveList(saveDateOils.listGroups);
                    } else {
                        return [];
                    }
                }
                else throw 'MISSING_FIELS';
            }
        ).then(
            (resultMappingGroupOils: Mapping[]) => {

                mappingGroupOils = resultMappingGroupOils;

                if (saveDateOils.listOils) {
                    return this._OilsService.SaveList(saveDateOils.listOils);
                } else {
                    return [];
                }
            }
        ).then(
            (resultMappingOil: Mapping[]) => {

                mappingOils = resultMappingOil;

                if (saveDateOils.listEquipmentSystem) {
                    return this._EquipmentSystemService.SaveList(mappingGroupOils, saveDateOils.listEquipmentSystem);
                } else {
                    return [];
                }
            }
        ).then(
            (resultMappingEquipmentSystem: Mapping[]) => {
                mappingTypesOfOilEquipment = resultMappingEquipmentSystem;

                if (saveDateOils.listConsumptionEquipment) {
                    return this._ConsumptionEquipmentService.SaveList(mappingTypesOfOilEquipment, mappingOils, saveDateOils.listConsumptionEquipment);
                } else {
                    // vacio si no hay nada
                    return {
                        MappingConsumptionsEquipment: [],
                        listConsumosValidarSendMail: []
                    };
                }
            }
        ).then(
            (resultConsumptionEquipment: SaveListConsumptionEquipmentEntity) => {
                mappingConsumptionsEquipment = resultConsumptionEquipment.MappingConsumptionsEquipment;
                listConsumosValidarSendMail = resultConsumptionEquipment.listConsumosValidarSendMail;

                if (saveDateOils.listBunkerOil) {
                    return this._BunkerOilService.SaveList(mappingOils, mappingTypesOfOilEquipment, saveDateOils.listBunkerOil);
                } else {
                    return [];
                }
            }
        ).then(
            (resultBunkerOil: Mapping[]) => {

                mappingBunkersOil = resultBunkerOil;

                // tenemos que enviar un correo lo enviamos
                if (listConsumosValidarSendMail && listConsumosValidarSendMail.length && listConsumosValidarSendMail.length > 0) {
                    console.log('Se realiza la consulta de consumos registrados')

                    return this._OilsService.ConsultarListaDeConsumosRegistrados(listConsumosValidarSendMail);
           
                } else {
                    return [];
                }
            }
        ).then(
            (listaDeConsumosRegistrados:DailyOilConsumptionData[]) => {
 

                // tenemos que enviar un correo lo enviamos
                if (listaDeConsumosRegistrados && listaDeConsumosRegistrados.length > 0) {
                    //--mpineda@transgas.com.pe; hcamasca@transgas.com.pe; 
                    return SendMailHTMLOverCosumption('cristian.puma.es6@gmail.com; cpuma@transgas.com.pe',headerToken.name,FormatDateUTCToDate(GetDate()) ,listaDeConsumosRegistrados);
           
                } else {
                    return true;
                }
            }
        ).then(
                (resultSendMail: boolean) => {


                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: {
                        mappingGroupOils: mappingGroupOils,
                        mappingTypesOfOilEquipment: mappingTypesOfOilEquipment,
                        mappingConsumptionsEquipment: mappingConsumptionsEquipment,
                        mappingOils: mappingOils,
                        mappingBunkersOil: mappingBunkersOil
                    }
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
