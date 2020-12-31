import { Injectable } from '@nestjs/common';
import { SessionEntity } from '../entities/SessionEntity';
import { Session } from '../../../../domain';
import { TopicEntityFactory } from './TopicEntityFactory';
import { ParticipantEntityFactory } from './ParticipantEntityFactory';

@Injectable()
export class SessionEntityFactory {
    public constructor(
        private topicFactory: TopicEntityFactory,
        private participantFactory: ParticipantEntityFactory,
    ) {}

    public toEntity(session: Session): SessionEntity {
        const sessionEntity = new SessionEntity();
        sessionEntity.clientId = session.getClientId();
        sessionEntity.end = session.getEnd();
        sessionEntity.start = session.getStart();
        sessionEntity.id = session.getId();

        if (session.getTopics().length > 0) {
            const topics = session.getTopics().map((topic) => this.topicFactory.toEntity(topic));

            sessionEntity.topics = topics;
        }

        if (session.getParticipants().length > 0) {
            const participants = session
                .getParticipants()
                .map((participant) => this.participantFactory.toEntity(participant));

            sessionEntity.participants = participants;

            // Note:
            // Mandates need to be saved separately to be sure the participant is saved before searching for mandate
        }

        return sessionEntity;
    }

    public fromEntity(entity: SessionEntity): Session {
        const session = new Session(entity.clientId, entity.start, entity.end, entity.id);

        if (entity.participants) {
            session.setParticipants(
                entity.participants.map((participant) => this.participantFactory.fromEntity(participant)),
            );
        }

        if (entity.topics) {
            session.setTopics(entity.topics.map((topic) => this.topicFactory.fromEntity(topic)));
        }

        return session;
    }
}
