import { Injectable } from '@nestjs/common';
import { Session } from '../model/Session';
import { AbstractSessionPersistenceService } from '../persistence/AbstractSessionPersistenceService';
import { Topic } from '../model/Topic';
import { Participant } from '../model/Participant';
import { Mandate } from '../model/Mandate';
import { ParticipantForMandateNotExistingException } from '../exception/ParticipantForMandateNotExistingException';

@Injectable()
export class SessionService {
    public constructor(private sessionPersistenceService: AbstractSessionPersistenceService) {}

    public async create(session: Session): Promise<Session> {
        this.validateMandatesForParticipants(session);

        return this.sessionPersistenceService.create(session);
    }

    public async addTopic(sessionId: string, topic: Topic): Promise<Topic> {
        const session = await this.sessionPersistenceService.findById(sessionId);

        session.addTopic(topic);

        const savedSession = await this.sessionPersistenceService.save(session);

        return savedSession.getTopics().find((savedTopic) => savedTopic.getExternalId() === topic.getExternalId());
    }

    public async addParticipant(sessionId: string, participant: Participant): Promise<Participant> {
        const session = await this.sessionPersistenceService.findById(sessionId);

        session.addParticipant(participant);

        this.validateMandatesForParticipants(session);
        const savedSession = await this.sessionPersistenceService.save(session);

        return savedSession
            .getParticipants()
            .find((savedParticipant) => savedParticipant.getExternalId() === participant.getExternalId());
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
