import { Injectable } from '@nestjs/common';

// Librerias de TypeOrm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';

// Modelos y servicios
import { UsersService } from '../users/users.service';
import { UserEntity } from '../../models/user.entity';

// Otras librerias. 
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

// Assets || Si es una class lo tego que poner en el constructor y como proverdor del modulo
import { AuthGuard } from '@nestjs/passport';
import { DummyPromise } from '../../assets/promises.assets';

@Injectable()
export class AuthService {

    
    // inicializo el usersServicio en el constructor.
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    // creo la validacion por user and password
    async validateLogin(nick: string, password: string): Promise<UserEntity> {

        // creamos un objeto user para almacenar los datos del login.
        let user: UserEntity = <UserEntity>{};

        // buscamos si el nick o email existe.
        return await this.usersService.GetUserByNick(nick)
            .then(
                (resultfindUser) => {
                    
                    if (!resultfindUser) throw new Error('there_is_no_email');

                    if (!resultfindUser.status) throw 'account_status_false';

                    // Guardamos el resultado para luego usarlo.
                    user = resultfindUser;
                    // Comparamos si el password es correcto.
                    return bcrypt.compare(password, resultfindUser.password);

                }
            ).then(
                (checkComparePsw: boolean) => {
                    // Valido el resultado de la comparacion del password.
                    if (checkComparePsw) {
                        // Borramos el psw para que nunca llegue a cliente.
                        user.password = null;
                    } else {
                        // Si el password no es el correcto, generamos un error para no continuar.
                        throw new Error('there_is_no_password');
                    }

                    return user;
                }
            );
    }


    // Generamos el token.
    async generateTokenForGuards(user: any): Promise<string> {

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role
        };

        // Ejecutamos las funciones de promesas.
        return await DummyPromise().then(
            result => {
                if (!result) throw ('Error en la respuesta del DummyPromise.')
                return this.jwtService.sign(payload);
            }
        )
    }

}
