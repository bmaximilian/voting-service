import { EntityRepository, Repository } from 'typeorm';
import { TopicEntity } from '../entities/TopicEntity';

@EntityRepository(TopicEntity)
export class TopicRepository extends Repository<TopicEntity> {}
