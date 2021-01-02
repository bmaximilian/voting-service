import { BaseExceptionFilter } from '@nestjs/core';
import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    HttpException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { TokenInvalidError } from '../../../infrastructure/security/jwt/TokenInvalidError';
import { TokenNotFoundError } from '../../../infrastructure/security/jwt/TokenNotFoundError';
import { SessionNotFoundException } from '../../../domain';
import { ParticipantForMandateNotExistingException } from '../../../domain/exception/ParticipantForMandateNotExistingException';
import { ParticipantAlreadyExistsException } from '../../../domain/exception/ParticipantAlreadyExistsException';
import { ParticipantDuplicatedException } from '../../../domain/exception/ParticipantDuplicatedException';
import { ExternalIdComposer } from './voting/session/factory/ExternalIdComposer';

@Catch()
export class ApiExceptionFilter extends BaseExceptionFilter {
    private externalIdComposer = new ExternalIdComposer();

    private exceptionMap: Record<string, (error: Error) => HttpException> = {
        [TokenInvalidError.name]: (e: Error) => new UnauthorizedException(e.message),
        [TokenNotFoundError.name]: (e: Error) => new UnauthorizedException(e.message),
        [SessionNotFoundException.name]: (e: Error) => new NotFoundException(e.message),
        [ParticipantForMandateNotExistingException.name]: (e: ParticipantForMandateNotExistingException) =>
            new BadRequestException(
                `Cannot create mandate for participant with id ${this.externalIdComposer.decompose(
                    e.id,
                    e.clientId,
                )}. Participant does not exist`,
            ),
        [ParticipantAlreadyExistsException.name]: (e: ParticipantAlreadyExistsException) =>
            new BadRequestException(
                `Participant with id ${this.externalIdComposer.decompose(e.id, e.clientId)} already exists`,
            ),
        [ParticipantDuplicatedException.name]: (e: ParticipantDuplicatedException) =>
            new BadRequestException(
                `Participant with id ${this.externalIdComposer.decompose(e.id, e.clientId)} occurs multiple times`,
            ),
    };

    /**
     * Catches and processes the exception
     *
     * @param exception - Thrown error
     * @param host - Argument host
     */
    public catch(exception: Error, host: ArgumentsHost): void {
        super.catch(this.transformException(exception), host);
    }

    /**
     * Transforms internal exceptions to related api exceptions
     *
     * @param exception - Thrown error
     * @returns The transformed error
     */
    private transformException(exception: Error): Error {
        const httpExceptionFactoryMethodKey = Object.keys(this.exceptionMap).find(
            (className) => exception.constructor.name === className,
        );

        if (!httpExceptionFactoryMethodKey) {
            return exception;
        }

        return this.exceptionMap[httpExceptionFactoryMethodKey](exception);
    }
}
