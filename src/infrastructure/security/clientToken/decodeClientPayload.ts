import { verify } from 'jsonwebtoken';
import Joi from 'joi';
import { TokenInvalidError } from '../jwt/TokenInvalidError';
import { ClientTokenPayload } from './ClientTokenPayload';

function verifyToken(token: string): ClientTokenPayload {
    try {
        return verify(token, process.env.JWT_CLIENT_TOKEN_SECRET) as ClientTokenPayload;
    } catch (e) {
        throw new TokenInvalidError(e.message);
    }
}

export function decodeClientPayload(authorizationHeader: string | undefined): ClientTokenPayload {
    const token = authorizationHeader?.replace(/^Bearer /i, '');

    const payload = verifyToken(token);

    const validation = Joi.object({
        sub: Joi.string().required(),
        exp: Joi.number().required(),
        sess: Joi.string().required(),
        ptc: Joi.string().required(),
    }).required();

    const { value, error } = validation.validate(payload, { allowUnknown: true, stripUnknown: false });

    if (error) {
        throw new TokenInvalidError(error.message);
    }

    if (new Date().getTime() > new Date(value.exp).getTime()) {
        throw new TokenInvalidError('Token expired');
    }

    return value;
}
