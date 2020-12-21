import { Session } from './Session';
import { Participant } from './Participant';
import { Topic } from './Topic';
import { Majority, MajorityType } from './Majority';

describe('Session', () => {
    let session: Session;
    beforeEach(() => {
        session = new Session('client', new Date());
    });

    it('should be able to construct', () => {
        expect(session).toBeInstanceOf(Session);
    });

    it('should be able to construct with full arguments', () => {
        const start = new Date('2020-12-24T00:00:00Z');
        const end = new Date('2020-12-24T23:59:59Z');

        const newSession = new Session('client-1', start, end, '1', [], []);

        expect(newSession.getClientId()).toEqual('client-1');
        expect(newSession.getStart()).toEqual(start);
        expect(newSession.getEnd()).toEqual(end);
        expect(newSession.getId()).toEqual('1');
        expect(newSession.getParticipants()).toBeArray();
        expect(newSession.getParticipants()).toHaveLength(0);
        expect(newSession.getTopics()).toBeArray();
        expect(newSession.getTopics()).toHaveLength(0);
    });

    it('should have a client id', () => {
        expect(session.getClientId()).toEqual('client');
    });

    it('should have a id', () => {
        expect(session.getId()).toBeUndefined();

        session.setId('1');
        expect(session.getId()).toEqual('1');
    });

    it('should have a start', () => {
        const start = new Date();

        session.setStart(start);
        expect(session.getStart()).toEqual(start);
    });

    it('should have a end', () => {
        const end = new Date();

        session.setEnd(end);
        expect(session.getEnd()).toEqual(end);
    });

    it('should have participants', () => {
        expect(session.getParticipants()).toBeArray();
        expect(session.getParticipants()).toHaveLength(0);

        const participant = new Participant(1);
        session.setParticipants([participant]);

        expect(session.getParticipants()).toBeArray();
        expect(session.getParticipants()).toHaveLength(1);
        expect(session.getParticipants()).toContain(participant);
    });

    it('should have topics', () => {
        expect(session.getTopics()).toBeArray();
        expect(session.getTopics()).toHaveLength(0);

        const topic = new Topic(new Majority(MajorityType.single), 10, []);
        session.setTopics([topic]);

        expect(session.getTopics()).toBeArray();
        expect(session.getTopics()).toHaveLength(1);
        expect(session.getTopics()).toContain(topic);
    });
});
