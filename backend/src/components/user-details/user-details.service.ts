import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetailEntity } from 'src/models/user-detail.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class UserDetailsService {

    constructor(
        @InjectRepository(UserDetailEntity)
        private userDetailEntityRepository: Repository<UserDetailEntity>,
    ) { }

    async Get(id: number): Promise<UserDetailEntity> {

        // Hacemos una busqueda por id
        return await this.userDetailEntityRepository.findOne({
            where: {
                id: id,
                status: Not(false)
            }
        }).then(
            resultFind => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('user_detail_does_not_exist');

                // retornamos el objeto.
                return resultFind;
            });
    }

    async Create(userDetail: UserDetailEntity): Promise<UserDetailEntity> {

        return await this.userDetailEntityRepository.save(userDetail).then(
            (resultSave: UserDetailEntity) => {
                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('ERROR_USER_DETAIL_SERVICE');
                return resultSave;
            }
        );

    }

    async Update(userDetail: UserDetailEntity): Promise<UserDetailEntity> {

        // Hacemos una busqueda por id
        return await this.userDetailEntityRepository.update(userDetail.id, userDetail).then(
            resultUpdate => {

                if (!resultUpdate) throw new Error('userDetailEntityRepository.update no respondio como esperabamos.');
                
                // Envio respuesta con el resultado recibido del ultimo paso
                return userDetail;
            });
    }

}
