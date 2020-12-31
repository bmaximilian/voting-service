import { CreateSessionRequest } from '../request/CreateSessionRequest';
import { CreateSessionTopic } from '../request/CreateSessionTopic';
import { Majority, MajorityType, Mandate, Participant, Session, Topic } from '../../../../../../domain';
import { CreateSessionParticipant } from '../request/CreateSessionParticipant';
import { CreateSessionRequestResponseFactory } from './CreateSessionRequestResponseFactory';

describe('CreateSessionRequestResponseFactory', () => {
    let factory: CreateSessionRequestResponseFactory;

    beforeEach(() => {
        factory = new CreateSessionRequestResponseFactory();
    });

    describe('createSession', () => {
        it('should be able to create a empty session', () => {
            const request = new CreateSessionRequest();
            request.start = new Date();

            const session = factory.createSession(request, 'clientId');

            expect(session.getClientId()).toEqual('clientId');
            expect(session.getTopics()).toBeArrayOfSize(0);
            expect(session.getParticipants()).toBeArrayOfSize(0);
            expect(session.getEnd()).toBeUndefined();
            expect(session.getStart()).toEqual(request.start);
            expect(session.getId()).toBeUndefined();
        });

        it('should be able to create a session with participants and topics', () => {
            const topic = new CreateSessionTopic();
            topic.abstentionAnswerOption = 'abtence';
            topic.answerOptions = ['yes', 'no', 'abstence'];
            topic.requiredNumberOfShares = 100;
            topic.id = 'external-topic-id';
            topic.majority = {
                type: MajorityType.qualified,
                quorumInPercent: 66.666,
            };

            const participant = new CreateSessionParticipant();
            participant.shares = 50;
            participant.id = 'external-participant-id';

            const request = new CreateSessionRequest();
            request.start = new Date();
            request.topics = [topic];
            request.participants = [participant, { ...participant, id: 'external-participant2-id', shares: 49 }];

            const session = factory.createSession(request, 'the-client');

            expect(session.getClientId()).toEqual('the-client');
            expect(session.getTopics()).toBeArrayOfSize(1);
            expect(session.getParticipants()).toBeArrayOfSize(2);
            expect(session.getEnd()).toBeUndefined();
            expect(session.getStart()).toEqual(request.start);
            expect(session.getId()).toBeUndefined();

            expect(session.getParticipants()[0].getExternalId()).toEqual('the-client__external-participant-id');
            expect(session.getParticipants()[0].getShares()).toEqual(50);
            expect(session.getParticipants()[0].getId()).toBeUndefined();
            expect(session.getParticipants()[0].getMandates()).toBeArrayOfSize(0);

            expect(session.getParticipants()[1].getExternalId()).toEqual('the-client__external-participant2-id');
            expect(session.getParticipants()[1].getShares()).toEqual(49);
            expect(session.getParticipants()[1].getId()).toBeUndefined();
            expect(session.getParticipants()[1].getMandates()).toBeArrayOfSize(0);

            expect(session.getTopics()[0].getExternalId()).toEqual(`the-client__${topic.id}`);
            expect(session.getTopics()[0].getAbstentionAnswerOption()).toEqual(topic.abstentionAnswerOption);
            expect(session.getTopics()[0].getAnswerOptions()).toEqual(topic.answerOptions);
            expect(session.getTopics()[0].getRequiredNumberOfShares()).toEqual(topic.requiredNumberOfShares);
            expect(session.getTopics()[0].getBallots()).toBeArrayOfSize(0);
            expect(session.getTopics()[0].getId()).toBeUndefined();
            expect(session.getTopics()[0].getMajority().getType()).toEqual(topic.majority.type);
            expect(session.getTopics()[0].getMajority().getQuorumInPercent()).toEqual(topic.majority.quorumInPercent);
        });

        it('should be able to create a session with participants and mandates', () => {
            const request = new CreateSessionRequest();
            request.start = new Date();
            request.participants = [
                {
                    id: 'external-participant-id-1',
                    shares: 10,
                },
                {
                    id: 'external-participant-id-2',
                    shares: 15,
                    mandates: ['external-participant-id-1'],
                },
                {
                    id: 'external-participant-id-3',
                    shares: 33,
                    mandates: ['external-participant-id-1', 'external-participant-id-2'],
                },
            ];

            const session = factory.createSession(request, 'the-client');

            expect(session.getParticipants()[0].getExternalId()).toEqual('the-client__external-participant-id-1');
            expect(session.getParticipants()[0].getShares()).toEqual(10);
            expect(session.getParticipants()[0].getMandates()).toBeArrayOfSize(0);

            expect(session.getParticipants()[1].getExternalId()).toEqual('the-client__external-participant-id-2');
            expect(session.getParticipants()[1].getShares()).toEqual(15);
            expect(session.getParticipants()[1].getMandates()).toBeArrayOfSize(1);
            expect(session.getParticipants()[1].getMandates()[0].getId()).toBeUndefined();
            expect(session.getParticipants()[1].getMandates()[0].getParticipant().getExternalId()).toEqual(
                'the-client__external-participant-id-1',
            );

            expect(session.getParticipants()[2].getExternalId()).toEqual('the-client__external-participant-id-3');
            expect(session.getParticipants()[2].getShares()).toEqual(33);
            expect(session.getParticipants()[2].getMandates()).toBeArrayOfSize(2);
            expect(session.getParticipants()[2].getMandates()[0].getId()).toBeUndefined();
            expect(session.getParticipants()[2].getMandates()[0].getParticipant().getExternalId()).toEqual(
                'the-client__external-participant-id-1',
            );
            expect(session.getParticipants()[2].getMandates()[1].getId()).toBeUndefined();
            expect(session.getParticipants()[2].getMandates()[1].getParticipant().getExternalId()).toEqual(
                'the-client__external-participant-id-2',
            );
        });
    });

    describe('createResponse', () => {
        it('should create a response from the session', () => {
            const participant1 = new Participant('clientId__external-participant-id', 20, 'internal-participant-id');
            const session = new Session(
                'clientId',
                new Date(),
                undefined,
                'internal-session-id',
                [
                    participant1,
                    new Participant('clientId__external-participant-id-2', 10, 'internal-participant-id-2', [
                        new Mandate(participant1, 'internal-mandate-id'),
                    ]),
                ],
                [
                    new Topic(
                        'clientId__external-topic-id',
                        new Majority(MajorityType.single),
                        50,
                        ['yes', 'no'],
                        undefined,
                        false,
                        'internal-topic-id',
                        [],
                    ),
                ],
            );

            const response = factory.createResponse(session);

            expect(response.id).toEqual(session.getId());
            expect(response.start).toEqual(session.getStart());
            expect(response.end).toEqual(session.getEnd());
            expect(response.participants).toBeArrayOfSize(2);
            expect(response.topics).toBeArrayOfSize(1);

            expect(response.participants[0]).toEqual({
                id: 'external-participant-id',
            });
            expect(response.participants[1]).toEqual({
                id: 'external-participant-id-2',
            });

            expect(response.topics[0]).toEqual({
                id: 'external-topic-id',
            });
        });
    });
});
