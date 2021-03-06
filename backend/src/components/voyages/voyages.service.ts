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

@Injectable()
export class VoyagesService {

    constructor(
        @InjectRepository(Voyage)
        private voyageRepository: Repository<Voyage>,
    ) { }


    // Registra un nuevo viaje
    async Create(voyage: Voyage): Promise<Voyage> {


        // Hacemos where por todos los campos de la entidad
        return await this.voyageRepository.find({
            where: [
                // name && surname && nick && email
                {
                    userId: voyage.userId,
                }
            ],
            take: 1,
            order: {
                voyageNumber: 'DESC',
            }
        }).then(
            (result: Voyage[]) => {
                // result length 
                if (result && (result.length > 0)) {
                    voyage.voyageNumber = Number(result[0].voyageNumber) + 1;
                }
                else {
                    voyage.voyageNumber = 1;
                };

                // No lo validamos por que puede llegar vacio.
                return this.voyageRepository.save(voyage)
            }
        ).then(
            (resultSave: Voyage) => {
                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('No se puedo registrar el viaje en la BD.');

                return resultSave;
            }
        );

    }

    // Retorna a un objeto por id.
    async Get(id: Number): Promise<Voyage> {
        // Hacemos una busqueda por id
        return await this.voyageRepository.findOne({
            where: {
                id: id,
                status: Not(false)
            }
        }).then(
            (resultFind: Voyage) => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('voyage_does_not_exist');

                // retornamos el objeto.
                return resultFind;
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

        // Hacemos where por todos los campos de la entidad
        return await this.voyageRepository.find({
            relations: ["ports"],
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
        );

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
                voyageNumber: 'ASC',
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
        // Eliminamos de la base de dato al usuario.
        return await this.voyageRepository.update(voyage.id, voyage).then(
            resultSave => {

                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('error_update_delete_voyage');

                return voyage;
            }
        );
    }


}
