import { ArgumentsHost, Logger } from '@nestjs/common';
import { createMock } from '@golevelup/nestjs-testing';
import { WsArgumentsHost } from '@nestjs/common/interfaces';
import { TokenInvalidError } from '../../infrastructure/security/jwt/TokenInvalidError';
import { TokenNotFoundError } from '../../infrastructure/security/jwt/TokenNotFoundError';
import { SessionNotFoundException } from '../../domain';
import { WebSocketExceptionFilter } from './WebSocketExceptionFilter';
import { ClientNotAuthorizedForSessionException } from './voting/exception/ClientNotAuthorizedForSessionException';
import { ParticipantNotAuthorizedForSessionException } from './voting/exception/ParticipantNotAuthorizedForSessionException';

describe('WebSocketExceptionFilter', () => {
    let filter: WebSocketExceptionFilter;
    let argumentsHost: ArgumentsHost;
    let client: { emit: (event: string, message: any) => void };

    beforeEach(() => {
        client = {
            emit: jest.fn(),
        };
        argumentsHost = createMock<ArgumentsHost>({
            switchToWs(): WsArgumentsHost {
                return createMock<WsArgumentsHost>({
                    getClient() {
                        return client;
                    },
                });
            },
        });

        filter = new WebSocketExceptionFilter();
        Logger.overrideLogger([]);
    });

    it('should be defined', () => {
        expect(filter).toBeInstanceOf(WebSocketExceptionFilter);
    });

    it('should return the original exception when not in the map', () => {
        const error = new Error('unknown');

        filter.catch(error, argumentsHost);

        expect(client.emit).toHaveBeenCalledWith('exception', { status: 'error', message: 'unknown' });
    });

    it('should transform a TokenInvalidError', () => {
        filter.catch(new TokenInvalidError('token invalid'), argumentsHost);

        expect(client.emit).toHaveBeenCalledWith('exception', {
            status: 'error',
            message: 'Token is invalid: token invalid',
        });
    });

    it('should transform a TokenNotFoundError', () => {
        filter.catch(new TokenNotFoundError(), argumentsHost);

        expect(client.emit).toHaveBeenCalledWith('exception', {
            status: 'error',
            message: 'Token not found',
        });
    });

    it('should transform a SessionNotFoundException', () => {
        filter.catch(new SessionNotFoundException('sessionId'), argumentsHost);

        expect(client.emit).toHaveBeenCalledWith('exception', {
            status: 'error',
            message: 'Session with the id sessionId not found',
        });
    });

    it('should transform a ClientNotAuthorizedForSessionException', () => {
        filter.catch(new ClientNotAuthorizedForSessionException(), argumentsHost);

        expect(client.emit).toHaveBeenCalledWith('exception', {
            status: 'error',
            message: 'Client is not authorized to connect to requested session',
        });
    });

    it('should transform a ParticipantNotAuthorizedForSessionException', () => {
        filter.catch(new ParticipantNotAuthorizedForSessionException(), argumentsHost);

        expect(client.emit).toHaveBeenCalledWith('exception', {
            status: 'error',
            message: 'Participant is not authorized to connect to requested session',
        });
    });
});
