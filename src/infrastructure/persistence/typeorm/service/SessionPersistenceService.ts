import { Injectable } from '@nestjs/common';
import { AbstractSessionPersistenceService, Session } from '../../../../domain';
import { SessionRepository } from '../repositories/SessionRepository';
import { SessionEntityFactory } from '../factories/SessionEntityFactory';

@Injectable()
export class SessionPersistenceService extends AbstractSessionPersistenceService {
    public constructor(private sessionRepository: SessionRepository, private sessionFactory: SessionEntityFactory) {
        super();
    }

    public async create(session: Session): Promise<Session> {
        const sessionEntity = this.sessionFactory.toEntity(session);

        const savedSession = await this.sessionRepository.save(sessionEntity);

        // TODO: save mandates for participants
        // const participants = await this.participantsService.saveMandates(session.getParticipants())
        // this.sessionFactory.fromEntity(savedSession).setParticipants(participants);

        return this.sessionFactory.fromEntity(savedSession);
    }
}
