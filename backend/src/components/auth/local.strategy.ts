import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';


import { DummyPromise } from '../../assets/promises.assets';
import { UserEntity } from '../../models/user.entity';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly authService: AuthService) { super(); }

    // Validamos al usuario y el password que viene desde el Guards
    async validate(username: string, password: string): Promise<any> {
        return await DummyPromise().then(
            result => {
                // Validamos el resultado
                if (!result) throw Error('Revisar la funcion DummyPromise(); no retorna lo esperado.')
                return this.authService.validateLogin(username, password);
            }
        ).then(
            (resultValidateLogin: UserEntity) => {
                // Validamos el resultado
                if (!resultValidateLogin) throw Error('El servicio de authenticacion no retorno lo esperado.')

                return resultValidateLogin;
            }
        ).catch(
            (err: any) => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // caso contrario retornamos un error

                throw new UnauthorizedException(errorMsg, clientMsg);
            }
        )
    }
}