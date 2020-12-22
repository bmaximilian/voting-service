import { createMock } from '@golevelup/nestjs-testing';
import { Session } from '../model/Session';
import { Participant } from '../model/Participant';
import { Topic } from '../model/Topic';
import { AbstractSessionPersistenceService } from '../persistence/AbstractSessionPersistenceService';
import { Majority, MajorityType } from '../model/Majority';
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
});
