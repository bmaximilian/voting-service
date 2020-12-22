import { Participant } from './Participant';
import { Mandate } from './Mandate';

describe('Participant', () => {
    let participant: Participant;
    beforeEach(() => {
        participant = new Participant('ext-1', 1.5);
    });

    it('should be able to construct', () => {
        expect(participant).toBeInstanceOf(Participant);
    });

    it('should be able to construct with full arguments', () => {
        const newParticipant = new Participant('ext-2', 2.4, '1', []);

        expect(newParticipant.getShares()).toEqual(2.4);
        expect(newParticipant.getId()).toEqual('1');
        expect(newParticipant.getExternalId()).toEqual('ext-2');
        expect(newParticipant.getMandates()).toBeArray();
        expect(newParticipant.getMandates()).toHaveLength(0);
    });

    it('should have a id', () => {
        expect(participant.getId()).toBeUndefined();

        participant.setId('1');
        expect(participant.getId()).toEqual('1');
    });

    it('should have a external id', () => {
        expect(participant.getExternalId()).toEqual('ext-1');
    });

    it('should have mandates', () => {
        expect(participant.getMandates()).toBeArray();
        expect(participant.getMandates()).toHaveLength(0);

        const mandate = new Mandate(new Participant('ext-4', 1));
        participant.setMandates([mandate]);

        expect(participant.getMandates()).toBeArray();
        expect(participant.getMandates()).toContain(mandate);
    });

    it('should have shares', () => {
        participant.setShares(1.22);

        expect(participant.getShares()).toEqual(1.22);
    });
});
