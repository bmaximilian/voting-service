import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ImportModule } from '../util/ImportModule';
import { ApiExceptionFilter } from './http/rest/ApiExceptionFilter';
import { HealthCheckController } from './http/rest/healthcheck/controller/HealthCheckController';

@Module({
    controllers: [HealthCheckController],
    providers: [{ provide: APP_FILTER, useClass: ApiExceptionFilter }],
})
export class ApiModule {
    public static forRoot(imports: ImportModule[]): DynamicModule {
        return {
            module: ApiModule,
            imports,
        };
    }
}
