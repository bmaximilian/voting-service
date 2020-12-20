import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HealthCheckModule } from './healthcheck/HealthCheckModule';
import { ApiExceptionFilter } from './ApiExceptionFilter';

@Module({
    imports: [HealthCheckModule],
    providers: [{ provide: APP_FILTER, useClass: ApiExceptionFilter }],
    exports: [HealthCheckModule],
})
export class RestApiModule {}
