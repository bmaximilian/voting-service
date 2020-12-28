import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { ImportModule } from '../../../../util/ImportModule';
import { SessionRepository } from '../repositories/SessionRepository';
import { TopicRepository } from '../repositories/TopicRepository';
import { ParticipantRepository } from '../repositories/ParticipantRepository';
import { BallotRepository } from '../repositories/BallotRepository';
import { MandateRepository } from '../repositories/MandateRepository'; // eslint-disable-line import/order

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormConfig = require('../../../../../ormconfig');

export function createDatabaseModuleImports(): ImportModule[] {
    return [
        TypeOrmModule.forRootAsync({
            useFactory() {
                return {
                    ...(ormConfig as ConnectionOptions),
                };
            },
        }),
        TypeOrmModule.forFeature([
            SessionRepository,
            TopicRepository,
            ParticipantRepository,
            BallotRepository,
            MandateRepository,
        ]),
    ];
}
