import { Mandate } from './Mandate';
import { Participant } from './Participant';

describe('Mandate', () => {
    let mandate: Mandate;
    const participant = new Participant(1);

    beforeEach(() => {
        mandate = new Mandate(participant);
    });

    it('should be able to construct', () => {
        expect(mandate).toBeInstanceOf(Mandate);
    });

    it('should be able to construct with full arguments', () => {
        const newMandate = new Mandate(participant, '1');

        expect(newMandate.getParticipant()).toEqual(participant);
        expect(newMandate.getId()).toEqual('1');
    });

    it('should have a id', () => {
        expect(mandate.getId()).toBeUndefined();

        mandate.setId('1');
        expect(mandate.getId()).toEqual('1');
    });

    it('should have a participant', () => {
        expect(mandate.getParticipant()).toEqual(participant);

        const newParticipant = new Participant(1);
        mandate.setParticipant(newParticipant);

        expect(mandate.getParticipant()).toEqual(newParticipant);
    });
});
