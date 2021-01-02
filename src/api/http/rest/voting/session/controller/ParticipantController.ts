import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOperation,
} from '@nestjs/swagger';
import { SessionCreateResponse } from '../response/SessionCreateResponse';
import { ApiRequest } from '../../../../../../infrastructure/security/jwt/ApiRequest';
import { SessionService } from '../../../../../../domain';
import { CreateParticipantRequestResponseFactory } from '../factory/CreateParticipantRequestResponseFactory';
import { CreateSessionParticipant } from '../request/CreateSessionParticipant';
import { SessionParticipantResponse } from '../response/SessionParticipantResponse';

@Controller('/api/v1/sessions/:sessionId/participants')
export class ParticipantController {
    public constructor(
        private readonly participantFactory: CreateParticipantRequestResponseFactory,
        private readonly sessionService: SessionService,
    ) {}

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ description: 'Adds a new topic to an existing voting session' })
    @ApiCreatedResponse({ description: 'Topic successfully created', type: [SessionCreateResponse] })
    @ApiForbiddenResponse({
        description: 'Passed authorization token not valid. API token mus be passed as authorization header',
    })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    @ApiNotFoundResponse({ description: 'Session with requested id not found' })
    public async create(
        @Req() request: ApiRequest,
        @Param('sessionId') sessionId: string,
        @Body() createParticipantRequest: CreateSessionParticipant,
    ): Promise<SessionParticipantResponse> {
        const clientId = request.authorizationToken.sub;
        const participant = this.participantFactory.fromRequest(createParticipantRequest, clientId);

        const createdParticipant = await this.sessionService.addParticipant(sessionId, participant);

        return this.participantFactory.toResponse(createdParticipant, clientId);
    }
}
