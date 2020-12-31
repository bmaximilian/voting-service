import { Ballot } from '../../../../domain/model/Ballot';
import { BallotEntity } from '../entities/BallotEntity';
import { Mandate } from '../../../../domain';
import { MandateEntity } from '../entities/MandateEntity';
import { ParticipantEntityFactory } from './ParticipantEntityFactory';

export class BallotEntityFactory {
    public constructor(private participantFactory: ParticipantEntityFactory) {}

    public fromEntity(entity: BallotEntity): Ballot {
        const ballot = new Ballot(this.participantFactory.fromEntity(entity.participant), entity.answerOption);

        if (entity.mandate) {
            const mandate = new Mandate(
                this.participantFactory.fromEntity(entity.mandate.participant),
                entity.mandate.id,
            );

            ballot.setMandate(mandate);
        }

        ballot.setId(entity.id);

        return ballot;
    }

    public toEntity(ballot: Ballot): BallotEntity {
        const entity = new BallotEntity();

        entity.id = ballot.getId();
        entity.participant = this.participantFactory.toEntity(ballot.getParticipant());
        entity.answerOption = ballot.getAnswerOption();

        if (ballot.getMandate()) {
            entity.mandate = new MandateEntity();
            entity.mandate.participant = this.participantFactory.toEntity(ballot.getMandate().getParticipant());
            entity.mandate.id = ballot.getMandate().getId();
        }

        return entity;
    }
}
