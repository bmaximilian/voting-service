import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class HealthCheckController {
    @ApiOkResponse({ description: 'The app is alive and running' })
    @Get()
    public getHealthCheck(): void {} // eslint-disable-line @typescript-eslint/no-empty-function
}
