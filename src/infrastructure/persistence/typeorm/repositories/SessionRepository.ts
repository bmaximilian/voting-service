import { EntityRepository, Repository } from 'typeorm';
import { SessionEntity } from '../entities/SessionEntity';

@EntityRepository(SessionEntity)
export class SessionRepository extends Repository<SessionEntity> {}
