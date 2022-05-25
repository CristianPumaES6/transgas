import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Port } from '../../../models/port.entity';
import { Like, Not, Repository } from 'typeorm';
import { DummyPromise } from '../../../assets/promises.assets';
import { URL_Server } from '../../../config/server.config';

@Injectable()
export class PortsService {

    constructor(
        @InjectRepository(Port)
        private portRepository: Repository<Port>,
    ) { }


    // Registra un nuevo viaje
    async Create(port: Port): Promise<Port> {


        return DummyPromise().then(
            result => {
                if (URL_Server.bd === 'MSSQL') {

                    return this.portRepository.query(`SP_CheckTheLastPortTrip @userId='${port.userId}', @voyageId='${port.voyageId}'`);

                } else {
                    // Buscamos el viaje
                    return this.portRepository.find({
                        where: [
                            // name && surname && nick && email
                            {
                                userId: port.userId,
                                voyageId: port.voyageId,
                                status: true
                            }
                        ],
                        take: 1,
                        order: {
                            portNumber: 'DESC',
                        }
                    })
                }
            }
        ).then(
            (result: Port[]) => {
                // result length 
                if (result && (result.length > 0)) {

                    // Aqui deberiamos sumar el ultimo puerto, pero no lo aremos registraremos el puerot tal cual es.
                    port.portNumber = port.portNumber;
                }
                else {
                    port.portNumber = 1;
                };


                if (URL_Server.bd === 'MSSQL') {

                    // Ejecutamos el storeProceude creado.
                    return this.portRepository.query(`
                        EXEC SP_CreateNewPort
                        @userId = ${port.userId},
                        @voyageId = ${port.voyageId},
                        @portNumber = ${port.portNumber},
                        @departurePort = '${port.departurePort}',
                        @arrivalPort = '${port.arrivalPort}',
                        @userIdCreated = ${port.userId},
                        @dateCreated = '${port.dateCreated}',
                        @userIdUpdated = ${port.userIdUpdated || 0},
                        @dateUpdated ='${port.dateUpdated || null}',
                        @status =${port.status ? 1 : 0}
                    `);

                } else {
                    return this.portRepository.save(port)
                }
            }
        ).then(
            (resultSave) => {
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
                return resultSave;
            }
        )



    }

    // Retorna a un objeto por id.
    async Get(id: Number): Promise<Port> {
        return DummyPromise().then(
            result => {
                if (URL_Server.bd === 'MSSQL') {
                    // Ejecutamos el storeProceude creado.
                    return this.portRepository.query(`
                  EXEC SP_BuscarPuertoPorId  @portId = ${id}
              `)
                } else {
                    return this.portRepository.findOne({
                        where: {
                            id: id,
                            status: Not(false)
                        }
                    })
                }

            }).then(
                (resultFind) => {
                    // Validamos si encontro al usuario.
                    if (!resultFind) throw 'port_does_not_exist';
                    if (URL_Server.bd === 'MSSQL') {
                        if (resultFind && resultFind.length == 0) { throw 'port_does_not_exist' }
                        resultFind = resultFind[0];
                    }
                    // retornamos el objeto.
                    return resultFind;
                }
            );
    }

    // Retorna todos los viajes segun filtro.
    async Gets(port: Port): Promise<Port[]> {

        // Hacemos where por todos los campos de la entidad
        return await this.portRepository.find({
            where: [
                // name && surname && nick && email
                {
                    userId: Like('%' + (port.userId || '') + '%'),
                    voyageId: Like('%' + (port.voyageId || '') + '%'),
                    portNumber: Like('%' + (port.portNumber || '') + '%'),
                    departurePort: Like('%' + port.departurePort + '%'),
                    arrivalPort: Like('%' + port.arrivalPort + '%'),
                    status: Not(false)
                }
            ]
        }).then(
            (result: Port[]) => {

                // No lo validamos por que puede llegar vacio.

                return result;
            }
        )
    }

    // Retorna todos los viajes segun filtro.
    async GetsDetail(port: Port): Promise<Port[]> {

        // Hacemos where por todos los campos de la entidad
        return await this.portRepository.find({
            relations: ['dailyReports'],
            where: [
                // name && surname && nick && email
                {
                    userId: Like('%' + (port.userId || '') + '%'),
                    voyageId: Like('%' + (port.voyageId || '') + '%'),
                    portNumber: Like('%' + (port.portNumber || '') + '%'),
                    departurePort: Like('%' + port.departurePort + '%'),
                    arrivalPort: Like('%' + port.arrivalPort + '%'),
                    status: Not(false)
                }
            ]
        }).then(
            (result: Port[]) => {
                // No lo validamos por que puede llegar vacio.

                return result;
            }
        )
    }

