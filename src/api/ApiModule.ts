import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ImportModule } from '../util/ImportModule';
import { ApiExceptionFilter } from './http/rest/ApiExceptionFilter';
import { HealthCheckController } from './http/rest/healthcheck/controller/HealthCheckController';
import { SessionController } from './http/rest/voting/session/controller/SessionController';
import { CreateSessionRequestResponseFactory } from './http/rest/voting/session/factory/CreateSessionRequestResponseFactory';
import { CreateTopicRequestResponseFactory } from './http/rest/voting/session/factory/CreateTopicRequestResponseFactory';
import { CreateParticipantRequestResponseFactory } from './http/rest/voting/session/factory/CreateParticipantRequestResponseFactory';
import { ExternalIdComposer } from './http/rest/voting/session/factory/ExternalIdComposer';
import { TopicController } from './http/rest/voting/session/controller/TopicController';

@Module({
    controllers: [HealthCheckController, SessionController, TopicController],
    providers: [
        { provide: APP_FILTER, useClass: ApiExceptionFilter },
        CreateSessionRequestResponseFactory,
        CreateTopicRequestResponseFactory,
        CreateParticipantRequestResponseFactory,
        ExternalIdComposer,
    ],
})
export class ApiModule {
    public static forRoot(imports: ImportModule[]): DynamicModule {
        return {
            module: ApiModule,
            imports,
        };
    }
}
