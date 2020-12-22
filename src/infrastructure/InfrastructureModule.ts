import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbstractSessionPersistenceService } from '../domain';
import { SessionPersistenceService } from './persistence/typeorm/service/SessionPersistenceService';
import { SessionRepository } from './persistence/typeorm/repositories/SessionRepository';
import { TopicRepository } from './persistence/typeorm/repositories/TopicRepository';
import { ParticipantRepository } from './persistence/typeorm/repositories/ParticipantRepository';
import { BallotRepository } from './persistence/typeorm/repositories/BallotRepository';
import { MandateRepository } from './persistence/typeorm/repositories/MandateRepository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SessionRepository,
            TopicRepository,
            ParticipantRepository,
            BallotRepository,
            MandateRepository,
        ]),
    ],
    providers: [{ provide: AbstractSessionPersistenceService, useClass: SessionPersistenceService }],
    exports: [AbstractSessionPersistenceService],
})
export class InfrastructureModule {}
