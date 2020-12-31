import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ImportModule } from '../util/ImportModule';
import { ApiExceptionFilter } from './http/rest/ApiExceptionFilter';
import { HealthCheckController } from './http/rest/healthcheck/controller/HealthCheckController';
import { SessionController } from './http/rest/voting/session/controller/SessionController';
import { CreateSessionRequestResponseFactory } from './http/rest/voting/session/factory/CreateSessionRequestResponseFactory';

@Module({
    controllers: [HealthCheckController, SessionController],
    providers: [{ provide: APP_FILTER, useClass: ApiExceptionFilter }, CreateSessionRequestResponseFactory],
})
export class ApiModule {
    public static forRoot(imports: ImportModule[]): DynamicModule {
        return {
            module: ApiModule,
            imports,
        };
    }
}
