import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { JwtDecodeMiddleware } from './infrastructure/security/jwt/JwtDecodeMiddleware';
import { HttpApiModule } from './api/http/HttpApiModule';
import { VotingDomainModule } from './domain/VotingDomainModule';
import { InfrastructureModule } from './infrastructure/InfrastructureModule';
import { WebSocketDispatcherApiModule } from './api/ws/voting/dispatcher/WebSocketDispatcherApiModule';
import { WebSocketReceiverApiModule } from './api/ws/voting/receiver/WebSocketReceiverApiModule'; // eslint-disable-line import/order, max-len

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormConfig = require('../ormconfig');

const votingDomain = VotingDomainModule.forRoot([InfrastructureModule, WebSocketDispatcherApiModule]);

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory() {
                return {
                    ...(ormConfig as ConnectionOptions),
                };
            },
        }),
        HttpApiModule.forRoot([votingDomain]),
        WebSocketReceiverApiModule.forRoot([votingDomain]),
    ],
})
export class ApplicationModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(JwtDecodeMiddleware).forRoutes({ path: '/api', method: RequestMethod.ALL });
    }
}
