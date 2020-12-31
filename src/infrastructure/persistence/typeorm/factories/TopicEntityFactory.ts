import { Injectable } from '@nestjs/common';
import { TopicEntity } from '../entities/TopicEntity';
import { Majority, Topic } from '../../../../domain';
import { BallotEntityFactory } from './BallotEntityFactory';

@Injectable()
export class TopicEntityFactory {
    public constructor(private ballotFactory: BallotEntityFactory) {}

    public toEntity(topic: Topic): TopicEntity {
        const topicEntity = new TopicEntity();
        topicEntity.id = topic.getId();
        topicEntity.externalId = topic.getExternalId();
        topicEntity.setAnswerOptions(topic.getAnswerOptions());
        topicEntity.abstentionAnswerOption = topic.getAbstentionAnswerOption();
        topicEntity.completedAt = topic.isCompleted() ? new Date() : undefined;
        topicEntity.majorityQuorumInPercent = topic.getMajority().getQuorumInPercent();
        topicEntity.majorityType = topic.getMajority().getType();
        topicEntity.requiredNumberOfSharesForQuorum = topic.getRequiredNumberOfShares();

        if (topic.getBallots().length > 0) {
            topicEntity.ballots = topic.getBallots().map((ballot) => this.ballotFactory.toEntity(ballot));
        }

        return topicEntity;
    }

    public fromEntity(entity: TopicEntity): Topic {
        const majority = new Majority(entity.majorityType, entity.majorityQuorumInPercent);
        const topic = new Topic(
            entity.externalId,
            majority,
            entity.requiredNumberOfSharesForQuorum,
            entity.getAnswerOptions(),
            entity.abstentionAnswerOption,
            !!entity.completedAt,
            entity.id,
        );

        if (entity.ballots && entity.ballots.length > 0) {
            topic.setBallots(entity.ballots.map((ballot) => this.ballotFactory.fromEntity(ballot)));
        }

        return topic;
    }
}
