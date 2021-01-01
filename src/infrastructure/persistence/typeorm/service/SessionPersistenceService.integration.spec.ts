import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
    AbstractSessionPersistenceService,
    Majority,
    MajorityType,
    Mandate,
    Participant,
    Session,
    SessionNotFoundException,
    Topic,
} from '../../../../domain';
import { createDatabaseModuleImports } from '../testing/createDatabaseModuleImports';
import { SessionEntityFactory } from '../factories/SessionEntityFactory';
import { TopicEntityFactory } from '../factories/TopicEntityFactory';
import { ParticipantEntityFactory } from '../factories/ParticipantEntityFactory';
import { BallotEntityFactory } from '../factories/BallotEntityFactory';
import { MandateRepository } from '../repositories/MandateRepository';
import { MandateEntity } from '../entities/MandateEntity';
import { SessionRepository } from '../repositories/SessionRepository';
import { SessionPersistenceService } from './SessionPersistenceService';
import { ParticipantPersistenceService } from './ParticipantPersistenceService';

describe('SessionPersistenceService', () => {
    let app: INestApplication;
    let service: SessionPersistenceService;
    let mandateRepository: MandateRepository;
    let sessionRepository: SessionRepository;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [...createDatabaseModuleImports()],
            providers: [
                SessionPersistenceService,
                ParticipantPersistenceService,
                SessionEntityFactory,
                TopicEntityFactory,
                ParticipantEntityFactory,
                BallotEntityFactory,
            ],
        }).compile();
        app = module.createNestApplication();

        service = app.get(SessionPersistenceService);
        mandateRepository = app.get(MandateRepository);
        sessionRepository = app.get(SessionRepository);
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

    it('should create a session with topics', async () => {
        const end = new Date();
        const session = new Session(
            'client',
            new Date(),
            end,
            undefined,
            [],
            [
                new Topic(
                    'SessionPersistenceService:session-with-topics:1',
                    new Majority(MajorityType.single),
                    30,
                    ['yes', 'no', 'abstention'],
                    'abstention',
                ),
                new Topic(
                    'SessionPersistenceService:session-with-topics:2',
                    new Majority(MajorityType.qualified, 50),
                    30,
                    ['yes', 'no'],
                ),
            ],
        );

        const newSession = await service.create(session);

        expect(newSession.getId()).toBeString();
        expect(newSession.getStart()).toBeInstanceOf(Date);
        expect(newSession.getEnd()).toEqual(end);
        expect(newSession.getClientId()).toEqual('client');
        expect(newSession.getParticipants()).toBeArrayOfSize(0);
        expect(newSession.getTopics()).toBeArrayOfSize(2);

        function getTopicByExternalId(id: string): Topic | undefined {
            return newSession.getTopics().find((topic) => topic.getExternalId() === id);
        }

        const topic1 = getTopicByExternalId(session.getTopics()[0].getExternalId());
        expect(topic1).toBeInstanceOf(Topic);
        expect(topic1.getId()).toBeString();
        expect(topic1.getExternalId()).toEqual(session.getTopics()[0].getExternalId());
        expect(topic1.getMajority().getType()).toEqual(session.getTopics()[0].getMajority().getType());
        expect(topic1.getMajority().getQuorumInPercent()).toEqual(
            session.getTopics()[0].getMajority().getQuorumInPercent(),
        );
        expect(topic1.getAnswerOptions()).toEqual(['yes', 'no', 'abstention']);
        expect(topic1.getAbstentionAnswerOption()).toEqual('abstention');
        expect(topic1.getRequiredNumberOfShares()).toEqual(30);
        expect(topic1.getBallots()).toBeArrayOfSize(0);

        const topic2 = getTopicByExternalId(session.getTopics()[1].getExternalId());
        expect(topic2.getId()).toBeString();
        expect(topic2.getExternalId()).toEqual(session.getTopics()[1].getExternalId());
        expect(topic2.getMajority().getType()).toEqual(session.getTopics()[1].getMajority().getType());
        expect(topic2.getMajority().getQuorumInPercent()).toEqual(
            session.getTopics()[1].getMajority().getQuorumInPercent(),
        );
        expect(topic2.getAnswerOptions()).toEqual(['yes', 'no']);
        expect(topic2.getAbstentionAnswerOption()).toBeUndefined();
        expect(topic2.getRequiredNumberOfShares()).toEqual(30);
        expect(topic2.getBallots()).toBeArrayOfSize(0);
    });

    it('should create a session with participants', async () => {
        const session = new Session(
            'client',
            new Date(),
            new Date(),
            undefined,
            [
                new Participant('SessionPersistenceService:session-with-participants:1', 10),
                new Participant('SessionPersistenceService:session-with-participants:2', 20),
                new Participant('SessionPersistenceService:session-with-participants:3', 20),
                new Participant('SessionPersistenceService:session-with-participants:4', 30),
                new Participant('SessionPersistenceService:session-with-participants:5', 20),
            ],
            [],
        );

        const newSession = await service.create(session);

        expect(newSession.getId()).toBeString();
        expect(newSession.getStart()).toBeInstanceOf(Date);
        expect(newSession.getEnd()).toBeInstanceOf(Date);
        expect(newSession.getClientId()).toEqual('client');
        expect(newSession.getParticipants()).toBeArrayOfSize(5);
        expect(newSession.getTopics()).toBeArrayOfSize(0);

        expect(newSession.getParticipants()[0].getId()).toBeString();
        expect(newSession.getParticipants()[0].getExternalId()).toEqual(session.getParticipants()[0].getExternalId());
        expect(newSession.getParticipants()[0].getShares()).toEqual(10);
        expect(newSession.getParticipants()[0].getMandates()).toBeArrayOfSize(0);

        expect(newSession.getParticipants()[1].getId()).toBeString();
        expect(newSession.getParticipants()[1].getExternalId()).toEqual(session.getParticipants()[1].getExternalId());
        expect(newSession.getParticipants()[1].getShares()).toEqual(20);
        expect(newSession.getParticipants()[1].getMandates()).toBeArrayOfSize(0);

        expect(newSession.getParticipants()[2].getId()).toBeString();
        expect(newSession.getParticipants()[2].getExternalId()).toEqual(session.getParticipants()[2].getExternalId());
        expect(newSession.getParticipants()[2].getShares()).toEqual(20);
        expect(newSession.getParticipants()[2].getMandates()).toBeArrayOfSize(0);

        expect(newSession.getParticipants()[3].getId()).toBeString();
        expect(newSession.getParticipants()[3].getExternalId()).toEqual(session.getParticipants()[3].getExternalId());
        expect(newSession.getParticipants()[3].getShares()).toEqual(30);
        expect(newSession.getParticipants()[3].getMandates()).toBeArrayOfSize(0);

        expect(newSession.getParticipants()[4].getId()).toBeString();
        expect(newSession.getParticipants()[4].getExternalId()).toEqual(session.getParticipants()[4].getExternalId());
        expect(newSession.getParticipants()[4].getShares()).toEqual(20);
        expect(newSession.getParticipants()[4].getMandates()).toBeArrayOfSize(0);
    });

    it('should create a session with mandated participants', async () => {
        const participant1 = new Participant('SessionPersistenceService:session-with-mandates:1', 10);
        const participant2 = new Participant('SessionPersistenceService:session-with-mandates:2', 20, undefined, [
            new Mandate(participant1),
        ]);
        const participant3 = new Participant('SessionPersistenceService:session-with-mandates:3', 20, undefined, [
            new Mandate(participant1),
            new Mandate(participant2),
        ]);
        const participant4 = new Participant('SessionPersistenceService:session-with-mandates:4', 30, undefined, [
            new Mandate(participant3),
        ]);
        const participant5 = new Participant('SessionPersistenceService:session-with-mandates:5', 20, undefined, [
            new Mandate(participant1),
            new Mandate(participant2),
            new Mandate(participant3),
            new Mandate(participant4),
        ]);

        const session = new Session(
            'client',
            new Date(),
            new Date(),
            undefined,
            [participant1, participant2, participant3, participant4, participant5],
            [],
        );

        const newSession = await service.create(session);

        expect(newSession.getId()).toBeString();
        expect(newSession.getStart()).toBeInstanceOf(Date);
        expect(newSession.getEnd()).toBeInstanceOf(Date);
        expect(newSession.getClientId()).toEqual('client');
        expect(newSession.getParticipants()).toBeArrayOfSize(5);
        expect(newSession.getTopics()).toBeArrayOfSize(0);

        async function findMandatesForParticipant(participant: Participant): Promise<MandateEntity[]> {
            const mandates = await mandateRepository.find({ mandatedBy: { id: participant.getId() } });
            mandates.forEach((mandate) => {
                expect(mandate.mandatedBy.id).toEqual(participant.getId());
                expect(mandate.mandatedBy.externalId).toEqual(participant.getExternalId());
            });

            return mandates;
        }
        function hasMandateForParticipant(mandates: MandateEntity[], mandated: Participant): boolean {
            return !!mandates.find(
                (mandate) =>
                    mandate.participant.id === mandated.getId() &&
                    mandate.participant.externalId === mandated.getExternalId(),
            );
        }

        expect(newSession.getParticipants()[0].getId()).toBeString();
        expect(newSession.getParticipants()[0].getExternalId()).toEqual(session.getParticipants()[0].getExternalId());
        expect(newSession.getParticipants()[0].getShares()).toEqual(10);
        expect(newSession.getParticipants()[0].getMandates()).toBeArrayOfSize(0);
        const participant1Mandates = await findMandatesForParticipant(newSession.getParticipants()[0]);
        expect(participant1Mandates).toBeArrayOfSize(0);

        expect(newSession.getParticipants()[1].getId()).toBeString();
        expect(newSession.getParticipants()[1].getExternalId()).toEqual(session.getParticipants()[1].getExternalId());
        expect(newSession.getParticipants()[1].getShares()).toEqual(20);
        expect(newSession.getParticipants()[1].getMandates()).toBeArrayOfSize(0);
        const participant2Mandates = await findMandatesForParticipant(newSession.getParticipants()[1]);
        expect(participant2Mandates).toBeArrayOfSize(1);
        expect(hasMandateForParticipant(participant2Mandates, newSession.getParticipants()[0])).toBeTrue();

        expect(newSession.getParticipants()[2].getId()).toBeString();
        expect(newSession.getParticipants()[2].getExternalId()).toEqual(session.getParticipants()[2].getExternalId());
        expect(newSession.getParticipants()[2].getShares()).toEqual(20);
        expect(newSession.getParticipants()[2].getMandates()).toBeArrayOfSize(0);
        const participant3Mandates = await findMandatesForParticipant(newSession.getParticipants()[2]);
        expect(participant3Mandates).toBeArrayOfSize(2);
        expect(hasMandateForParticipant(participant3Mandates, newSession.getParticipants()[0])).toBeTrue();
        expect(hasMandateForParticipant(participant3Mandates, newSession.getParticipants()[1])).toBeTrue();

        expect(newSession.getParticipants()[3].getId()).toBeString();
        expect(newSession.getParticipants()[3].getExternalId()).toEqual(session.getParticipants()[3].getExternalId());
        expect(newSession.getParticipants()[3].getShares()).toEqual(30);
        expect(newSession.getParticipants()[3].getMandates()).toBeArrayOfSize(0);
        const participant4Mandates = await findMandatesForParticipant(newSession.getParticipants()[3]);
        expect(participant4Mandates).toBeArrayOfSize(1);
        expect(hasMandateForParticipant(participant4Mandates, newSession.getParticipants()[2])).toBeTrue();

        expect(newSession.getParticipants()[4].getId()).toBeString();
        expect(newSession.getParticipants()[4].getExternalId()).toEqual(session.getParticipants()[4].getExternalId());
        expect(newSession.getParticipants()[4].getShares()).toEqual(20);
        expect(newSession.getParticipants()[4].getMandates()).toBeArrayOfSize(0);
        const participant5Mandates = await findMandatesForParticipant(newSession.getParticipants()[4]);
        expect(participant5Mandates).toBeArrayOfSize(4);
        expect(hasMandateForParticipant(participant5Mandates, newSession.getParticipants()[0])).toBeTrue();
        expect(hasMandateForParticipant(participant5Mandates, newSession.getParticipants()[1])).toBeTrue();
        expect(hasMandateForParticipant(participant5Mandates, newSession.getParticipants()[2])).toBeTrue();
        expect(hasMandateForParticipant(participant5Mandates, newSession.getParticipants()[3])).toBeTrue();
    });

    it('should create a session with nested mandates', async () => {
        const participant1 = new Participant('SessionPersistenceService:session-with-nested-mandates:1', 10);
        const participant2 = new Participant(
            'SessionPersistenceService:session-with-nested-mandates:2',
            20,
            undefined,
            [new Mandate(participant1)],
        );
        participant1.setMandates([new Mandate(participant2)]);

        const session = new Session('client', new Date(), new Date(), undefined, [participant1, participant2], []);

        const newSession = await service.create(session);

        expect(newSession.getId()).toBeString();
        expect(newSession.getStart()).toBeInstanceOf(Date);
        expect(newSession.getEnd()).toBeInstanceOf(Date);
        expect(newSession.getClientId()).toEqual('client');
        expect(newSession.getParticipants()).toBeArrayOfSize(2);
        expect(newSession.getTopics()).toBeArrayOfSize(0);

        const participant1Mandates = await mandateRepository.find({
            mandatedBy: { id: newSession.getParticipants()[0].getId() },
        });
        expect(participant1Mandates).toBeArrayOfSize(1);
        expect(participant1Mandates[0].id).toBeString();
        expect(participant1Mandates[0].participant.id).toEqual(newSession.getParticipants()[1].getId());
        expect(participant1Mandates[0].participant.externalId).toEqual(newSession.getParticipants()[1].getExternalId());
        expect(participant1Mandates[0].mandatedBy.id).toEqual(newSession.getParticipants()[0].getId());
        expect(participant1Mandates[0].mandatedBy.externalId).toEqual(newSession.getParticipants()[0].getExternalId());

        const participant2Mandates = await mandateRepository.find({
            mandatedBy: { id: newSession.getParticipants()[1].getId() },
        });
        expect(participant2Mandates).toBeArrayOfSize(1);
        expect(participant2Mandates[0].id).toBeString();
        expect(participant2Mandates[0].participant.id).toEqual(newSession.getParticipants()[0].getId());
        expect(participant2Mandates[0].participant.externalId).toEqual(newSession.getParticipants()[0].getExternalId());
        expect(participant2Mandates[0].mandatedBy.id).toEqual(newSession.getParticipants()[1].getId());
        expect(participant2Mandates[0].mandatedBy.externalId).toEqual(newSession.getParticipants()[1].getExternalId());
    });

    describe('after create', () => {
        let createdSession: Session;

        beforeAll(async () => {
            const participant1 = new Participant('SessionPersistenceService:after-create:1', 10);
            const topic = new Topic(
                'SessionPersistenceService:after-create:1',
                new Majority(MajorityType.single),
                30,
                ['yes', 'no', 'abstention'],
                'abstention',
            );
            createdSession = await service.create(
                new Session('client', new Date(), new Date(), undefined, [participant1], [topic]),
            );
        });

        describe('find', () => {
            it('should find a session by id', async () => {
                jest.spyOn(sessionRepository, 'findOne');

                const session = await service.findById(createdSession.getId());

                expect(sessionRepository.findOne).toHaveBeenCalledTimes(1);
                expect(sessionRepository.findOne).toHaveBeenCalledWith(createdSession.getId());

                expect(session).toBeInstanceOf(Session);
                expect(session.getId()).toEqual(createdSession.getId());
                expect(session.getClientId()).toEqual(createdSession.getClientId());
                expect(session.getStart()).toEqual(createdSession.getStart());
                expect(session.getEnd()).toEqual(createdSession.getEnd());
            });

            it('should throw if a session is not found', async () => {
                await expect(service.findById('not-the-session-you-are-looking-for')).rejects.toThrow(
                    SessionNotFoundException,
                );
            });
        });

        describe('save', () => {
            it('should save topics for a session', async () => {
                jest.spyOn(sessionRepository, 'save').mockClear();

                const existingSession = await service.findById(createdSession.getId());

                expect(existingSession.getTopics()).toBeArrayOfSize(1);
                existingSession.addTopic(
                    new Topic(
                        'SessionPersistenceService:save-session-topics:1',
                        new Majority(MajorityType.single),
                        30,
                        ['yes', 'no', 'abstention'],
                        'abstention',
                    ),
                );

                const session = await service.save(existingSession);

                expect(sessionRepository.save).toHaveBeenCalledTimes(1);

                expect(session).toBeInstanceOf(Session);
                expect(session.getId()).toEqual(existingSession.getId());
                expect(session.getClientId()).toEqual(existingSession.getClientId());
                expect(session.getStart()).toEqual(existingSession.getStart());
                expect(session.getEnd()).toEqual(existingSession.getEnd());
                expect(session.getTopics()).toBeArrayOfSize(2);
                expect(session.getTopics()[0].getId()).toBeString();
                expect(session.getTopics()[0].getExternalId()).toEqual('SessionPersistenceService:after-create:1');
                expect(session.getTopics()[1].getId()).toBeString();
                expect(session.getTopics()[1].getExternalId()).toEqual(
                    'SessionPersistenceService:save-session-topics:1',
                );
            });

            it('should save participants for a session', async () => {
                jest.spyOn(sessionRepository, 'save').mockClear();

                const existingSession = await service.findById(createdSession.getId());

                expect(existingSession.getParticipants()).toBeArrayOfSize(1);
                existingSession.addParticipant(
                    new Participant('SessionPersistenceService:save-session-participants:1', 10),
                );

                const session = await service.save(existingSession);

                expect(sessionRepository.save).toHaveBeenCalledTimes(1);

                expect(session).toBeInstanceOf(Session);
                expect(session.getId()).toEqual(existingSession.getId());
                expect(session.getClientId()).toEqual(existingSession.getClientId());
                expect(session.getStart()).toEqual(existingSession.getStart());
                expect(session.getEnd()).toEqual(existingSession.getEnd());
                expect(session.getParticipants()).toBeArrayOfSize(2);
                expect(session.getParticipants()[0].getId()).toBeString();
                expect(session.getParticipants()[0].getExternalId()).toEqual(
                    'SessionPersistenceService:after-create:1',
                );
                expect(session.getParticipants()[1].getId()).toBeString();
                expect(session.getParticipants()[1].getExternalId()).toEqual(
                    'SessionPersistenceService:save-session-participants:1',
                );
                expect(session.getParticipants()[1].getShares()).toEqual(10);
            });
        });
    });
});
