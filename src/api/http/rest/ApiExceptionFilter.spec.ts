import { ArgumentsHost, HttpServer, Logger } from '@nestjs/common';
import { createMock } from '@golevelup/nestjs-testing';
import { TokenInvalidError } from '../../../infrastructure/security/jwt/TokenInvalidError';
import { TokenNotFoundError } from '../../../infrastructure/security/jwt/TokenNotFoundError';
import { ApiExceptionFilter } from './ApiExceptionFilter';

describe('ApiExceptionFilter', () => {
    let filter: ApiExceptionFilter;
    let argumentsHost: ArgumentsHost;
    let server: HttpServer;

    beforeEach(() => {
        argumentsHost = createMock<ArgumentsHost>();
        server = createMock<HttpServer>();

        filter = new ApiExceptionFilter(server);
        Logger.overrideLogger([]);
    });

    it('should be defined', () => {
        expect(filter).toBeInstanceOf(ApiExceptionFilter);
    });

    it('should return the original exception when not in the map', () => {
        const error = new Error('unknown');

        filter.catch(error, argumentsHost);

        expect(server.reply).toHaveBeenCalledWith(
            argumentsHost.getArgByIndex(1),
            { statusCode: 500, message: 'Internal server error' },
            500,
        );
    });

    it('should transform a TokenInvalidError into a UnauthorizedException', () => {
        filter.catch(new TokenInvalidError('token invalid'), argumentsHost);

        expect(server.reply).toHaveBeenCalledWith(
            argumentsHost.getArgByIndex(1),
            { error: 'Unauthorized', message: 'Token is invalid: token invalid', statusCode: 401 },
            401,
        );
    });

    it('should transform a TokenNotFoundError into a UnauthorizedException', () => {
        filter.catch(new TokenNotFoundError(), argumentsHost);

        expect(server.reply).toHaveBeenCalledWith(
            argumentsHost.getArgByIndex(1),
            { error: 'Unauthorized', message: 'Token not found', statusCode: 401 },
            401,
        );
    });
});
