import { Injectable } from '@nestjs/common';
import { Majority, Topic } from '../../../../../../domain';
import { CreateSessionTopic } from '../request/CreateSessionTopic';
import { SessionTopicResponse } from '../response/SessionTopicResponse';
import { CreateSessionMajority } from '../request/CreateSessionMajority';
import { ExternalIdComposer } from './ExternalIdComposer';

@Injectable()
export class CreateTopicRequestResponseFactory {
    public constructor(private externalIdComposer: ExternalIdComposer) {}

    public fromRequest(request: CreateSessionTopic, clientId: string): Topic {
        const majority = new Majority(request.majority.type, request.majority.quorumInPercent);
        const topic = new Topic(
            this.externalIdComposer.compose(request.id, clientId),
            majority,
            request.requiredNumberOfShares,
            request.answerOptions,
            request.abstentionAnswerOption,
        );

        return topic;
    }

    public toResponse(topic: Topic, clientId: string): SessionTopicResponse {
        const majority: CreateSessionMajority = {
            type: topic.getMajority().getType(),
        };

        if (topic.getMajority().getQuorumInPercent()) {
            majority.quorumInPercent = topic.getMajority().getQuorumInPercent();
        }

        return {
            id: this.externalIdComposer.decompose(topic.getExternalId(), clientId),
            answerOptions: topic.getAnswerOptions(),
            abstentionAnswerOption: topic.getAbstentionAnswerOption(),
            requiredNumberOfShares: topic.getRequiredNumberOfShares(),
            majority,
        };
    }
}
