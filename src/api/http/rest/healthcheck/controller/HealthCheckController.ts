import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class HealthCheckController {
    @Get()
    @ApiOperation({ description: 'Endpoint to see if the application is alive' })
    @ApiOkResponse({ description: 'The app is alive and running' })
    public getHealthCheck(): void {} // eslint-disable-line @typescript-eslint/no-empty-function
}
