import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import Joi from 'joi';
import { TokenInvalidError } from './TokenInvalidError';
import { TokenNotFoundError } from './TokenNotFoundError';
import { ApiRequest, TokenPayload } from './ApiRequest';

@Injectable()
export class JwtDecodeMiddleware implements NestMiddleware {
    private readonly logger: Logger;

    public constructor() {
        this.logger = new Logger(JwtDecodeMiddleware.name);
    }

    /**
     * Apply the middleware at an incoming request
     *
     * @description Attaches the decoded user to the request
     * @param {Request} req - The express request
     * @param {Response} _res - The express response
     * @param {() => void} next - Apply the next middleware in the chain
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public use(req: Request, _res: Response, next: () => void): void {
        if (!req.headers.authorization) {
            throw new TokenNotFoundError();
        }

        try {
            const decoded = this.decodeToken(req.headers.authorization.replace(/^Bearer /i, ''));

            (req as ApiRequest).authorizationToken = decoded;
        } catch (e) {
            this.logger.error(e, 'JwtDecodeMiddleware');

            throw e;
        }

        next();
    }

    private decodeToken(token: string): TokenPayload {
        const payload = decode(token);

        const validation = Joi.object({
            sub: Joi.string().required(),
        }).required();

        const { value, error } = validation.validate(payload, { allowUnknown: true, stripUnknown: false });

        if (error) {
            throw new TokenInvalidError(error.message);
        }

        return value;
    }
}
