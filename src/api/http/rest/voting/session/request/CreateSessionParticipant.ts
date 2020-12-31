import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateSessionParticipant {
    @IsString()
    @IsNotEmpty()
    @ApiModelProperty({
        description: 'The external identifier of the participant (in the consuming system - can be any string)',
        type: String,
        required: true,
        example: '1305c724-1bbb-487b-8eee-03f2f2cb21b2',
    })
    public id: string;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    @ApiModelProperty({
        description: 'Number of shares the participant represents',
        type: Number,
        required: true,
        example: 1.2,
    })
    public shares: number;

    @IsArray()
    @IsOptional()
    @ApiModelProperty({
        description: 'Ids of participants this participant is enabled to vote for',
        type: [String],
        required: false,
        isArray: true,
        example: ['1305c724-1bbb-487b-8eee-03f2f2cb21b2', '62f502f0-52d5-4f0d-a321-233dff17cad3'],
    })
    public mandates?: string[];
}
