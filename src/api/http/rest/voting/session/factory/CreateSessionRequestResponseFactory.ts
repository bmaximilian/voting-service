import { Injectable } from '@nestjs/common';
import { Session } from '../../../../../../domain';
import { SessionCreateResponse } from '../response/SessionCreateResponse';
import { CreateSessionRequest } from '../request/CreateSessionRequest';
import { CreateSessionParticipant } from '../request/CreateSessionParticipant';
import { CreateSessionTopic } from '../request/CreateSessionTopic';
import { CreateParticipantRequestResponseFactory } from './CreateParticipantRequestResponseFactory';
import { CreateTopicRequestResponseFactory } from './CreateTopicRequestResponseFactory';

@Injectable()
export class CreateSessionRequestResponseFactory {
    public constructor(
        private participantFactory: CreateParticipantRequestResponseFactory,
        private topicFactory: CreateTopicRequestResponseFactory,
    ) {}

    public createSession(request: CreateSessionRequest, clientId: string): Session {
        const session = new Session(clientId, request.start);

        if (request.participants) {
            this.setSessionParticipants(session, request.participants);
        }

        if (request.topics) {
            this.setSessionTopics(session, request.topics);
        }

        return session;
    }

    public createResponse(session: Session): SessionCreateResponse {
        const response = new SessionCreateResponse();
        response.id = session.getId();
        response.start = session.getStart();
        response.end = session.getEnd();
        response.participants = session
            .getParticipants()
            .map((participant) => this.participantFactory.toResponse(participant, session.getClientId()));
        response.topics = session
            .getTopics()
            .map((topic) => this.topicFactory.toResponse(topic, session.getClientId()));

        return response;
    }

    private setSessionParticipants(session: Session, participants: CreateSessionParticipant[]): void {
        session.setParticipants(
            participants.map((participantRequest) =>
                this.participantFactory.fromRequest(participantRequest, session.getClientId()),
            ),
        );
    }

    private setSessionTopics(session: Session, topics: CreateSessionTopic[]): void {
        session.setTopics(
            topics.map((topicRequest) => this.topicFactory.fromRequest(topicRequest, session.getClientId())),
        );
    }
}
