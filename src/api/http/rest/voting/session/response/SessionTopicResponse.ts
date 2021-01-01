import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { CreateSessionMajority } from '../request/CreateSessionMajority';
import { MajorityType } from '../../../../../../domain';

export class SessionTopicResponse {
    @ApiModelProperty({
        description: 'The external identifier of the topic (in the consuming system - can be any string)',
        type: String,
        required: true,
    })
    public id: string;

    @ApiModelProperty({
        description:
            'Answer options the participants are allowed to enter (could also be ids of the answer options in the consuming system)', // eslint-disable-line max-len
        type: [String],
        required: true,
        isArray: true,
        example: ['yes', 'no', 'abstention'],
    })
    public answerOptions: string[];

    @ApiModelProperty({
        description: 'Answer option that should be counted as abstention',
        type: String,
        required: false,
        example: 'abstention',
    })
    public abstentionAnswerOption?: string;

    @ApiModelProperty({
        description: 'Number of shares that need to be represented to form a quorum',
        type: Number,
        required: true,
        example: 80,
    })
    public requiredNumberOfShares: number;

    @ApiModelProperty({
        description: 'The strategy on which the votes should be counted',
        type: CreateSessionMajority,
        required: true,
        example: {
            type: MajorityType.single,
        },
    })
    public majority: CreateSessionMajority;
}
