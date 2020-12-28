import { Majority, MajorityType, Mandate, Participant, Topic } from '../../../../domain';
import { Ballot } from '../../../../domain/model/Ballot';
import { TopicEntity } from '../entities/TopicEntity';
import { ParticipantEntity } from '../entities/ParticipantEntity';
import { BallotEntity } from '../entities/BallotEntity';
import { TopicEntityFactory } from './TopicEntityFactory';
import { BallotEntityFactory } from './BallotEntityFactory';
import { ParticipantEntityFactory } from './ParticipantEntityFactory';

describe('TopicEntityFactory', () => {
    let participantFactory: ParticipantEntityFactory;
    let ballotFactory: BallotEntityFactory;
    let factory: TopicEntityFactory;

    beforeEach(() => {
        participantFactory = new ParticipantEntityFactory();
        ballotFactory = new BallotEntityFactory(participantFactory);
        factory = new TopicEntityFactory(ballotFactory);
    });

    it('should convert a topic without ballots to entity', () => {
        const topic = new Topic(
            'externalId',
            new Majority(MajorityType.qualified, 66),
            50,
            ['yes', 'no', 'abstention'],
            'abstention',
            false,
            'topicId',
        );

        const entity = factory.toEntity(topic);

        expect(entity.ballots).toBeUndefined();
        expect(entity.completedAt).toBeUndefined();
        expect(entity.abstentionAnswerOption).toEqual('abstention');
        expect(entity.getAnswerOptions()).toEqual(['yes', 'no', 'abstention']);
        expect(entity.answerOptions).toEqual(JSON.stringify(['yes', 'no', 'abstention']));
        expect(entity.id).toEqual('topicId');
        expect(entity.requiredNumberOfSharesForQuorum).toEqual(50);
        expect(entity.majorityQuorumInPercent).toEqual(66);
        expect(entity.majorityType).toEqual(MajorityType.qualified);
        expect(entity.externalId).toEqual('externalId');
    });

    it('should convert a topic with ballots to entity', () => {
        const absentParticipant = new Participant('absentParticipant', 30, 'absentPartId');
        const votingParticipant = new Participant('extParticipant', 20, 'participantId', [
            new Mandate(absentParticipant, 'mandateId'),
        ]);
        const topic = new Topic(
            'externalId',
            new Majority(MajorityType.qualified, 66),
            50,
            ['yes', 'no', 'abstention'],
            'abstention',
            true,
            'topicId',
            [
                new Ballot(votingParticipant, 'yes', undefined, 'ballotId1'),
                new Ballot(absentParticipant, 'no', votingParticipant.getMandates()[0], 'ballotId2'),
            ],
        );

        const entity = factory.toEntity(topic);

        expect(entity.completedAt).toBeInstanceOf(Date);
        expect(entity.abstentionAnswerOption).toEqual('abstention');
        expect(entity.getAnswerOptions()).toEqual(['yes', 'no', 'abstention']);
        expect(entity.answerOptions).toEqual(JSON.stringify(['yes', 'no', 'abstention']));
        expect(entity.id).toEqual('topicId');
        expect(entity.requiredNumberOfSharesForQuorum).toEqual(50);
        expect(entity.majorityQuorumInPercent).toEqual(66);
        expect(entity.majorityType).toEqual(MajorityType.qualified);
        expect(entity.externalId).toEqual('externalId');
        expect(entity.ballots).toBeArrayOfSize(2);
        expect(entity.ballots[0].mandate).toBeUndefined();
        expect(entity.ballots[0].id).toEqual('ballotId1');
        expect(entity.ballots[0].answerOption).toEqual('yes');
        expect(entity.ballots[0].participant.id).toEqual('participantId');
        expect(entity.ballots[0].participant.externalId).toEqual('extParticipant');

        expect(entity.ballots[1].mandate.id).toEqual('mandateId');
        expect(entity.ballots[1].mandate.participant.id).toEqual('absentPartId');
        expect(entity.ballots[1].mandate.participant.externalId).toEqual('absentParticipant');
        expect(entity.ballots[1].id).toEqual('ballotId2');
        expect(entity.ballots[1].answerOption).toEqual('no');
        expect(entity.ballots[1].participant.id).toEqual('absentPartId');
        expect(entity.ballots[1].participant.externalId).toEqual('absentParticipant');
    });

    it('should create a topic from entity without ballots', () => {
        const entity = new TopicEntity();
        entity.externalId = 'externalTopicId';
        entity.id = 'topicId';
        entity.majorityType = MajorityType.qualified;
        entity.majorityQuorumInPercent = 70;
        entity.requiredNumberOfSharesForQuorum = 50;
        entity.setAnswerOptions(['yes', 'no']);
        entity.abstentionAnswerOption = 'no';
        entity.completedAt = new Date();
        entity.updatedAt = new Date();
        entity.createdAt = new Date();

        const topic = factory.fromEntity(entity);

        expect(topic.getId()).toEqual('topicId');
        expect(topic.getExternalId()).toEqual('externalTopicId');
        expect(topic.getRequiredNumberOfShares()).toEqual(50);
        expect(topic.getAnswerOptions()).toBeArrayOfSize(2);
        expect(topic.getAnswerOptions()).toEqual(['yes', 'no']);
        expect(topic.getAbstentionAnswerOption()).toEqual('no');
        expect(topic.getMajority().getType()).toEqual(MajorityType.qualified);
        expect(topic.getMajority().getQuorumInPercent()).toEqual(70);
        expect(topic.isCompleted()).toBeTrue();
        expect(topic.getBallots()).toBeArrayOfSize(0);
    });

    it('should create a topic from entity with ballots', () => {
        const entity = new TopicEntity();
        entity.externalId = 'externalTopicId';
        entity.id = 'topicId';
        entity.majorityType = MajorityType.qualified;
        entity.majorityQuorumInPercent = 70;
        entity.requiredNumberOfSharesForQuorum = 50;
        entity.setAnswerOptions(['yes', 'no']);
        entity.abstentionAnswerOption = 'no';
        entity.updatedAt = new Date();
        entity.createdAt = new Date();
        entity.ballots = [
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            {
                id: 'ballotId',
                answerOption: 'no',
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                participant: {
                    id: 'participantId',
                    externalId: 'externalParticipantId',
                    shares: 20,
                } as ParticipantEntity,
            } as BallotEntity,
        ];

        const topic = factory.fromEntity(entity);

        expect(topic.getId()).toEqual('topicId');
        expect(topic.getExternalId()).toEqual('externalTopicId');
        expect(topic.getRequiredNumberOfShares()).toEqual(50);
        expect(topic.getAnswerOptions()).toBeArrayOfSize(2);
        expect(topic.getAnswerOptions()).toEqual(['yes', 'no']);
        expect(topic.getAbstentionAnswerOption()).toEqual('no');
        expect(topic.getMajority().getType()).toEqual(MajorityType.qualified);
        expect(topic.getMajority().getQuorumInPercent()).toEqual(70);
        expect(topic.isCompleted()).toBeFalse();
        expect(topic.getBallots()).toBeArrayOfSize(1);
        expect(topic.getBallots()[0].getId()).toEqual('ballotId');
        expect(topic.getBallots()[0].getAnswerOption()).toEqual('no');
    });
});
