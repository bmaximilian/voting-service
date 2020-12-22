import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { MajorityType } from '../../../../../../domain';
import { CreateSessionMajority } from './CreateSessionMajority';

export class CreateSessionTopic {
    @IsString()
    @IsNotEmpty()
    @ApiModelProperty({
        description: 'The external identifier of the topic (in the consuming system - can be any string)',
        type: String,
        required: true,
        example: '1305c724-1bbb-487b-8eee-03f2f2cb21b2',
    })
    public id: string;

    @IsArray()
    @IsNotEmpty()
    @ApiModelProperty({
        description:
            'Answer options the participants are allowed to enter (could als be ids of the answer options in the consuming system)', // eslint-disable-line max-len
        type: [String],
        required: true,
        isArray: true,
        example: ['yes', 'no', 'abstention'],
    })
    public answerOptions: string[];

    @IsString()
    @IsOptional()
    @ApiModelProperty({
        description: 'Answer option that should be counted as abstention',
        type: String,
        required: false,
        example: 'abstention',
    })
    public abstentionAnswerOption?: string;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    @ApiModelProperty({
        description: 'Number of shares that need to be represented to form a quorum',
        type: Number,
        required: true,
        example: 80,
    })
    public requiredNumberOfShares: number;

    @ValidateNested()
    @IsNotEmpty()
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
