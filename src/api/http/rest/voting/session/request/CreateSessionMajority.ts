import { IsIn, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { MajorityType } from '../../../../../../domain';

export class CreateSessionMajority {
    @IsIn(Object.values(MajorityType))
    @IsNotEmpty()
    @ApiModelProperty({
        description: 'Type of the majority',
        type: String,
        enum: Object.values(MajorityType),
        required: true,
        example: MajorityType.qualified,
    })
    public type: MajorityType;

    @IsNumber()
    @Min(0)
    @ApiModelProperty({
        description: 'Percentage of votes required for a decision (only required for qualified majority)',
        type: Number,
        required: false,
        example: 66.666,
    })
    public quorumInPercent?: number;
}
