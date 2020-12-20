import { Request, Response } from 'express';
import { createMock } from '@golevelup/nestjs-testing';
import { sign } from 'jsonwebtoken';
import { JwtDecodeMiddleware } from './JwtDecodeMiddleware';
import { TokenNotFoundError } from './TokenNotFoundError';
import { TokenInvalidError } from './TokenInvalidError';

describe('JwtDecodeMiddleware', () => {
    let middleware: any;
    let logger: any;
    const response = createMock<Response>();

    beforeEach(() => {
        logger = { error: jest.fn() };
        middleware = new JwtDecodeMiddleware();
        (middleware as any).logger = logger;
    });

    it('should be defined', () => {
        expect(middleware).toBeDefined();
        expect(middleware).toBeInstanceOf(JwtDecodeMiddleware);
    });

    it('should throw TokenNotFound when no authorization token is passed', () => {
        const next = jest.fn();
        const request = createMock<Request>({
            headers: {
                authorization: undefined,
            },
        });

        expect(() => {
            middleware.use(request, response, next);
        }).toThrow(TokenNotFoundError);

        expect(next).not.toHaveBeenCalled();
    });

    it('should validate the decoded token', () => {
        const next = jest.fn();
        const request = createMock<Request>({
            headers: {
                authorization: sign({ invalid: 'foo' }, 'top-secret'),
            },
        });

        expect(() => {
            middleware.use(request, response, next);
        }).toThrow(TokenInvalidError);

        expect(next).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalled();
    });

    it('should attach the parsed token to the request', () => {
        const next = jest.fn();
        const request = createMock<Request>({
            headers: {
                authorization: sign({ sub: 'user-id' }, 'top-secret'),
            },
        });

        middleware.use(request, response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(logger.error).not.toHaveBeenCalled();
        expect((request as any).authorizationToken).toBeDefined();
        expect((request as any).authorizationToken.sub).toBeString();
        expect((request as any).authorizationToken.sub).toEqual('user-id');
    });
});