    // Actualiza un port
    async Update(port: Port): Promise<Port> {


        return DummyPromise().then(
            result => {
                if (URL_Server.bd === 'MSSQL') {

                    // Ejecutamos el storeProceude creado.
                    return this.portRepository.query(`
                  EXEC SP_BuscarPuertoPorId  @portId = ${port.id}
              `);

                } else {
                    return this.portRepository.find({
                        where: [
                            // hacemos un where donde buscamos por id.
                            { id: port.id }
                        ]
                    })
                }

            }
        ).then(resultFind => {

            // Validamos si encontro al SailingAnality.
            if (!resultFind) throw 'port_does_not_exist';
            // Validamos si encontro al SailingAnality.
            if (resultFind && resultFind.length == 0) throw 'port_does_not_exist';


            if (URL_Server.bd === 'MSSQL') {

                // Ejecutamos el storeProceude creado.
                return this.portRepository.query(`
              EXEC SP_UpdatePort
              @portId = ${port.id},
              @userId = ${port.userId},
              @voyageId = ${port.voyageId},
              @portNumber = ${port.portNumber},
              @departurePort = '${port.departurePort}',
              @arrivalPort = '${port.arrivalPort}',
              @userIdCreated = ${port.userId},
              @dateCreated = '${port.dateCreated}',
              @userIdUpdated = ${port.userIdUpdated || 0},
              @dateUpdated ='${port.dateUpdated || null}',
              @status =${port.status ? 1 : 0}
          `);

            } else {

                // Actualizamos
                return this.portRepository.update(port.id, port);
            }

        }).then(resultUpdate => {

            if (!resultUpdate) throw new Error('TYPEORM_UPDATE_VOYAGE');

            if (URL_Server.bd === 'MSSQL') {
                if (resultUpdate && resultUpdate.length == 0) {
                    throw new Error('ERROR SQLSERVER PROCEDURE NO SE EJECUTO');
                }
            }

            // Envio respuesta con el resultado recibido del ultimo paso
            return port;
        });
    }


    // Elimina a un port por id
    async Delete(port: Port): Promise<Port> {
        port.status = false;
        return DummyPromise().then(
            result => {
                if (URL_Server.bd === 'MSSQL') {

                    // Ejecutamos el storeProceude creado.
                    return this.portRepository.query(`
                      EXEC SP_UpdatePort
                      @portId = ${port.id},
                      @userId = ${port.userId},
                      @voyageId = ${port.voyageId},
                      @portNumber = ${port.portNumber},
                      @departurePort = '${port.departurePort}',
                      @arrivalPort = '${port.arrivalPort}',
                      @userIdCreated = ${port.userId},
                      @dateCreated = '${port.dateCreated}',
                      @userIdUpdated = ${port.userIdUpdated || 0},
                      @dateUpdated ='${port.dateUpdated || null}',
                      @status =${port.status ? 1 : 0}
                  `);

                } else {
                    return this.portRepository.update(port.id, port).then(
                        resultSave => {
                            // Validamos si encontro al usuario.
                            if (!resultSave) throw new Error('error_update_delete_port');

                            return port;
                        }
                    );
                }

            }
        ).then(resultUpdate => {

            if (!resultUpdate) throw new Error('TYPEORM_UPDATE_VOYAGE');

            if (URL_Server.bd === 'MSSQL') {
                if (resultUpdate && resultUpdate.length == 0) {

                    throw new Error('ERROR SQLSERVER PROCEDURE NO SE EJECUTO');
                }

                resultUpdate = resultUpdate[0];
            }

            // Envio respuesta con el resultado recibido del ultimo paso
            return port;
        });
    }



    // Permite consultar si el puerto existe en el viaje,
    // Retorna underfined si el puerto no existe.
    async ThereIsThisPortInTheVoyage(portNumber: number, voyageId: number, userId:number): Promise<Port> {

        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this.portRepository.query(`
                        SP_ThereIsThisPortInTheVoyage 
                            @voyageId='${voyageId}',
                            @portNumber='${portNumber}'
                    `);

                } else {

                    return this.portRepository.find({
                        where: [
                            // hacemos un where donde buscamos por id.
                            {
                                voyageId: voyageId,
                                portNumber: portNumber,
                                userId: userId
                            }
                        ],
                        take: 1,
                    });
                }

            }
        ).then(resultFind => {

            if (resultFind && resultFind.length) {
                let prueba = resultFind[0]
                return resultFind[0];
            }
            else {
                return null
            }

        }).catch(err => {
            throw '';
        });
    }
}
