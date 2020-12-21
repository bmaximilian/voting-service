import { Majority, MajorityType } from './Majority';

describe('Majority', () => {
    let majority: Majority;
    beforeEach(() => {
        majority = new Majority(MajorityType.relative);
    });

    it('should be able to construct', () => {
        expect(majority).toBeInstanceOf(Majority);
    });

    it('should be able to construct with all arguments', () => {
        const newMajority = new Majority(MajorityType.qualified, 33.333);

        expect(newMajority).toBeInstanceOf(Majority);
        expect(newMajority.getType()).toEqual(MajorityType.qualified);
        expect(newMajority.getQuorumInPercent()).toEqual(33.333);
    });

    it('should have a type', () => {
        majority.setType(MajorityType.absolute);
        expect(majority.getType()).toEqual(MajorityType.absolute);
    });

    it('should have a quorum', () => {
        majority.setQuorumInPercent(66.666);
        expect(majority.getQuorumInPercent()).toEqual(66.666);
    });
});
