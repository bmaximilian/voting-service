import { AbstractSessionPersistenceService, Session } from '../../../../domain';
import { SessionPersistenceService } from './SessionPersistenceService';

describe('SessionPersistenceService', () => {
    let service: SessionPersistenceService;

    beforeEach(() => {
        service = new SessionPersistenceService();
    });

    it('should construct', () => {
        expect(service).toBeInstanceOf(SessionPersistenceService);
        expect(service).toBeInstanceOf(AbstractSessionPersistenceService);
    });

    it('should create a session', async () => {
        const start = new Date();
        const session = new Session('client', start);

        const newSession = await service.create(session);

        expect(newSession.getId()).toBeString();
        expect(newSession.getStart()).toEqual(start);
        expect(newSession.getEnd()).toBeUndefined();
        expect(newSession.getClientId()).toEqual('client');
        expect(newSession.getParticipants()).toBeArrayOfSize(0);
        expect(newSession.getTopics()).toBeArrayOfSize(0);
    });
});
