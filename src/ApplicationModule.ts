import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from '../ormconfig';
import { JwtDecodeMiddleware } from './infrastructure/security/jwt/JwtDecodeMiddleware';
import { ApiModule } from './api/ApiModule';
import { VotingDomainModule } from './domain/VotingDomainModule';
import { InfrastructureModule } from './infrastructure/InfrastructureModule';

const votingDomain = VotingDomainModule.forRoot([InfrastructureModule]);

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory() {
                return {
                    ...typeOrmConfig,
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
