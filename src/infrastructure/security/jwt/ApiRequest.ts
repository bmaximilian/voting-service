import { Request } from 'express';

export interface TokenPayload {
    sub: string;
}

export interface ApiRequest extends Request {
    authorizationToken?: TokenPayload;
}
