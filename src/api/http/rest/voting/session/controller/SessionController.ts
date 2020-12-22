import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
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

    @ApiCreatedResponse({})
    @Post()
    public async create(
        @Req() request: ApiRequest,
        @Body() createSessionRequest: CreateSessionRequest,
    ): Promise<SessionCreateResponse> {
        const session = this.createSessionFactory.createSession(createSessionRequest, request.authorizationToken.sub);

        const createdSession = await this.sessionService.create(session);

        return this.createSessionFactory.createResponse(createdSession);
    }
}
