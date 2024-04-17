import { Injectable } from '@nestjs/common';
import { OilEntity } from '../../models/oil.entity';

// Librerias de TypeOrm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Like } from "typeorm";
import { Not } from "typeorm";

// Otras librerias. 
import * as bcrypt from 'bcrypt';
import { ROUNDS_BCRYPT } from '../../config/bcrypt.config';
import { URL_Server } from '../../config/server.config'

// Modelos.
import { UserEntity } from '../../models/user.entity';
import { DummyPromise } from '../../assets/promises.assets';
import { ConvertMMDDYYYToYYYYMMDD, DateDayMonthYear, FormatDateUTCToDate, GetDate } from '../../assets/moment.assets';
import { Mapping } from '../../assets/mappingKeys';
import { mathRound } from 'src/assets/math.assets';


@Injectable()
export class OilsService {

    constructor(
        @InjectRepository(OilEntity)
        private _oilRepository: Repository<OilEntity>,
    ) { }

    // Retorna a un objeto por id.
    async Get(id: Number): Promise<OilEntity> {

        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this._oilRepository.query(`
                     EXEC SP_BuscarReportePorId 
                    @dailyReportId = ${id} 
                    `);

                } else {


                    return this._oilRepository.find({
                        where: [{
                            id: id,
                        }]
                    });
                }

            }
        ).then(
            (resultFind: OilEntity[]) => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('does_not_exist');
                if (resultFind && resultFind.length == 0) throw new Error('does_not_exist');


                let returnDailyReport = resultFind[0];
                // retornamos el objeto.
                return returnDailyReport;
            }
        );
    }

    async Gets(oilEntity: OilEntity): Promise<OilEntity[]> {

        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {

                    return null
                    
                    //  return hthis.userRepository.query(
                    //
                    // `EXEC SP_BuscarUsuariosByFilter @userId =0,@nick = '${user.nick || ''}',@name = '${user.name || ''}',@role= '${user.role || ''}'
                    // `
                    // );

                } else {

                    return this._oilRepository.find({
                        where: [
                            // name && surname && nick && email
                            {
                                userId: (oilEntity.userId || Like('%' + '%')),
                                name: Like('%' + (oilEntity.name || '') + '%'),
                                status: Not(false)
                            }
                        ]
                    });

                }


            }
        ).then(
            (result: OilEntity[]) => {

                if (!result) throw 'ERROR AL CONSULTAR LOS ACEITES.'

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }


    async Create(oilEntity: OilEntity): Promise<OilEntity> {

        // buscamos si el nick o email ya esta en uso.
        return DummyPromise().then(
            result => {
 
            if (URL_Server.bd === 'MSSQL') {
                return /*this.userRepository.query(
                    `
                    EXEC SP_CreateNewUser
                    @nick ='${user.nick || ''}'
                    `
                );*/
            } else {
                return this._oilRepository.save(oilEntity);
            }

        }).then(
            (resultSave: any) => {


                if (!resultSave) throw new Error('No se puedo registrar el aceite en la BD.');

                if (URL_Server.bd === 'MSSQL') {
                    // MSSQL
                    if (resultSave.length == 0) throw new Error('No se puedo registrar el aceite en la BD.');
                    return resultSave[0];
                } else {
                    // SLQITE
                    return resultSave;
                }
            }
        );
    }


    // Actualiza un aceite
    async Update(oilEntity: OilEntity): Promise<OilEntity> {

        return DummyPromise().then
            (result => {
                return this.Get(oilEntity.id);
            }).then(resultFind => {

                // Validamos si encontro al SailingAnality.
                if (!resultFind) throw new Error('does_not_exist');
                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return null  /*this._dailyReportRepository.query(`
                    EXEC SP_UpdateDailyReport  
                        @id = ${dailyReport.userId} 
                        ,@userId = ${dailyReport.userId} 
                        ,@portId = ${dailyReport.portId} 
                        ,@activityPerformed = '${dailyReport.activityPerformed}' 
                        ,@speedStraction = '${dailyReport.speedStraction}' 
                        ,@date ='${dailyReport.date ? FormatDateUTCToDateHour(dailyReport.date) : ''}' 
                        ,@hour = '${dailyReport.hour}' 
                        ,@bunkeringIfo = ${dailyReport.bunkeringIfo} 
                        ,@bunkeringMgo = ${dailyReport.bunkeringMgo} 
                        ,@mplaIfo  = ${dailyReport.mplaIfo} 
                        ,@auxIfo  = ${dailyReport.auxIfo}
                        ,@boilerIfo  = ${dailyReport.boilerIfo} 
                        ,@otherIfo = ${dailyReport.otherIfo}
                        ,@mplaMgo = ${dailyReport.mplaMgo}
                        ,@auxMgo   = ${dailyReport.auxMgo}
                        ,@boilerMgo   = ${dailyReport.boilerMgo} 
                        ,@ppMgo = ${dailyReport.ppMgo} 
                        ,@giMgo = ${dailyReport.giMgo} 
                        ,@otherMgo  = ${dailyReport.otherMgo} 
                        ,@steamingTime  = ${dailyReport.steamingTime}
                        ,@distance =${dailyReport.distance}
                        ,@beaufour = '${dailyReport.beaufour}'
                        ,@observation ='${dailyReport.observation}' 
                        ,@userIdUpdated = ${dailyReport.userIdUpdated || 0}
                        ,@dateUpdated = '${dailyReport.dateUpdated || ''}'
                        ,@status = ${dailyReport.status}
                `);*/

                } else {
                    return this._oilRepository.update(oilEntity.id, oilEntity);

                }
                // Actualizamos

            }).then(resultUpdate => {

                if (!resultUpdate) throw new Error('ERROR_TYPEORM_UPDATE_PORT');
                if (URL_Server.bd === 'MSSQL') {

                    // if ( resultUpdate && resultUpdate.length == 0) throw new Error('ERROR_TYPEORM_UPDATE_PORT');
                }
                // Envio respuesta con el resultado recibido del ultimo paso
                return oilEntity;
            });
    }

    // Elimina a un aceite por id
    async Delete(oilEntity: OilEntity, usuarioDelete: number): Promise<OilEntity> {
       
       let returnOilEntity:OilEntity;
        return DummyPromise().then(
            result => {
                return this.Get(oilEntity.id);
            }
        ).then(
            resultFind => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('does_not_exist');


                resultFind.userIdUpdated = usuarioDelete;
                resultFind.dateUpdated = GetDate();
                resultFind.status = false;

                returnOilEntity = resultFind; 
                // verificamos que el email no este en uso, recordemos que el email es unico.
                return this.Update(resultFind);
            }
        ).then(
            resultSave => {

                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('ERROR_TYPEORM_UPDATE_PORT');

                return returnOilEntity;
            }
        )
    }

    
    // guarda una lista de aceite.
    async SaveList( importOils: OilEntity[] ) {
 

        let MappingOilEntity: Mapping[] = [];
        // Filtramos los datos que faltan aggregar y actualizar.
        const addOilEntity = importOils.filter((importOil: OilEntity) => importOil.SyncStatus == 'added');
        const updOilEntity = importOils.filter((importOil: OilEntity) => importOil.SyncStatus == 'updated');
        const deleteOilEntity = importOils.filter((importOil: OilEntity) => importOil.SyncStatus == 'deleted');


 
        for await (const oil of addOilEntity) {
            // Armamos al nuevo aceite
            let newOil = new OilEntity();

            delete newOil.id;
            newOil.userId = oil.userId;
            newOil.name = oil.name;

            // Auditoria.
            newOil.userIdCreated = oil.userIdCreated;
            newOil.dateCreated = GetDate();
            delete newOil.userIdUpdated;
            delete newOil.dateUpdated;
            newOil.status = Boolean(oil.status);

            // Registramos grupo de aceite
            let registeredGroupOil = await this.Create(newOil);

            // Lo agregamos al mapping
            MappingOilEntity.push(new Mapping(oil.id, registeredGroupOil.id))
        }

        for await (const oil of updOilEntity) {
            // Armamos al nuevo aceite
            let updatedOil = new OilEntity();

            updatedOil.id = oil.id;
            updatedOil.userId = oil.userId;
            updatedOil.name = oil.name;

            // Auditoria.
            updatedOil.userIdCreated = oil.userIdCreated;
            updatedOil.dateCreated = oil.dateCreated;
            updatedOil.userIdUpdated= oil.userIdUpdated;
            updatedOil.dateUpdated = oil.dateUpdated;
            updatedOil.status = Boolean(oil.status);

            await  this._oilRepository.save(updatedOil);
        }

        for await (let oil of deleteOilEntity) {
            // Armamos al nuevo aceite
            let deleteOil = new OilEntity();

            deleteOil.id = oil.id;
            deleteOil.userId = oil.userId;
            deleteOil.name = oil.name;

            // Auditoria.
            deleteOil.userIdCreated = oil.userIdCreated;
            deleteOil.dateCreated = oil.dateCreated;
            deleteOil.userIdUpdated= oil.userIdUpdated;
            deleteOil.dateUpdated = oil.dateUpdated;
            deleteOil.status = Boolean(oil.status);

            await this._oilRepository.save(deleteOil);
        }


        return MappingOilEntity;
    }


    // Consumos registrados COnsulta Para enviar Mail
    async ConsultarListaDeConsumosRegistrados(ListCONSUMOSId: any[]): Promise<DailyOilConsumptionData[]> {
 

        let listDeIds = '';

        // Inicio de la promesa.
        return await DummyPromise()
            .then(
                result => {
                    // Solo si la fecha es null, obtenedremos el ultimo registro ingresado
                    if (ListCONSUMOSId && ListCONSUMOSId.length) {


                        var listDeID = ListCONSUMOSId.join(',');
                        var queryWhere = 'consumptionEquipment.id in ('+listDeID+')';
                        

                        // Buscamos el ultimo reporte.
                        return this._oilRepository.createQueryBuilder('oil')
                            .addSelect('consumptionEquipment.date', 'dateConsumption')
                            .addSelect('typeOfOilEquipment.userId', 'typeOfOilEquipment_userId')
                            .addSelect('typeOfOilEquipment.id', 'typeOfOilEquipment_id')
                            .addSelect('typeOfOilEquipment.equipment', 'equipment')
                            .addSelect('consumptionEquipment.amount', 'amountConsumption')
                            .addSelect('oil.name', 'nameOil')
                            .addSelect('bunkerOilToEquipment.datetime', 'datetimeBunkerOil')
                            .addSelect('consumptionEquipment.hourConsumption', 'hourConsumption')
                            .addSelect('typeOfOilEquipment.rate', 'rate')
                            .addSelect('consumptionEquipment.observation', 'observation')

                            // UNION DE TABLAS
                            .innerJoin('bunkerOilToEquipment', 'bunkerOilToEquipment', 'bunkerOilToEquipment.entityOilId = oil.id AND bunkerOilToEquipment.status = 1 AND oil.status = 1')
                            .innerJoin('typeOfOilEquipment', 'typeOfOilEquipment', 'typeOfOilEquipment.id = bunkerOilToEquipment.entityEquipmentId AND typeOfOilEquipment.status = 1')
                            .innerJoin('consumptionEquipment', 'consumptionEquipment', 'consumptionEquipment.entityEquipmentId = typeOfOilEquipment.id AND consumptionEquipment.status = 1')

                            // Where status
                            .where(queryWhere, {})
                            // Filtro por el usuario seleccionado.
                            .orderBy('consumptionEquipment.date', 'DESC')
                            .limit(1000)
                            .getRawMany()
                    } else {
                        return null;
                    }
                }
            ).then(
                resultFind => {

                    let dailyOilConsumptionData: DailyOilConsumptionData[] = [];

                    resultFind.forEach(
                        item => {
                            // Fecha de consumo
                            let date = FormatDateUTCToDate(item.dateConsumption);

                            // Calculamos el rate realizado en las horas
                            let calcRate = 0;
                            if(!item.hourConsumption || item.hourConsumption <= 0){
                                calcRate = item.amountConsumption;
                            }else {
                                calcRate = mathRound(item.amountConsumption/item.hourConsumption,2) ;
                            }

                            // verificamos si el rate es mayor a la hora de trabajo.
                            if(calcRate > item.rate ){

                                let findDailyOilConsumptionData = dailyOilConsumptionData.find(item2 => item2.dateConsumption == date);

                                if(findDailyOilConsumptionData) {
                                    findDailyOilConsumptionData.data.push(
                                        {
                                            userId:item.typeOfOilEquipment_userId,
                                            equipmentId : item.typeOfOilEquipment_id,
                                            equipment: item.equipment,
                                            amountConsumption: item.amountConsumption,
                                            nameOil: item.nameOil,
                                            datetimeBunkerOil: item.datetimeBunkerOil,
                                            hourConsumption: item.hourConsumption,
                                            rate: item.rate,
                                            calcRate: calcRate
                                        }
                                    );
                                };
    
                                if(!findDailyOilConsumptionData) {
    
                                    dailyOilConsumptionData.push(
                                        {
                                            dateConsumption : date,
                                            observation : item.observation,
                                            data: [
                                                {
                                                    userId:item.typeOfOilEquipment_userId,
                                                    equipmentId : item.typeOfOilEquipment_id,
                                                    equipment: item.equipment,
                                                    amountConsumption: item.amountConsumption,
                                                    nameOil: item.nameOil,
                                                    datetimeBunkerOil: item.datetimeBunkerOil,
                                                    hourConsumption: item.hourConsumption,
                                                    rate: item.rate,
                                                    calcRate: calcRate
                                                }
                                            ]
                                        }
                                    );
                                };
                            }
                            

                        }
                    );

                    

                    return dailyOilConsumptionData;
                });
    }
 

    // Consumos registrados COnsulta Para enviar Mail
    async ConsultarListaDeConsumosPorBuque(buqueId: number): Promise<DailyOilConsumptionData[]> {
 
 

        // Inicio de la promesa.
        return await DummyPromise()
            .then(
                result => {
                    // Solo si la fecha es null, obtenedremos el ultimo registro ingresado
                    if (buqueId && buqueId>0) {


                        
                        var queryWhere = 'consumptionEquipment.userId = '+buqueId;
                        

                        // Buscamos el ultimo reporte.
                        return this._oilRepository.createQueryBuilder('oil')
                            .addSelect('consumptionEquipment.date', 'dateConsumption')
                            .addSelect('typeOfOilEquipment.equipment', 'equipment')
                            .addSelect('consumptionEquipment.amount', 'amountConsumption')
                            .addSelect('oil.name', 'nameOil')
                            .addSelect('bunkerOilToEquipment.datetime', 'datetimeBunkerOil')
                            .addSelect('consumptionEquipment.hourConsumption', 'hourConsumption')
                            .addSelect('typeOfOilEquipment.rate', 'rate')
                            .addSelect('consumptionEquipment.observation', 'observation')

                            // UNION DE TABLAS
                            .innerJoin('bunkerOilToEquipment', 'bunkerOilToEquipment', 'bunkerOilToEquipment.entityOilId = oil.id AND bunkerOilToEquipment.status = 1 AND oil.status = 1')
                            .innerJoin('typeOfOilEquipment', 'typeOfOilEquipment', 'typeOfOilEquipment.id = bunkerOilToEquipment.entityEquipmentId AND typeOfOilEquipment.status = 1')
                            .innerJoin('consumptionEquipment', 'consumptionEquipment', 'consumptionEquipment.entityEquipmentId = typeOfOilEquipment.id AND consumptionEquipment.status = 1')

                            // Where status
                            .where(queryWhere, {})
                            // Filtro por el usuario seleccionado.
                            .orderBy('consumptionEquipment.date', 'DESC')
                            .limit(1000)
                            .getRawMany()
                    } else {
                        return [];
                    }
                }
            ).then(
                resultFind => {

                    let dailyOilConsumptionData: DailyOilConsumptionData[] = [];

                    resultFind.forEach(
                        item => {
                            // Fecha de consumo
                            let date = FormatDateUTCToDate(item.dateConsumption);

                            // Calculamos el rate realizado en las horas
                            let calcRate = 0;
                            if(!item.hourConsumption || item.hourConsumption <= 0){
                                calcRate = item.amountConsumption;
                            } else {
                                calcRate = item.amountConsumption/item.hourConsumption;
                            }
 
                            
                            dailyOilConsumptionData.push(
                                {
                                    dateConsumption : date,
                                    observation : item.observation,
                                    data: [
                                        {
                                            userId:item.typeOfOilEquipment_userId,
                                            equipmentId : item.typeOfOilEquipment_id,
                                            equipment: item.equipment,
                                            amountConsumption: item.amountConsumption,
                                            nameOil: item.nameOil,
                                            datetimeBunkerOil: item.datetimeBunkerOil,
                                            hourConsumption: item.hourConsumption,
                                            rate: item.rate,
                                            calcRate: calcRate
                                        }
                                    ]
                                }
                            );
                        }
                    );

                    return dailyOilConsumptionData;
                });
    }
}

export interface DailyOilConsumptionData {
    dateConsumption:string;
    observation:string;
    data: DataDailyOilConsumptionData[];
}

export interface DataDailyOilConsumptionData {
    userId: string ;
    equipmentId: string ;
    equipment: string ;
    datetimeBunkerOil:string;
    nameOil: string;
    amountConsumption: number;
    hourConsumption: number;
    calcRate:number;
    rate:number;
}
