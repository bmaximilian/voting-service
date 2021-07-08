import { DynamicModule, Module } from '@nestjs/common';
import { ImportModule } from '../../../../util/ImportModule';
import { VotingGateway } from './gateway/VotingGateway';

@Module({
    providers: [VotingGateway],
})
export class WebSocketReceiverApiModule {
    public static forRoot(imports: ImportModule[]): DynamicModule {
        return {
            module: WebSocketReceiverApiModule,
            imports,
        };
    }
}
