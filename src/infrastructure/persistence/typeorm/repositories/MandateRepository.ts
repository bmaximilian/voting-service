import { EntityRepository, Repository } from 'typeorm';
import { MandateEntity } from '../entities/MandateEntity';

@EntityRepository(MandateEntity)
export class MandateRepository extends Repository<MandateEntity> {}
