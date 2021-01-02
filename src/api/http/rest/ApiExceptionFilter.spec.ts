import { ArgumentsHost, HttpServer, Logger } from '@nestjs/common';
import { createMock } from '@golevelup/nestjs-testing';
import { TokenInvalidError } from '../../../infrastructure/security/jwt/TokenInvalidError';
import { TokenNotFoundError } from '../../../infrastructure/security/jwt/TokenNotFoundError';
import { SessionNotFoundException } from '../../../domain';
import { ParticipantForMandateNotExistingException } from '../../../domain/exception/ParticipantForMandateNotExistingException';
import { ParticipantAlreadyExistsException } from '../../../domain/exception/ParticipantAlreadyExistsException';
import { ParticipantDuplicatedException } from '../../../domain/exception/ParticipantDuplicatedException';
import { TopicAlreadyExistsException } from '../../../domain/exception/TopicAlreadyExistsException';
import { TopicDuplicatedException } from '../../../domain/exception/TopicDuplicatedException';
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

    it('should transform a SessionNotFoundException into a NotFoundException', () => {
        filter.catch(new SessionNotFoundException('sessionId'), argumentsHost);

        expect(server.reply).toHaveBeenCalledWith(
            argumentsHost.getArgByIndex(1),
            { error: 'Not Found', message: 'Session with the id sessionId not found', statusCode: 404 },
            404,
        );
    });

    it('should transform a ParticipantForMandateNotExistingException into a BadRequestException', () => {
        filter.catch(
            new ParticipantForMandateNotExistingException('clientId__mandatedParticipantId', 'clientId'),
            argumentsHost,
        );

        expect(server.reply).toHaveBeenCalledWith(
            argumentsHost.getArgByIndex(1),
            {
                error: 'Bad Request',
                message:
                    'Cannot create mandate for participant with id mandatedParticipantId. Participant does not exist',
                statusCode: 400,
            },
            400,
        );
    });

    it('should transform a ParticipantAlreadyExistsException into a BadRequestException', () => {
        filter.catch(
            new ParticipantAlreadyExistsException('clientId__mandatedParticipantId', 'clientId'),
            argumentsHost,
        );

        expect(server.reply).toHaveBeenCalledWith(
            argumentsHost.getArgByIndex(1),
            {
                error: 'Bad Request',
                message: 'Participant with id mandatedParticipantId already exists',
                statusCode: 400,
            },
            400,
        );
    });

    it('should transform a ParticipantDuplicatedException into a BadRequestException', () => {
        filter.catch(new ParticipantDuplicatedException('clientId__mandatedParticipantId', 'clientId'), argumentsHost);

        expect(server.reply).toHaveBeenCalledWith(
            argumentsHost.getArgByIndex(1),
            {
                error: 'Bad Request',
                message: 'Participant with id mandatedParticipantId occurs multiple times',
                statusCode: 400,
            },
            400,
        );
    });

    it('should transform a TopicAlreadyExistsException into a BadRequestException', () => {
        filter.catch(new TopicAlreadyExistsException('clientId__topicId', 'clientId'), argumentsHost);

        expect(server.reply).toHaveBeenCalledWith(
            argumentsHost.getArgByIndex(1),
            {
                error: 'Bad Request',
                message: 'Topic with id topicId already exists',
                statusCode: 400,
            },
            400,
        );
    });

    it('should transform a TopicDuplicatedException into a BadRequestException', () => {
        filter.catch(new TopicDuplicatedException('clientId__topicId', 'clientId'), argumentsHost);

        expect(server.reply).toHaveBeenCalledWith(
            argumentsHost.getArgByIndex(1),
            {
                error: 'Bad Request',
                message: 'Topic with id topicId occurs multiple times',
                statusCode: 400,
            },
            400,
        );
    });
});
