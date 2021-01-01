import { Injectable } from '@nestjs/common';
import { Session } from '../model/Session';
import { AbstractSessionPersistenceService } from '../persistence/AbstractSessionPersistenceService';
import { Topic } from '../model/Topic';

@Injectable()
export class SessionService {
    public constructor(private sessionPersistenceService: AbstractSessionPersistenceService) {}

    public async create(session: Session): Promise<Session> {
        return this.sessionPersistenceService.create(session);
    }

    public async addTopic(sessionId: string, topic: Topic): Promise<Topic> {
        const session = await this.sessionPersistenceService.findById(sessionId);

        session.addTopic(topic);

        const savedSession = await this.sessionPersistenceService.save(session);

        return savedSession.getTopics().find((savedTopic) => savedTopic.getExternalId() === topic.getExternalId());
    }
}
