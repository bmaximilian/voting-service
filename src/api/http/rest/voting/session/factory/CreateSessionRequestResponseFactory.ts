import { Injectable } from '@nestjs/common';
import { Majority, Mandate, Session, Topic, Participant } from '../../../../../../domain';
import { SessionCreateResponse } from '../response/SessionCreateResponse';
import { CreateSessionRequest } from '../request/CreateSessionRequest';
import { CreateSessionParticipant } from '../request/CreateSessionParticipant';
import { CreateSessionTopic } from '../request/CreateSessionTopic';

@Injectable()
export class CreateSessionRequestResponseFactory {
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
        response.participants = session.getParticipants().map((participant) => ({
            id: this.decomposeExternalId(participant.getExternalId(), session.getClientId()),
        }));
        response.topics = session.getTopics().map((topic) => ({
            id: this.decomposeExternalId(topic.getExternalId(), session.getClientId()),
        }));

        return response;
    }

    private setSessionParticipants(session: Session, participants: CreateSessionParticipant[]): void {
        session.setParticipants(
            participants.map((participantRequest) => {
                const participant = new Participant(
                    this.composeExternalId(participantRequest.id, session.getClientId()),
                    participantRequest.shares,
                );

                if (participantRequest.mandates) {
                    participant.setMandates(
                        participantRequest.mandates.map(
                            (mandateId) =>
                                new Mandate(
                                    // shares is set to 0 because only the id matters for the mandate
                                    new Participant(this.composeExternalId(mandateId, session.getClientId()), 0),
                                ),
                        ),
                    );
                }

                return participant;
            }),
        );
    }

    private setSessionTopics(session: Session, topics: CreateSessionTopic[]): void {
        session.setTopics(
            topics.map((topicRequest) => {
                const majority = new Majority(topicRequest.majority.type, topicRequest.majority.quorumInPercent);
                const topic = new Topic(
                    this.composeExternalId(topicRequest.id, session.getClientId()),
                    majority,
                    topicRequest.requiredNumberOfShares,
                    topicRequest.answerOptions,
                    topicRequest.abstentionAnswerOption,
                );

                return topic;
            }),
        );
    }

    private composeExternalId(id: string, clientId: string): string {
        return `${clientId}__${id}`;
    }

    private decomposeExternalId(id: string, clientId: string): string {
        return id.substr(clientId.length + 2);
    }
}
