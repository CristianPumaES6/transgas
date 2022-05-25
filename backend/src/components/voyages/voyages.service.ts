import { Injectable } from '@nestjs/common';

// Librerias de TypeOrm
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Like } from "typeorm";
import { Not } from "typeorm";

// Modelos.
import { DummyPromise } from '../../assets/promises.assets';
import { Voyage, VoyageFilterByYears } from '../../models/voyage.entity'; // < Suele cambiar.
import { URL_Server } from '../../config/server.config';
import { Port } from '../../models/port.entity';


@Injectable()
export class VoyagesService {

    constructor(
        @InjectRepository(Voyage)
        private voyageRepository: Repository<Voyage>,
    ) { }


    // Registra un nuevo viaje
    async Create(voyage: Voyage): Promise<Voyage> {

        // Hacemos where por todos los campos de la entidad
        return DummyPromise().then(
            result => {



                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this.voyageRepository.query("SP_CheckTheLastRecordedTrip @userId='" + voyage.userId + "', @year='" + voyage.year + "'");
                } else {
                    return this.voyageRepository.find({
                        where: [
                            // name && surname && nick && email
                            {
                                userId: voyage.userId,
                                year: voyage.year,
                                status: true,
                            }
                        ],
                        take: 1,
                        order: {
                            voyageNumber: 'DESC',
                        }
                    });

                }



            }
        ).then(
            (result: Voyage[]) => {
                // result length 
                if (result && (result.length > 0)) {
                    // No valido o cambio el viaje, devido a que si llega aver un problema del numero de viaje se repetiria 2 veces.
                    // y los registros registrados dentro se eliminarian.
                    voyage.voyageNumber = voyage.voyageNumber;
                    // voyage.voyageNumber = Number(result[0].voyageNumber) + 1;
                }
                else {
                    // Caso contrario el numero del viaje es el numero de viaje.
                    voyage.voyageNumber = voyage.voyageNumber;
                };

                if (URL_Server.bd === 'MSSQL') {
                    // Ejecutamos el storeProceude creado.
                    return this.voyageRepository.query(`
                    SP_CreateNewVoyage @userId =  ${voyage.userId}  ,
                    @voyageNumber =  ${voyage.voyageNumber} , 
                    @year = ${voyage.year} ,
                    @userIdCreated =   ${voyage.userIdCreated} ,
                    @dateCreated = '${voyage.dateCreated}',
                    @userIdUpdated =  ${voyage.userIdUpdated ? voyage.userIdUpdated : 0} ,
                    @dateUpdated = '${voyage.dateUpdated || ''}' ,
                    @status = ${voyage.status} 
                    `);


                } else {

                    // No lo validamos por que puede llegar vacio.
                    return this.voyageRepository.save(voyage)
                }

            }
        ).then(
            (resultSave: any) => {
                // Validamos si encontro al usuario.

                if (!resultSave) throw new Error('No se puedo registrar el viaje en la BD.');

                if (URL_Server.bd === 'MSSQL') {
                    // MSSQL
                    if (resultSave.length == 0) throw new Error('No se puedo registrar el viaje en la BD.');
                    return resultSave[0];
                } else {
                    // SLQITE
                    return resultSave;
                }
            }
        )

    }

    // Retorna a un objeto por id.
    async Get(id: Number): Promise<Voyage> {


        // Hacemos where por todos los campos de la entidad
        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this.voyageRepository.query(`EXEC SP_ObtenerViajePorId @voyageId=${id || 0}`);
                } else {

                    return this.voyageRepository.find({
                        where: {
                            id: id,
                            status: Not(false)
                        }
                    });

                }

            }
        ).then(
            (resultFind: Voyage[]) => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('voyage_does_not_exist');
                if (resultFind && resultFind.length == 0) throw new Error('voyage_does_not_exist');

                // retornamos el objeto.
                let voyageReturn = resultFind[0];
                return voyageReturn;
            }
        );
    }


    // Retorna todos los viajes segun filtro.
    async Gets(voyage: Voyage, page: number = 1): Promise<Voyage[]> {

        // Hacemos where por todos los campos de la entidad
        return await this.voyageRepository.find({
            where: [
                // name && surname && nick && email
                {
                    userId: Like('%' + (voyage.userId || '') + '%'),
                    voyageNumber: Like('%' + (voyage.voyageNumber || '') + '%'),
                    year: Like('%' + (voyage.year || '') + '%'),
                    status: Not(false)
                }
            ],
            take: 5,
            skip: 5 * (page - 5),
            order: {
                voyageNumber: 'DESC',
            }
        }).then(
            (result: Voyage[]) => {
                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }


    // Retorna todos los viajes segun filtro.
    async GetsDetails(voyage: Voyage, page: number = 1): Promise<Voyage[]> {

        return DummyPromise().then(
            result => {

                if (URL_Server.bd == 'MSSQL') {
                    return this.InfoVoyage(voyage.userId)
                } else {
                    return this.voyageRepository.find({
                        relations: ["ports"],
                        where: [
                            // name && surname && nick && email
                            {
                                userId: (voyage.userId || ''),
                                voyageNumber: Like('%' + (voyage.voyageNumber || '') + '%'),
                                year: Like('%' + (voyage.year || '') + '%'),
                                status: Not(false)
                            }
                        ],
                        take: 5,
                        skip: 5 * (page - 5),
                        order: {
                            voyageNumber: 'DESC',
                        }
                    })
                }
            }
        ).then(
            (result: Voyage[]) => {

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        ).catch(
            result => {
                throw result;
            }
        );

    }

    private async InfoVoyage(userId: number): Promise<Voyage[]> {

        let voyages: Voyage[] = [];

        if (URL_Server.bd === 'MSSQL') {
            voyages = await this.voyageRepository.query(`EXEC SP_ObtenerLosUltimos5Viajes @userId=${userId || 0}`);
        }

        let viajesConPuerto: Voyage[] = [];
        for await (let voyage of voyages) {



            let puertos: Port[] = await this.voyageRepository.query(`EXEC SP_ObtenerLosPuertoDeUnViaje @userId=${userId || 0}, @voyageId=${voyage.id || 0}`);
            let puertosConReportes: Port[] = [];
            for await (let puerto of puertos) {
                let reportes = await this.voyageRepository.query(`EXEC SP_ObtenerLosReportesDelPuerto @portId=${puerto.id || 0}`);
                puerto.dailyReports = reportes;

                puertosConReportes.push(puerto)
            }



            voyage.ports = puertosConReportes;
            viajesConPuerto.push(voyage)

        }

        return viajesConPuerto;

    }

    // Retorna todos los viajes segun filtro.
    async GetsByYears(voyageFilterByYears: VoyageFilterByYears): Promise<Voyage[]> {

        // Hacemos where por todos los campos de la entidad
        return await this.voyageRepository.find({
            relations: ["ports"],
            where: [
                // name && surname && nick && email
                {
                    userId: voyageFilterByYears.userId,
                    year: In(voyageFilterByYears.years),
                    status: Not(false)
                }
            ],
            order: {
                id: 'ASC',
            }
        }).then(
            (result: Voyage[]) => {

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        );

    }

    // Actualiza un Voyage
    async Update(voyage: Voyage): Promise<Voyage> {

        // Hacemos una busqueda por id
        return await this.voyageRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                { id: voyage.id }
            ]
        }).then(resultFind => {

            // Validamos si encontro al SailingAnality.
            if (!resultFind) throw new Error('voyage_does_not_exist');

            // Actualizamos
            return this.voyageRepository.update(voyage.id, voyage);

        }).then(resultUpdate => {

            if (!resultUpdate) throw 'TYPEORM_UPDATE_VOYAGE';

            // Envio respuesta con el resultado recibido del ultimo paso
            return voyage;
        });
    }


    // Elimina a un voyage por id
    async Delete(voyage: Voyage): Promise<Voyage> {

        return DummyPromise().then(
            result => {

                if (URL_Server.bd == 'MSSQL') {

                    return this.voyageRepository.query(`EXEC SP_DeleteVoyageById @voyageId=${voyage.id || 0} `);
                } else {

                    // Eliminamos de la base de dato al usuario.
                    return this.voyageRepository.update(voyage.id, voyage)
                }
            }
        ).then(
            (resultSave: any) => {

                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('error_update_delete_voyage');
                if (URL_Server.bd == 'MSSQL') {
                    if (resultSave && resultSave.length == 0) throw new Error('error_update_delete_voyage');
                } else {

                }
                return voyage;
            }
        );

    }


    // Permite consultar si el numero de viaje existe
    // Retorna underfined si el viaje no existe.
    async ThisVoyageNumberExists(voyageNumber: number, yearVoyage: number,userId: number): Promise<Voyage> {

        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    return this.voyageRepository.query("SP_ThisVoyageNumberExistsInTheYear @voyageNumber='" + voyageNumber + "', @yearVoyage='" + yearVoyage + "'");
                } else {

                    return this.voyageRepository.findOne({
                        where: [
                            // hacemos un where donde buscamos por id.
                            {
                                voyageNumber: voyageNumber,
                                year: yearVoyage,
                                userId: userId
                            }
                        ]
                    });
                }


            }
        ).then(
            // Puede ser un arreglo en MSSQL o un objeto en SQLITE
            (resultFind: any) => {

                // No vlaidamos resultado por que tambien puede ser underfine.
                if (URL_Server.bd === 'MSSQL') {
                    if (!resultFind && resultFind.length > 0) throw 'NO_REGISTER'
                    return resultFind[0];
                } else {

                   return resultFind;


                }
            });


    }

}
