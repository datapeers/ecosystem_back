import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
@InputType()
export class CreateContentInput {
  @Field(() => String, { defaultValue: '' })
  @IsOptional()
  content: string;

  @ApiProperty({ type: () => Object, additionalProperties: true })
  @IsNotEmpty()
  extra_options: any;

  @Field(() => String)
  @IsNotEmpty()
  phase: string;
}
