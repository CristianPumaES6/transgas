import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWTCONFIG } from '../../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    // Invocamos el constructor.
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWTCONFIG.secret,
        });
    }
    // Esta funcion es la que se ejecuta cuando llamamos el guards
    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}

