import { Injectable } from '@nestjs/common';
import { Mandate, Participant } from '../../../../../../domain';
import { CreateSessionParticipant } from '../request/CreateSessionParticipant';
import { SessionParticipantResponse } from '../response/SessionParticipantResponse';
import { ExternalIdComposer } from './ExternalIdComposer';

@Injectable()
export class CreateParticipantRequestResponseFactory {
    public constructor(private externalIdComposer: ExternalIdComposer) {}

    public fromRequest(request: CreateSessionParticipant, clientId: string): Participant {
        const participant = new Participant(this.externalIdComposer.compose(request.id, clientId), request.shares);

        if (request.mandates) {
            const mandates = new Set(request.mandates);

            participant.setMandates(
                Array.from(mandates).map(
                    (mandateId) =>
                        new Mandate(
                            // shares is set to 0 because only the id matters for the mandate
                            new Participant(this.externalIdComposer.compose(mandateId, clientId), 0),
                        ),
                ),
            );
        }

        return participant;
    }

    public toResponse(participant: Participant, clientId: string): SessionParticipantResponse {
        let mandates;

        if (participant.getMandates().length) {
            mandates = participant
                .getMandates()
                .map((mandate) =>
                    this.externalIdComposer.decompose(mandate.getParticipant().getExternalId(), clientId),
                );
        }

        return {
            id: this.externalIdComposer.decompose(participant.getExternalId(), clientId),
            shares: participant.getShares(),
            mandates,
        };
    }
}
