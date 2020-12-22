import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { SessionParticipantResponse } from './SessionParticipantResponse';
import { SessionTopicResponse } from './SessionTopicResponse';

export class SessionCreateResponse {
    @ApiModelProperty({
        description: 'Id of the created session',
        type: String,
        required: true,
    })
    public id: string;

    @ApiModelProperty({
        description: 'Scheduled start for the voting session',
        type: Date,
        required: true,
    })
    public start: Date;

    @ApiModelProperty({
        description: 'End of the voting session (undefined if still ongoing)',
        type: Date,
        required: false,
    })
    public end?: Date;

    @ApiModelProperty({
        description: 'The invited participants for the voting session',
        type: [SessionParticipantResponse],
        isArray: true,
        required: true,
    })
    public participants: SessionParticipantResponse[];

    @ApiModelProperty({
        description: 'The topics that need to be voted about in this voting session',
        type: [SessionTopicResponse],
        isArray: true,
        required: true,
    })
    public topics: SessionTopicResponse[];
}
