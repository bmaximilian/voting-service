import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class SessionParticipantResponse {
    @ApiModelProperty({
        description: 'The external identifier of the participant (in the consuming system - can be any string)',
        type: String,
        required: true,
    })
    public id: string;

    @ApiModelProperty({
        description: 'Number of shares the participant represents',
        type: Number,
        required: true,
        example: 1.2,
    })
    public shares: number;

    @ApiModelProperty({
        description: 'Ids (external identifier) of participants this participant is enabled to vote for',
        type: [String],
        required: false,
        isArray: true,
        example: ['1305c724-1bbb-487b-8eee-03f2f2cb21b2', '62f502f0-52d5-4f0d-a321-233dff17cad3'],
    })
    public mandates?: string[];
}
