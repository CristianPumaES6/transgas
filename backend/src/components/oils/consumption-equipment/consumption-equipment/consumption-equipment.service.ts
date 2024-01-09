import { Injectable } from '@nestjs/common';
import { OilEntity } from '../../../../models/oil.entity';

// Librerias de TypeOrm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Like } from "typeorm";
import { Not } from "typeorm";

// Otras librerias. 
import * as bcrypt from 'bcrypt';
import { ROUNDS_BCRYPT } from '../../../../config/bcrypt.config';
import { URL_Server } from '../../../../config/server.config'

// Modelos.
import { UserEntity } from '../../../../models/user.entity';
import { DummyPromise } from '../../../../assets/promises.assets';
import { ConvertMMDDYYYToYYYYMMDD, GetDate } from '../../../../assets/moment.assets';
import { ConsumptionEquipmentEntity } from 'src/models/consumptionEquipment.entity';

@Injectable()
export class ConsumptionEquipmentService {
    constructor(
        @InjectRepository(ConsumptionEquipmentEntity)
        private _ConsumptionEquipment: Repository<ConsumptionEquipmentEntity>,
    ) { }


    async Gets(consumptionEquipment: ConsumptionEquipmentEntity): Promise<ConsumptionEquipmentEntity[]> {

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

                    return this._ConsumptionEquipment.find({
                        where: [
                            // name && surname && nick && email
                            {
                                id: (consumptionEquipment.id || Like('%' + '%')),
                                userId: (consumptionEquipment.userId || Like('%' + '%')),
                                status: Not(false)
                            }
                        ]
                    });

                }


            }
        ).then(
            (result: ConsumptionEquipmentEntity[]) => {

                if (!result) throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.'

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }
}
