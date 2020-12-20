import { Module } from '@nestjs/common';
import { HealthCheckController } from './controller/HealthCheckController';

/**
 * Chat REST API
 */
@Module({
    controllers: [HealthCheckController],
})
export class HealthCheckModule {}
