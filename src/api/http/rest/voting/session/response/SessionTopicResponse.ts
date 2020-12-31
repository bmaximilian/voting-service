import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class SessionTopicResponse {
    @ApiModelProperty({
        description: 'The external identifier of the topic (in the consuming system - can be any string)',
        type: String,
        required: true,
    })
    public id: string;
}
