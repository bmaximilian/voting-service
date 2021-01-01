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
import { CreateSessionTopic } from '../request/CreateSessionTopic';
import { SessionTopicResponse } from '../response/SessionTopicResponse';
import { CreateTopicRequestResponseFactory } from '../factory/CreateTopicRequestResponseFactory';

@Controller('/api/v1/sessions/:sessionId/topics')
export class TopicController {
    public constructor(
        private readonly topicFactory: CreateTopicRequestResponseFactory,
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
        @Body() createTopicRequest: CreateSessionTopic,
    ): Promise<SessionTopicResponse> {
        const clientId = request.authorizationToken.sub;
        const topic = this.topicFactory.fromRequest(createTopicRequest, clientId);

        const createdTopic = await this.sessionService.addTopic(sessionId, topic);

        return this.topicFactory.toResponse(createdTopic, clientId);
    }
}
