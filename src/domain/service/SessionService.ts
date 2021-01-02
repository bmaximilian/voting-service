import { Injectable } from '@nestjs/common';
import { Session } from '../model/Session';
import { AbstractSessionPersistenceService } from '../persistence/AbstractSessionPersistenceService';
import { Topic } from '../model/Topic';
import { Participant } from '../model/Participant';
import { Mandate } from '../model/Mandate';
import { ParticipantForMandateNotExistingException } from '../exception/ParticipantForMandateNotExistingException';
import { ParticipantAlreadyExistsException } from '../exception/ParticipantAlreadyExistsException';
import { ParticipantDuplicatedException } from '../exception/ParticipantDuplicatedException';
import { TopicAlreadyExistsException } from '../exception/TopicAlreadyExistsException';
import { TopicDuplicatedException } from '../exception/TopicDuplicatedException';

@Injectable()
export class SessionService {
    public constructor(private sessionPersistenceService: AbstractSessionPersistenceService) {}

    public async create(session: Session): Promise<Session> {
        try {
            this.validateParticipants(session);
        } catch (e) {
            throw new ParticipantDuplicatedException(e.id, e.clientId);
        }

        try {
            this.validateTopics(session);
        } catch (e) {
            throw new TopicDuplicatedException(e.id, e.clientId);
        }

        this.validateMandatesForParticipants(session);

        return this.sessionPersistenceService.create(session);
    }

    public async addTopic(sessionId: string, topic: Topic): Promise<Topic> {
        const session = await this.sessionPersistenceService.findById(sessionId);

        session.addTopic(topic);

        this.validateTopics(session);
        const savedSession = await this.sessionPersistenceService.save(session);

        return savedSession.getTopics().find((savedTopic) => savedTopic.getExternalId() === topic.getExternalId());
    }

    public async addParticipant(sessionId: string, participant: Participant): Promise<Participant> {
        const session = await this.sessionPersistenceService.findById(sessionId);

        session.addParticipant(participant);

        this.validateParticipants(session);
        this.validateMandatesForParticipants(session);
        const savedSession = await this.sessionPersistenceService.save(session);

        return savedSession
            .getParticipants()
            .find((savedParticipant) => savedParticipant.getExternalId() === participant.getExternalId());
    }

    private validateParticipants(session: Session): void {
        const externalParticipantIds = new Set();

        session.getParticipants().forEach((participant) => {
            if (externalParticipantIds.has(participant.getExternalId())) {
                throw new ParticipantAlreadyExistsException(participant.getExternalId(), session.getClientId());
            }

            externalParticipantIds.add(participant.getExternalId());
        });
    }

    private validateTopics(session: Session): void {
        const externalTopicIds = new Set();

        session.getTopics().forEach((topic) => {
            if (externalTopicIds.has(topic.getExternalId())) {
                throw new TopicAlreadyExistsException(topic.getExternalId(), session.getClientId());
            }

            externalTopicIds.add(topic.getExternalId());
        });
    }

    private validateMandatesForParticipants(session: Session): void {
        const mandateWithoutParticipant = session.getParticipants().reduce((currentMandate, participant) => {
            if (currentMandate || participant.getMandates().length === 0) return currentMandate;

            return participant.getMandates().find((mandate) => {
                const mandatedParticipantIndex = session
                    .getParticipants()
                    .findIndex(
                        (mandatedParticipant) =>
                            mandatedParticipant.getExternalId() === mandate.getParticipant().getExternalId(),
                    );

                return mandatedParticipantIndex === -1 ? mandate : undefined;
            });
        }, undefined as Mandate | undefined);

        if (mandateWithoutParticipant) {
            throw new ParticipantForMandateNotExistingException(
                mandateWithoutParticipant.getParticipant().getExternalId(),
                session.getClientId(),
            );
        }
    }
}
