import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AbstractSessionPersistenceService, Session } from '../../../../domain';
import { createDatabaseModuleImports } from '../testing/createDatabaseModuleImports';
import { SessionEntityFactory } from '../factories/SessionEntityFactory';
import { TopicEntityFactory } from '../factories/TopicEntityFactory';
import { ParticipantEntityFactory } from '../factories/ParticipantEntityFactory';
import { BallotEntityFactory } from '../factories/BallotEntityFactory';
import { SessionPersistenceService } from './SessionPersistenceService';

describe('SessionPersistenceService', () => {
    let app: INestApplication;
    let service: SessionPersistenceService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [...createDatabaseModuleImports()],
            providers: [
                SessionPersistenceService,
                SessionEntityFactory,
                TopicEntityFactory,
                ParticipantEntityFactory,
                BallotEntityFactory,
            ],
        }).compile();
        app = module.createNestApplication();

        service = app.get(SessionPersistenceService);
    });

    afterAll(async () => {
        await app.close();
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
