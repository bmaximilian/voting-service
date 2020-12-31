import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class SessionParticipantResponse {
    @ApiModelProperty({
        description: 'The external identifier of the participant (in the consuming system - can be any string)',
        type: String,
        required: true,
    })
    public id: string;
}
