import { createMock } from '@golevelup/nestjs-testing';
import { Session } from '../model/Session';
import { Participant } from '../model/Participant';
import { Topic } from '../model/Topic';
import { AbstractSessionPersistenceService } from '../persistence/AbstractSessionPersistenceService';
import { Majority, MajorityType } from '../model/Majority';
import { ParticipantForMandateNotExistingException } from '../exception/ParticipantForMandateNotExistingException';
import { Mandate } from '../model/Mandate';
import { ParticipantAlreadyExistsException } from '../exception/ParticipantAlreadyExistsException';
import { ParticipantDuplicatedException } from '../exception/ParticipantDuplicatedException';
import { TopicDuplicatedException } from '../exception/TopicDuplicatedException';
import { TopicAlreadyExistsException } from '../exception/TopicAlreadyExistsException';
import { SessionService } from './SessionService';

describe('SessionService', () => {
    let service: SessionService;
    let persistenceService: AbstractSessionPersistenceService;

    beforeEach(() => {
        persistenceService = createMock<AbstractSessionPersistenceService>();
        service = new SessionService(persistenceService);
    });

    it('should be able to construct', () => {
        expect(service).toBeInstanceOf(SessionService);
    });

    it('should create a new session and return it', async () => {
        jest.spyOn(persistenceService, 'create').mockImplementation((sess) => Promise.resolve(sess));

        const start = new Date();
        const participant = new Participant('external-participant-1', 1);
        const topic = new Topic('external-topic-1', new Majority(MajorityType.relative), 10, ['yes', 'no']);

        const session = await service.create(
            new Session('test-client', start, undefined, undefined, [participant], [topic]),
        );

        expect(persistenceService.create).toHaveBeenCalledWith(session);
        expect(persistenceService.create).toHaveBeenCalledTimes(1);

        expect(session).toBeInstanceOf(Session);
        expect(session.getTopics()).toBeArrayOfSize(1);
        expect(session.getTopics()).toContain(topic);
        expect(session.getParticipants()).toBeArrayOfSize(1);
        expect(session.getParticipants()).toContain(participant);
        expect(session.getStart()).toEqual(start);
        expect(session.getEnd()).toBeUndefined();
    });

    it('should throw when trying to create a session with invalid mandate', async () => {
        jest.spyOn(persistenceService, 'create');

        const start = new Date();
        const participant1 = new Participant('external-participant-1', 1, undefined);
        const participant2 = new Participant('external-participant-2', 1, undefined, [new Mandate(participant1)]);
        const participant3 = new Participant('external-participant-3', 1, undefined, [
            new Mandate(new Participant('external-participant-123', 1)),
        ]);

        await expect(
            service.create(
                new Session('test-client', start, undefined, undefined, [participant1, participant2, participant3]),
            ),
        ).rejects.toThrow(ParticipantForMandateNotExistingException);

        expect(persistenceService.create).not.toHaveBeenCalled();
    });

    it('should throw when creating a session with duplicated participants', async () => {
        const participant1 = new Participant('external-participant-1', 1);
        const session = new Session('clientId', new Date(), undefined, 'sessionId', [participant1, participant1]);

        jest.spyOn(persistenceService, 'create');

        await expect(service.create(session)).rejects.toThrow(ParticipantDuplicatedException);

        expect(persistenceService.save).not.toHaveBeenCalled();
    });

    it('should throw when creating a session with duplicated topics', async () => {
        const topic = new Topic('external-topic-1', new Majority(MajorityType.relative), 10, ['yes', 'no']);
        const session = new Session('clientId', new Date(), undefined, 'sessionId', [], [topic, topic]);

        jest.spyOn(persistenceService, 'create');

        await expect(service.create(session)).rejects.toThrow(TopicDuplicatedException);

        expect(persistenceService.save).not.toHaveBeenCalled();
    });

    it('should add a topic to a session', async () => {
        const session = new Session('clientId', new Date());

        jest.spyOn(session, 'addTopic');
        jest.spyOn(persistenceService, 'findById').mockResolvedValue(session);
        jest.spyOn(persistenceService, 'save').mockResolvedValue(session);

        const topic = new Topic('external-topic-1', new Majority(MajorityType.relative), 10, ['yes', 'no']);

        const savedTopic = await service.addTopic('sessionId', topic);

        expect(persistenceService.findById).toHaveBeenCalledWith('sessionId');
        expect(persistenceService.findById).toHaveBeenCalledTimes(1);

        expect(session.addTopic).toHaveBeenCalledWith(topic);
        expect(session.addTopic).toHaveBeenCalledTimes(1);

        expect(persistenceService.save).toHaveBeenCalledWith(session);
        expect(persistenceService.save).toHaveBeenCalledTimes(1);

        expect(savedTopic).toBeInstanceOf(Topic);
        expect(savedTopic.getExternalId()).toEqual(topic.getExternalId());
        expect(savedTopic.getMajority().getType()).toEqual(topic.getMajority().getType());
        expect(savedTopic.getMajority().getQuorumInPercent()).toEqual(topic.getMajority().getQuorumInPercent());
        expect(savedTopic.getRequiredNumberOfShares()).toEqual(topic.getRequiredNumberOfShares());
        expect(savedTopic.getAnswerOptions()).toEqual(topic.getAnswerOptions());
        expect(savedTopic.getAbstentionAnswerOption()).toEqual(topic.getAbstentionAnswerOption());
    });

    it('should throw when adding a topic that already exists', async () => {
        const participant1 = new Participant('external-participant-1', 1, 'participant1');
        const topic = new Topic('external-topic-1', new Majority(MajorityType.relative), 10, ['yes', 'no']);
        const session = new Session('clientId', new Date(), undefined, 'sessionId', [participant1], [topic]);

        jest.spyOn(persistenceService, 'findById').mockResolvedValue(session);
        jest.spyOn(persistenceService, 'save').mockResolvedValue(session);

        await expect(service.addTopic('sessionId', topic)).rejects.toThrow(TopicAlreadyExistsException);

        expect(persistenceService.findById).toHaveBeenCalledWith('sessionId');
        expect(persistenceService.findById).toHaveBeenCalledTimes(1);

        expect(persistenceService.save).not.toHaveBeenCalled();
    });

    it('should add a participant to a session', async () => {
        const session = new Session('clientId', new Date());

        jest.spyOn(session, 'addParticipant');
        jest.spyOn(persistenceService, 'findById').mockResolvedValue(session);
        jest.spyOn(persistenceService, 'save').mockResolvedValue(session);

        const participant = new Participant('external-participant-1', 1);

        const savedParticipant = await service.addParticipant('sessionId', participant);

        expect(persistenceService.findById).toHaveBeenCalledWith('sessionId');
        expect(persistenceService.findById).toHaveBeenCalledTimes(1);

        expect(session.addParticipant).toHaveBeenCalledWith(participant);
        expect(session.addParticipant).toHaveBeenCalledTimes(1);

        expect(persistenceService.save).toHaveBeenCalledWith(session);
        expect(persistenceService.save).toHaveBeenCalledTimes(1);

        expect(savedParticipant).toBeInstanceOf(Participant);
        expect(savedParticipant.getExternalId()).toEqual(participant.getExternalId());
        expect(savedParticipant.getShares()).toEqual(participant.getShares());
    });

    it('should not throw when adding a participant with valid mandate', async () => {
        const participant1 = new Participant('external-participant-1', 1, 'participant1');
        const participant2 = new Participant('external-participant-2', 1, 'participant2', [new Mandate(participant1)]);
        const session = new Session('clientId', new Date(), undefined, 'sessionId', [participant1, participant2]);

        jest.spyOn(session, 'addParticipant');
        jest.spyOn(persistenceService, 'findById').mockResolvedValue(session);
        jest.spyOn(persistenceService, 'save').mockResolvedValue(session);

        const participant = new Participant('external-participant-3', 1, undefined, [
            new Mandate(new Participant('external-participant-2', 0)),
            new Mandate(new Participant('external-participant-1', 0)),
        ]);

        await service.addParticipant('sessionId', participant);

        expect(persistenceService.findById).toHaveBeenCalledWith('sessionId');
        expect(persistenceService.findById).toHaveBeenCalledTimes(1);

        expect(session.addParticipant).toHaveBeenCalledWith(participant);
        expect(session.addParticipant).toHaveBeenCalledTimes(1);

        expect(persistenceService.save).toHaveBeenCalledTimes(1);
    });

    it('should throw when adding a participant with invalid mandate', async () => {
        const participant1 = new Participant('external-participant-1', 1, 'participant1');
        const participant2 = new Participant('external-participant-2', 1, 'participant2', [new Mandate(participant1)]);
        const session = new Session('clientId', new Date(), undefined, 'sessionId', [participant1, participant2]);

        jest.spyOn(session, 'addParticipant');
        jest.spyOn(persistenceService, 'findById').mockResolvedValue(session);
        jest.spyOn(persistenceService, 'save').mockResolvedValue(session);

        const participant = new Participant('external-participant-3', 1, undefined, [
            new Mandate(new Participant('external-participant-123', 0)),
            new Mandate(new Participant('external-participant-1', 0)),
        ]);

        await expect(service.addParticipant('sessionId', participant)).rejects.toThrow(
            ParticipantForMandateNotExistingException,
        );

        expect(persistenceService.findById).toHaveBeenCalledWith('sessionId');
        expect(persistenceService.findById).toHaveBeenCalledTimes(1);

        expect(session.addParticipant).toHaveBeenCalledWith(participant);
        expect(session.addParticipant).toHaveBeenCalledTimes(1);

        expect(persistenceService.save).not.toHaveBeenCalled();
    });

    it('should throw when adding a participant that already exists', async () => {
        const participant1 = new Participant('external-participant-1', 1, 'participant1');
        const session = new Session('clientId', new Date(), undefined, 'sessionId', [participant1]);

        jest.spyOn(persistenceService, 'findById').mockResolvedValue(session);
        jest.spyOn(persistenceService, 'save').mockResolvedValue(session);

        const participant = new Participant('external-participant-1', 2);

        await expect(service.addParticipant('sessionId', participant)).rejects.toThrow(
            ParticipantAlreadyExistsException,
        );

        expect(persistenceService.findById).toHaveBeenCalledWith('sessionId');
        expect(persistenceService.findById).toHaveBeenCalledTimes(1);

        expect(persistenceService.save).not.toHaveBeenCalled();
    });
});
