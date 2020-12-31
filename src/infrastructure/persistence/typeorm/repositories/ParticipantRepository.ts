import { EntityRepository, Repository } from 'typeorm';
import { ParticipantEntity } from '../entities/ParticipantEntity';

@EntityRepository(ParticipantEntity)
export class ParticipantRepository extends Repository<ParticipantEntity> {}
