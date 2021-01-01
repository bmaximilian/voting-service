import { Injectable } from '@nestjs/common';
import { AbstractSessionPersistenceService, Session, SessionNotFoundException } from '../../../../domain';
import { SessionRepository } from '../repositories/SessionRepository';
import { SessionEntityFactory } from '../factories/SessionEntityFactory';
import { ParticipantPersistenceService } from './ParticipantPersistenceService';

@Injectable()
export class SessionPersistenceService extends AbstractSessionPersistenceService {
    public constructor(
        private sessionRepository: SessionRepository,
        private sessionFactory: SessionEntityFactory,
        private participantPersistenceService: ParticipantPersistenceService,
    ) {
        super();
    }

    public async create(session: Session): Promise<Session> {
        const sessionEntity = this.sessionFactory.toEntity(session);

        const savedSession = await this.sessionRepository.save(sessionEntity);

        await this.participantPersistenceService.saveMandates(session.getParticipants(), savedSession.participants);

        return this.findById(savedSession.id);
    }

    public async save(session: Session): Promise<Session> {
        const sessionEntity = this.sessionFactory.toEntity(session);

        const savedSession = await this.sessionRepository.save(sessionEntity);

        return this.sessionFactory.fromEntity(savedSession);
    }

    public async findById(id: string): Promise<Session> {
        const session = await this.sessionRepository.findOne(id);

        if (!session) {
            throw new SessionNotFoundException(id);
        }

        return this.sessionFactory.fromEntity(session);
    }
}
