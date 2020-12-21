import { Ballot } from './Ballot';
import { Participant } from './Participant';
import { Mandate } from './Mandate';

describe('Ballot', () => {
    let ballot: Ballot;
    const participant = new Participant(3);
    const answer = 'yes';

    beforeEach(() => {
        ballot = new Ballot(participant, answer);
    });

    it('should be able to construct', () => {
        expect(ballot).toBeInstanceOf(Ballot);
    });

    it('should be able to construct with all arguments', () => {
        const mandate = new Mandate(new Participant(10));
        const newBallot = new Ballot(participant, answer, mandate, '1');

        expect(newBallot.getParticipant()).toEqual(participant);
        expect(newBallot.getAnswerOption()).toEqual(answer);
        expect(newBallot.getMandate()).toEqual(mandate);
        expect(newBallot.getId()).toEqual('1');
    });

    it('should have a id', () => {
        expect(ballot.getId()).toBeUndefined();

        ballot.setId('1');
        expect(ballot.getId()).toEqual('1');
    });

    it('should have a participant', () => {
        expect(ballot.getParticipant()).toEqual(participant);
    });

    it('should have a answer', () => {
        expect(ballot.getAnswerOption()).toEqual(answer);
    });

    it('should have mandate', () => {
        const mandate = new Mandate(new Participant(10));
        const newBallot = new Ballot(participant, answer, mandate);

        expect(newBallot.getMandate()).toEqual(mandate);
    });
});
