import { DynamicModule, Module } from '@nestjs/common';
import { ImportModule } from '../util/ImportModule';
import { SessionService } from './service/SessionService';

@Module({})
export class VotingDomainModule {
    public static forRoot(imports: ImportModule[]): DynamicModule {
        return {
            module: VotingDomainModule,
            imports,
            providers: [SessionService],
            exports: [SessionService],
        };
    }
}
