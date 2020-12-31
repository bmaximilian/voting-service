import { EntityRepository, Repository } from 'typeorm';
import { BallotEntity } from '../entities/BallotEntity';

@EntityRepository(BallotEntity)
export class BallotRepository extends Repository<BallotEntity> {}
