import { Injectable } from '@nestjs/common';
import { AbstractSessionPersistenceService, Session, SessionNotFoundException } from '../../../../domain';
import { SessionRepository } from '../repositories/SessionRepository';
import { SessionEntityFactory } from '../factories/SessionEntityFactory';
import { ParticipantPersistenceService } from './ParticipantPersistenceService';
import { TopicPersistenceService } from './TopicPersistenceService';

@Injectable()
export class SessionPersistenceService extends AbstractSessionPersistenceService {
    public constructor(
        private sessionRepository: SessionRepository,
        private sessionFactory: SessionEntityFactory,
        private participantPersistenceService: ParticipantPersistenceService,
        private topicPersistenceService: TopicPersistenceService,
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

        // set sub entities to undefined to avoid saving them, when saving the parent entity
        sessionEntity.participants = undefined;
        sessionEntity.topics = undefined;

        const savedSessionEntity = await this.sessionRepository.save(sessionEntity);
        const savedSession = this.sessionFactory.fromEntity(savedSessionEntity);

        // store new (unsaved) participants in the session
        // changes/mutations to participants should be made via the ParticipantPersistenceService
        const savedParticipants = await this.createEntitiesWithoutIdInSubCollection(
            session.getParticipants(),
            (participant) => this.participantPersistenceService.create(participant, savedSessionEntity),
        );
        savedSession.setParticipants(savedParticipants);

        // store new (unsaved) topics in the session
        // changes/mutations to topics should be made via the TopicPersistenceService
        const savedTopics = await this.createEntitiesWithoutIdInSubCollection(session.getTopics(), (topic) =>
            this.topicPersistenceService.create(topic, savedSessionEntity),
        );
        savedSession.setTopics(savedTopics);

        return savedSession;
    }

    public async findById(id: string): Promise<Session> {
        const session = await this.sessionRepository.findOne(id);

        if (!session) {
            throw new SessionNotFoundException(id);
        }

        return this.sessionFactory.fromEntity(session);
    }

    private async createEntitiesWithoutIdInSubCollection<T extends { getId: () => string }>(
        collection: T[],
        createFn: (item: T) => Promise<T>,
    ): Promise<T[]> {
        return Promise.all(
            collection.map((item) => {
                if (item.getId()) return item;

                return createFn(item);
            }),
        );
    }
}
