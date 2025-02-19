import { Topic } from './Topic';
import { Majority, MajorityType } from './Majority';
import { Ballot } from './Ballot';
import { Participant } from './Participant';

describe('Topic', () => {
    let topic: Topic;
    const majority = new Majority(MajorityType.relative);

    beforeEach(() => {
        topic = new Topic('ext-1', majority, 20, []);
    });

    it('should be able to construct', () => {
        expect(topic).toBeInstanceOf(Topic);
    });

    it('should be able to construct with all arguments', () => {
        const newTopic = new Topic('ext-2', majority, 20, [], 'abs', true, '1', []);

        expect(newTopic.getMajority()).toEqual(majority);
        expect(newTopic.getRequiredNumberOfShares()).toEqual(20);
        expect(newTopic.getAnswerOptions()).toEqual([]);
        expect(newTopic.getAbstentionAnswerOption()).toEqual('abs');
        expect(newTopic.isCompleted()).toBeTrue();
        expect(newTopic.getId()).toEqual('1');
        expect(newTopic.getExternalId()).toEqual('ext-2');
        expect(newTopic.getBallots()).toEqual([]);
    });

    it('should have a id', () => {
        expect(topic.getId()).toBeUndefined();

        topic.setId('1');
        expect(topic.getId()).toEqual('1');
    });

    it('should have a external id', () => {
        expect(topic.getExternalId()).toEqual('ext-1');
    });

    it('should have a ballots', () => {
        expect(topic.getBallots()).toBeArray();
        expect(topic.getBallots()).toHaveLength(0);

        const ballot = new Ballot(new Participant('foo', 1), 'yes');
        topic.setBallots([ballot]);

        expect(topic.getBallots()).toBeArray();
        expect(topic.getBallots()).toHaveLength(1);
        expect(topic.getBallots()).toContain(ballot);
    });

    it('should have answer options', () => {
        expect(topic.getAnswerOptions()).toBeArray();
        expect(topic.getAnswerOptions()).toHaveLength(0);
    });

    it('should have abstention answer option', () => {
        expect(topic.getAbstentionAnswerOption()).toBeUndefined();
    });

    it('should have a majority', () => {
        expect(topic.getMajority()).toBeInstanceOf(Majority);
    });

    it('should have a required amount of shares', () => {
        expect(topic.getRequiredNumberOfShares()).toEqual(20);
    });

    it('should be able to set to completed', () => {
        expect(topic.isCompleted()).toBeFalse();

        topic.setCompleted(true);

        expect(topic.isCompleted()).toBeTrue();
    });
});
