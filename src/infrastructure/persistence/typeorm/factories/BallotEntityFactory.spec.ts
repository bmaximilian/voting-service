import { createMock } from '@golevelup/nestjs-testing';
import { BallotEntity } from '../entities/BallotEntity';
import { TopicEntity } from '../entities/TopicEntity';
import { ParticipantEntity } from '../entities/ParticipantEntity';
import { Mandate, Participant } from '../../../../domain';
import { MandateEntity } from '../entities/MandateEntity';
import { Ballot } from '../../../../domain/model/Ballot';
import { ParticipantEntityFactory } from './ParticipantEntityFactory';
import { BallotEntityFactory } from './BallotEntityFactory';

describe('BallotEntityFactory', () => {
    let participantFactory: ParticipantEntityFactory;
    let factory: BallotEntityFactory;

    beforeEach(() => {
        participantFactory = new ParticipantEntityFactory();
        factory = new BallotEntityFactory(participantFactory);
    });

    it('should convert a ballot without mandate from entity', () => {
        jest.spyOn(participantFactory, 'fromEntity');

        const ballotEntity = new BallotEntity();
        ballotEntity.answerOption = 'yes';
        ballotEntity.updatedAt = new Date();
        ballotEntity.createdAt = new Date();
        ballotEntity.id = 'ballotId';
        ballotEntity.topic = createMock<TopicEntity>();
        ballotEntity.participant = new ParticipantEntity();
        ballotEntity.participant.id = 'participantId';
        ballotEntity.participant.externalId = 'externalParticipantId';
        ballotEntity.participant.shares = 15;
        ballotEntity.participant.createdAt = new Date();
        ballotEntity.participant.updatedAt = new Date();

        const ballot = factory.fromEntity(ballotEntity);

        expect(participantFactory.fromEntity).toBeCalledWith(ballotEntity.participant);
        expect(participantFactory.fromEntity).toBeCalledTimes(1);

        expect(ballot.getId()).toEqual('ballotId');
        expect(ballot.getAnswerOption()).toEqual('yes');
        expect(ballot.getMandate()).toBeUndefined();
        expect(ballot.getParticipant()).toBeInstanceOf(Participant);
    });

    it('should convert a ballot with mandate from entity', () => {
        jest.spyOn(participantFactory, 'fromEntity');

        const ballotEntity = new BallotEntity();
        ballotEntity.answerOption = 'yes';
        ballotEntity.updatedAt = new Date();
        ballotEntity.createdAt = new Date();
        ballotEntity.id = 'ballotId';
        ballotEntity.topic = createMock<TopicEntity>();
        ballotEntity.participant = new ParticipantEntity();
        ballotEntity.participant.id = 'participantId';
        ballotEntity.participant.externalId = 'externalParticipantId';
        ballotEntity.participant.shares = 15;
        ballotEntity.participant.createdAt = new Date();
        ballotEntity.participant.updatedAt = new Date();
        ballotEntity.mandate = new MandateEntity();
        ballotEntity.mandate.id = 'mandateId';
        ballotEntity.mandate.createdAt = new Date();
        ballotEntity.mandate.updatedAt = new Date();
        ballotEntity.mandate.participant = ballotEntity.participant;
        ballotEntity.mandate.mandatedBy = new ParticipantEntity();
        ballotEntity.mandate.mandatedBy.id = 'participantId';
        ballotEntity.mandate.mandatedBy.externalId = 'externalParticipantId';
        ballotEntity.mandate.mandatedBy.shares = 15;
        ballotEntity.mandate.mandatedBy.createdAt = new Date();
        ballotEntity.mandate.mandatedBy.updatedAt = new Date();
        ballotEntity.mandate.mandatedBy.mandates = [ballotEntity.mandate];

        const ballot = factory.fromEntity(ballotEntity);

        expect(participantFactory.fromEntity).toBeCalledWith(ballotEntity.participant);
        expect(participantFactory.fromEntity).toBeCalledWith(ballotEntity.mandate.participant);
        expect(participantFactory.fromEntity).toBeCalledTimes(2);

        expect(ballot.getId()).toEqual('ballotId');
        expect(ballot.getAnswerOption()).toEqual('yes');
        expect(ballot.getMandate().getParticipant()).toBeInstanceOf(Participant);
        expect(ballot.getMandate().getId()).toEqual('mandateId');
        expect(ballot.getParticipant()).toBeInstanceOf(Participant);
    });

    it('should convert a ballot to entity', () => {
        jest.spyOn(participantFactory, 'toEntity');

        const participant = new Participant('externalParticipantId', 10, 'participantId');
        const ballot = new Ballot(participant, 'yes', undefined, 'ballotId');

        const entity = factory.toEntity(ballot);

        expect(participantFactory.toEntity).toHaveBeenCalledTimes(1);
        expect(participantFactory.toEntity).toHaveBeenCalledWith(participant);

        expect(entity.id).toEqual('ballotId');
        expect(entity.participant.id).toEqual('participantId');
        expect(entity.participant.externalId).toEqual('externalParticipantId');
        expect(entity.answerOption).toEqual('yes');
        expect(entity.mandate).toBeUndefined();
    });

    it('should convert a ballot with mandate to entity', () => {
        jest.spyOn(participantFactory, 'toEntity');

        const mandatedParticipant = new Participant('externalMandatedParticipantId', 15, 'mandatedParticipantId');
        const ballot = new Ballot(
            mandatedParticipant,
            'yes',
            new Mandate(mandatedParticipant, 'mandateId'),
            'ballotId',
        );

        const entity = factory.toEntity(ballot);

        expect(participantFactory.toEntity).toHaveBeenCalledTimes(2);
        expect(participantFactory.toEntity).toHaveBeenCalledWith(mandatedParticipant);

        expect(entity.id).toEqual('ballotId');
        expect(entity.participant.id).toEqual('mandatedParticipantId');
        expect(entity.participant.externalId).toEqual('externalMandatedParticipantId');
        expect(entity.answerOption).toEqual('yes');
        expect(entity.mandate.id).toEqual('mandateId');
    });
});
