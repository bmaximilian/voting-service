import { Module } from '@nestjs/common';
import { RestApiModule } from './http/rest/RestApiModule';

@Module({
    imports: [RestApiModule],
})
export class ApiModule {}
