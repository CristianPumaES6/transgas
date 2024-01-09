import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DummyPromise } from 'src/assets/promises.assets';
import { URL_Server } from 'src/config/server.config';
import { TypeOfOilEquipmentEntity } from 'src/models/type-of-oils-equipment.entity';
import { Like, Not, Repository } from 'typeorm';

@Injectable()
export class TypeOfOilEquipmentService {


    constructor(
        @InjectRepository(TypeOfOilEquipmentEntity)
        private _TypeOfOilEquimentEntity: Repository<TypeOfOilEquipmentEntity>,
    ) { }


    async Gets(groupOilEntity: TypeOfOilEquipmentEntity): Promise<TypeOfOilEquipmentEntity[]> {

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

                    return this._TypeOfOilEquimentEntity.find({
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
            (result: TypeOfOilEquipmentEntity[]) => {

                if (!result) throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.'

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }




}
