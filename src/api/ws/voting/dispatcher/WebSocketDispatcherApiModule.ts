import { Module } from '@nestjs/common';
import { AbstractSessionMessagingGateway } from '../../../../domain';
import { SessionGateway } from './gateway/SessionGateway';

@Module({
    providers: [{ provide: AbstractSessionMessagingGateway, useClass: SessionGateway }],
    exports: [AbstractSessionMessagingGateway],
})
export class WebSocketDispatcherApiModule {}
