import { CreateSessionTopic } from '../request/CreateSessionTopic';
import { Majority, MajorityType, Topic } from '../../../../../../domain';
import { CreateTopicRequestResponseFactory } from './CreateTopicRequestResponseFactory';
import { ExternalIdComposer } from './ExternalIdComposer';

describe('CreateTopicRequestResponseFactory', () => {
    let factory: CreateTopicRequestResponseFactory;

    beforeEach(() => {
        const externalIdComposer = new ExternalIdComposer();
        factory = new CreateTopicRequestResponseFactory(externalIdComposer);
    });

    describe('fromRequest', () => {
        it('should be able to create a topic from the request', () => {
            const request = new CreateSessionTopic();
            request.abstentionAnswerOption = 'abtence';
            request.answerOptions = ['yes', 'no', 'abstence'];
            request.requiredNumberOfShares = 100;
            request.id = 'external-topic-id';
            request.majority = {
                type: MajorityType.qualified,
                quorumInPercent: 66.666,
            };

            const topic = factory.fromRequest(request, 'the-client');

            expect(topic.getExternalId()).toEqual(`the-client__${request.id}`);
            expect(topic.getAbstentionAnswerOption()).toEqual(request.abstentionAnswerOption);
            expect(topic.getAnswerOptions()).toEqual(request.answerOptions);
            expect(topic.getRequiredNumberOfShares()).toEqual(request.requiredNumberOfShares);
            expect(topic.getBallots()).toBeArrayOfSize(0);
            expect(topic.getId()).toBeUndefined();
            expect(topic.getMajority().getType()).toEqual(request.majority.type);
            expect(topic.getMajority().getQuorumInPercent()).toEqual(request.majority.quorumInPercent);
        });
    });

    describe('toResponse', () => {
        it('should create a response from the topic', () => {
            const topic = new Topic(
                'clientId__external-topic-id',
                new Majority(MajorityType.single),
                50,
                ['yes', 'no'],
                undefined,
                false,
                'internal-topic-id',
                [],
            );

            const response = factory.toResponse(topic, 'clientId');

            expect(response.id).toEqual('external-topic-id');
            expect(response.abstentionAnswerOption).toBeUndefined();
            expect(response.answerOptions).toEqual(['yes', 'no']);
            expect(response.requiredNumberOfShares).toEqual(50);
            expect(response.majority.type).toEqual(MajorityType.single);
            expect(response.majority.quorumInPercent).toBeUndefined();
        });

        it('should create a response from the topic with quorum in percent', () => {
            const topic = new Topic(
                'clientId__external-topic-id',
                new Majority(MajorityType.qualified, 66.66),
                50,
                ['yes', 'no', 'abstention'],
                'abstention',
                false,
                'internal-topic-id',
                [],
            );

            const response = factory.toResponse(topic, 'clientId');

            expect(response.id).toEqual('external-topic-id');
            expect(response.abstentionAnswerOption).toEqual('abstention');
            expect(response.answerOptions).toEqual(['yes', 'no', 'abstention']);
            expect(response.requiredNumberOfShares).toEqual(50);
            expect(response.majority.type).toEqual(MajorityType.qualified);
            expect(response.majority.quorumInPercent).toEqual(66.66);
        });
    });
});
