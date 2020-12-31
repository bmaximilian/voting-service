import { createMock } from '@golevelup/nestjs-testing';
import { Majority, MajorityType, Participant, Session, Topic } from '../../../../domain';
import { SessionEntity } from '../entities/SessionEntity';
import { ParticipantEntity } from '../entities/ParticipantEntity';
import { TopicEntity } from '../entities/TopicEntity';
import { SessionEntityFactory } from './SessionEntityFactory';
import { TopicEntityFactory } from './TopicEntityFactory';
import { ParticipantEntityFactory } from './ParticipantEntityFactory';

describe('SessionEntityFactory', () => {
    let topicFactory: TopicEntityFactory;
    let participantFactory: ParticipantEntityFactory;
    let factory: SessionEntityFactory;

    beforeEach(() => {
        topicFactory = createMock<TopicEntityFactory>();
        participantFactory = createMock<ParticipantEntityFactory>();
        factory = new SessionEntityFactory(topicFactory, participantFactory);
    });

    it('should convert a session without topics and participants to entity', () => {
        const session = new Session('clientId', new Date(), new Date(), 'sessionId');

        const entity = factory.toEntity(session);

        expect(topicFactory.toEntity).not.toHaveBeenCalled();
        expect(participantFactory.toEntity).not.toHaveBeenCalled();

        expect(entity.topics).toBeUndefined();
        expect(entity.participants).toBeUndefined();
        expect(entity.end).toEqual(session.getEnd());
        expect(entity.start).toEqual(session.getStart());
        expect(entity.clientId).toEqual('clientId');
        expect(entity.id).toEqual('sessionId');
    });

    it('should convert a session with topics and participants to entity', () => {
        jest.spyOn(topicFactory, 'toEntity').mockImplementation((t) => t as any);
        jest.spyOn(participantFactory, 'toEntity').mockImplementation((p) => p as any);

        const session = new Session(
            'clientId',
            new Date(),
            new Date(),
            'sessionId',
            [new Participant('externalParticipantId', 20, 'participantId')],
            [new Topic('externalTopicId', new Majority(MajorityType.single), 60, ['yes', 'no'])],
        );

        const entity = factory.toEntity(session);

        expect(topicFactory.toEntity).toHaveBeenCalledTimes(1);
        expect(topicFactory.toEntity).toHaveBeenCalledWith(session.getTopics()[0]);
        expect(participantFactory.toEntity).toHaveBeenCalledTimes(1);
        expect(participantFactory.toEntity).toHaveBeenCalledWith(session.getParticipants()[0]);

        expect(entity.topics).toBeArrayOfSize(1);
        expect(entity.participants).toBeArrayOfSize(1);
        expect(entity.end).toEqual(session.getEnd());
        expect(entity.start).toEqual(session.getStart());
        expect(entity.clientId).toEqual('clientId');
        expect(entity.id).toEqual('sessionId');
    });

    it('should create a session from entity without participants and topics', () => {
        const entity = new SessionEntity();
        entity.clientId = 'clientId';
        entity.id = 'sessionId';
        entity.start = new Date();
        entity.end = new Date();
        entity.createdAt = new Date();
        entity.updatedAt = new Date();

        const session = factory.fromEntity(entity);

        expect(topicFactory.fromEntity).not.toHaveBeenCalled();
        expect(participantFactory.fromEntity).not.toHaveBeenCalled();

        expect(session.getClientId()).toEqual('clientId');
        expect(session.getId()).toEqual('sessionId');
        expect(session.getStart()).toEqual(entity.start);
        expect(session.getEnd()).toEqual(entity.end);
        expect(session.getParticipants()).toBeArrayOfSize(0);
        expect(session.getTopics()).toBeArrayOfSize(0);
    });

    it('should create a session from entity with participants and topics', () => {
        jest.spyOn(topicFactory, 'fromEntity').mockImplementation((t) => t as any);
        jest.spyOn(participantFactory, 'fromEntity').mockImplementation((p) => p as any);

        const entity = new SessionEntity();
        entity.clientId = 'clientId';
        entity.id = 'sessionId';
        entity.start = new Date();
        entity.end = new Date();
        entity.createdAt = new Date();
        entity.updatedAt = new Date();
        entity.participants = [
            createMock<ParticipantEntity>({
                id: 'participantId',
                externalId: 'externalParticipantId',
                shares: 20,
            }),
        ];
        entity.topics = [
            createMock<TopicEntity>({
                id: 'topicId',
                externalId: 'externalTopicId',
            }),
        ];

        const session = factory.fromEntity(entity);

        expect(topicFactory.fromEntity).toHaveBeenCalledTimes(1);
        expect(topicFactory.fromEntity).toHaveBeenCalledWith(entity.topics[0]);
        expect(participantFactory.fromEntity).toHaveBeenCalledTimes(1);
        expect(participantFactory.fromEntity).toHaveBeenCalledWith(entity.participants[0]);

        expect(session.getClientId()).toEqual('clientId');
        expect(session.getId()).toEqual('sessionId');
        expect(session.getStart()).toEqual(entity.start);
        expect(session.getEnd()).toEqual(entity.end);
        expect(session.getParticipants()).toBeArrayOfSize(1);
        expect(session.getTopics()).toBeArrayOfSize(1);
    });
});
