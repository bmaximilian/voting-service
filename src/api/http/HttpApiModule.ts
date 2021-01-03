import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ImportModule } from '../../util/ImportModule';
import { ApiExceptionFilter } from './rest/ApiExceptionFilter';
import { HealthCheckController } from './rest/healthcheck/controller/HealthCheckController';
import { SessionController } from './rest/voting/session/controller/SessionController';
import { CreateSessionRequestResponseFactory } from './rest/voting/session/factory/CreateSessionRequestResponseFactory';
import { CreateTopicRequestResponseFactory } from './rest/voting/session/factory/CreateTopicRequestResponseFactory';
import { CreateParticipantRequestResponseFactory } from './rest/voting/session/factory/CreateParticipantRequestResponseFactory';
import { ExternalIdComposer } from './rest/voting/session/factory/ExternalIdComposer';
import { TopicController } from './rest/voting/session/controller/TopicController';
import { ParticipantController } from './rest/voting/session/controller/ParticipantController';

@Module({
    controllers: [HealthCheckController, SessionController, TopicController, ParticipantController],
    providers: [
        { provide: APP_FILTER, useClass: ApiExceptionFilter },
        CreateSessionRequestResponseFactory,
        CreateTopicRequestResponseFactory,
        CreateParticipantRequestResponseFactory,
        ExternalIdComposer,
    ],
})
export class HttpApiModule {
    public static forRoot(imports: ImportModule[]): DynamicModule {
        return {
            module: HttpApiModule,
            imports,
        };
    }
}
