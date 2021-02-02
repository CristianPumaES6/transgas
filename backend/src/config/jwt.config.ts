import { ROUNDS_BCRYPT } from './bcrypt.config';

export const JWTCONFIG = {
    secret: 'secretKey',
    signOptions: { expiresIn: '31 days' },
};

