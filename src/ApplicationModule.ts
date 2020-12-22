import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { JwtDecodeMiddleware } from './infrastructure/security/jwt/JwtDecodeMiddleware';
import { ApiModule } from './api/ApiModule';
import { VotingDomainModule } from './domain/VotingDomainModule';
import { InfrastructureModule } from './infrastructure/InfrastructureModule'; // eslint-disable-line import/order

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormConfig = require('./ormconfig');

const votingDomain = VotingDomainModule.forRoot([InfrastructureModule]);

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory() {
                return {
                    ...(ormConfig as ConnectionOptions),
                };
            },
        }),
        ApiModule.forRoot([votingDomain]),
    ],
})
export class ApplicationModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(JwtDecodeMiddleware).forRoutes({ path: '/api', method: RequestMethod.ALL });
    }
}
