import { BadRequestException, Catch, HttpException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TokenInvalidError } from '../../../infrastructure/security/jwt/TokenInvalidError';
import { TokenNotFoundError } from '../../../infrastructure/security/jwt/TokenNotFoundError';
import {
    ParticipantAlreadyExistsException,
    ParticipantDuplicatedException,
    ParticipantForMandateNotExistingException,
    SessionNotFoundException,
    TopicAlreadyExistsException,
    TopicDuplicatedException,
} from '../../../domain';
import { AbstractExceptionFilter, ExceptionMap } from '../../AbstractExceptionFilter';
import { ExternalIdComposer } from './voting/session/factory/ExternalIdComposer';

@Catch()
export class ApiExceptionFilter extends AbstractExceptionFilter {
    private externalIdComposer = new ExternalIdComposer();

    protected get exceptionMap(): ExceptionMap<HttpException> {
        return {
            [TokenInvalidError.name]: (e: Error): HttpException => new UnauthorizedException(e.message),
            [TokenNotFoundError.name]: (e: Error): HttpException => new UnauthorizedException(e.message),
            [SessionNotFoundException.name]: (e: Error): HttpException => new NotFoundException(e.message),
            [ParticipantForMandateNotExistingException.name]: (
                e: ParticipantForMandateNotExistingException,
            ): HttpException =>
                new BadRequestException(
                    `Cannot create mandate for participant with id ${this.externalIdComposer.decompose(
                        e.id,
                        e.clientId,
                    )}. Participant does not exist`,
                ),
            [ParticipantAlreadyExistsException.name]: (e: ParticipantAlreadyExistsException): HttpException =>
                new BadRequestException(
                    `Participant with id ${this.externalIdComposer.decompose(e.id, e.clientId)} already exists`,
                ),
            [ParticipantDuplicatedException.name]: (e: ParticipantDuplicatedException): HttpException =>
                new BadRequestException(
                    `Participant with id ${this.externalIdComposer.decompose(e.id, e.clientId)} occurs multiple times`,
                ),
            [TopicAlreadyExistsException.name]: (e: TopicAlreadyExistsException): HttpException =>
                new BadRequestException(
                    `Topic with id ${this.externalIdComposer.decompose(e.id, e.clientId)} already exists`,
                ),
            [TopicDuplicatedException.name]: (e: TopicDuplicatedException): HttpException =>
                new BadRequestException(
                    `Topic with id ${this.externalIdComposer.decompose(e.id, e.clientId)} occurs multiple times`,
                ),
        };
    }
}
