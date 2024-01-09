import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DummyPromise } from 'src/assets/promises.assets';
import { URL_Server } from 'src/config/server.config';
import {  BunkerOilToEquipmentEntity } from 'src/models/buker-oil-to-equipment.entity';
import { Like, Not, Repository } from 'typeorm';

@Injectable()
export class BunkerOilToEquipmentService {





    
    constructor(
        @InjectRepository(BunkerOilToEquipmentEntity)
        private _BunkerOilToEquipment: Repository<BunkerOilToEquipmentEntity>,
    ) { }


    async Gets(groupOilEntity: BunkerOilToEquipmentEntity): Promise<BunkerOilToEquipmentEntity[]> {

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

                    return this._BunkerOilToEquipment.find({
                        where: [
                            // name && surname && nick && email
                            {
                                id: (groupOilEntity.id || Like('%' + '%')),
                                userId: (groupOilEntity.userId || Like('%' + '%')),
                                status: Not(false)
                            }
                        ]
                    });

                }


            }
        ).then(
            (result: BunkerOilToEquipmentEntity[]) => {

                if (!result) throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.'

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }



}
