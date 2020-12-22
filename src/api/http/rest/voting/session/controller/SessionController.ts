import { Body, Controller, Post, Req } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
} from '@nestjs/swagger';
import { SessionCreateResponse } from '../response/SessionCreateResponse';
import { CreateSessionRequestResponseFactory } from '../factory/CreateSessionRequestResponseFactory';
import { CreateSessionRequest } from '../request/CreateSessionRequest';
import { ApiRequest } from '../../../../../../infrastructure/security/jwt/ApiRequest';
import { SessionService } from '../../../../../../domain';

@Controller('/api/v1/sessions')
export class SessionController {
    public constructor(
        private readonly createSessionFactory: CreateSessionRequestResponseFactory,
        private readonly sessionService: SessionService,
    ) {}

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ description: 'Creates/schedules a new voting session' })
    @ApiCreatedResponse({ description: 'Session successfully created', type: [SessionCreateResponse] })
    @ApiForbiddenResponse({
        description: 'Passed authorization token not valid. API token mus be passed as authorization header',
    })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    public async create(
        @Req() request: ApiRequest,
        @Body() createSessionRequest: CreateSessionRequest,
    ): Promise<SessionCreateResponse> {
        const session = this.createSessionFactory.createSession(createSessionRequest, request.authorizationToken.sub);

        const createdSession = await this.sessionService.create(session);

        return this.createSessionFactory.createResponse(createdSession);
    }
}
