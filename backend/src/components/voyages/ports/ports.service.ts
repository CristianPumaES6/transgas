import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Port } from 'src/models/port.entity';
import { Like, Not, Repository } from 'typeorm';

@Injectable()
export class PortsService {

    constructor(
        @InjectRepository(Port)
        private portRepository: Repository<Port>,
    ) { }


    // Registra un nuevo viaje
    async Create(port: Port): Promise<Port> {
        return await this.portRepository.find({
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
        }).then(
            (result: Port[]) => {
                // result length 
                if (result && (result.length > 0)) {
                    port.portNumber = Number(result[0].portNumber) + 1;
                }
                else {
                    port.portNumber = 1;
                };

                return this.portRepository.save(port)
            }
        ).then(
            (resultSave: Port) => {
                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('No se puedo registrar el viaje en la BD.');

                return resultSave;
            }
        );



    }

    // Retorna a un objeto por id.
    async Get(id: Number): Promise<Port> {
        // Hacemos una busqueda por id
        return await this.portRepository.findOne({
            where: {
                id: id,
                status: Not(false)
            }
        }).then(
            (resultFind: Port) => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw 'port_does_not_exist';

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

        // Hacemos una busqueda por id
        return await this.portRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                { id: port.id }
            ]
        }).then(resultFind => {

            // Validamos si encontro al SailingAnality.
            if (!resultFind) throw 'port_does_not_exist';

            // Actualizamos
            return this.portRepository.update(port.id, port);

        }).then(resultUpdate => {

            if (!resultUpdate) throw new Error('TYPEORM_UPDATE_VOYAGE');

            // Envio respuesta con el resultado recibido del ultimo paso
            return port;
        });
    }


    // Elimina a un port por id
    async Delete(port: Port): Promise<Port> {
        port.status = false;

        // Eliminamos de la base de dato al usuario.
        return await this.portRepository.update(port.id, port).then(
            resultSave => {
                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('error_update_delete_port');

                return port;
            }
        );
    }



    // Permite consultar si el puerto existe en el viaje,
    // Retorna underfined si el puerto no existe.
    async ThereIsThisPortInTheVoyage(numeroPuerto: number, voyageId: number): Promise<Port> {

        return await this.portRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                {
                    voyageId: voyageId,
                    portNumber: numeroPuerto,
                }
            ]
        }).then(resultFind => {

            // No vlaidamos resultado por que tambien puede ser underfine.

            // Enviamos el puerto encontrado.
            return resultFind;

        });
    }
}
