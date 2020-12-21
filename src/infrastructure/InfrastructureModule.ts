import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbstractSessionPersistenceService } from '../domain';
import { SessionPersistenceService } from './persistence/typeorm/service/SessionPersistenceService';

@Module({
    imports: [TypeOrmModule.forFeature([])],
    providers: [{ provide: AbstractSessionPersistenceService, useClass: SessionPersistenceService }],
    exports: [AbstractSessionPersistenceService],
})
export class InfrastructureModule {}
