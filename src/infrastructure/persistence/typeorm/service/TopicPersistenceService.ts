import { Injectable } from '@nestjs/common';
import { Topic } from '../../../../domain';
import { SessionEntity } from '../entities/SessionEntity';
import { TopicRepository } from '../repositories/TopicRepository';
import { TopicEntityFactory } from '../factories/TopicEntityFactory';

@Injectable()
export class TopicPersistenceService {
    public constructor(private topicRepository: TopicRepository, private topicFactory: TopicEntityFactory) {}

    public async create(topic: Topic, sessionEntity: SessionEntity): Promise<Topic> {
        const entity = this.topicFactory.toEntity(topic);
        entity.session = sessionEntity;

        const savedTopic = await this.topicRepository.save(entity);

        return this.topicFactory.fromEntity(savedTopic);
    }
}
