import { IsArray, IsDate, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { CreateSessionParticipant } from './CreateSessionParticipant';
import { CreateSessionTopic } from './CreateSessionTopic';

export class CreateSessionRequest {
    @IsNotEmpty()
    @IsDate()
    @Type(/* istanbul ignore next */ () => Date)
    @ApiModelProperty({
        description: 'When the voting session starts (ISO Date)',
        type: String,
        required: true,
        example: new Date().toISOString(),
    })
    public start: Date;

    @IsArray()
    @IsOptional()
    @ValidateNested()
    @ApiModelProperty({
        description: "The session's participants",
        type: [String],
        required: false,
        isArray: true,
        example: [],
    })
    public participants?: CreateSessionParticipant[];

    @IsArray()
    @IsOptional()
    @ValidateNested()
    @ApiModelProperty({
        description: "The session's topics",
        type: [String],
        required: false,
        isArray: true,
        example: [],
    })
    public topics?: CreateSessionTopic[];
}
