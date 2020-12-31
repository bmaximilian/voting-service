import { Injectable } from '@nestjs/common';
import { Mandate, Participant } from '../../../../domain';
import { ParticipantEntity } from '../entities/ParticipantEntity';
import { MandateEntity } from '../entities/MandateEntity';

@Injectable()
export class ParticipantEntityFactory {
    public toEntity(participant: Participant, mandates?: MandateEntity[]): ParticipantEntity {
        const participantEntity = new ParticipantEntity();
        participantEntity.id = participant.getId();
        participantEntity.externalId = participant.getExternalId();
        participantEntity.shares = participant.getShares();

        if (mandates) {
            participantEntity.mandates = mandates;
        }

        return participantEntity;
    }

    public fromEntity(entity: ParticipantEntity): Participant {
        const mandates = entity.mandates?.map(
            (mandateEntity) => new Mandate(this.fromEntity(mandateEntity.participant), mandateEntity.id),
        );

        return new Participant(entity.externalId, entity.shares, entity.id, mandates);
    }
}
