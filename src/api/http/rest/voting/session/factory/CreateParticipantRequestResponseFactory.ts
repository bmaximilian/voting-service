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
            participant.setMandates(
                request.mandates.map(
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
        return {
            id: this.externalIdComposer.decompose(participant.getExternalId(), clientId),
        };
    }
}
