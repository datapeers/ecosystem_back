import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateReportInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  url: string;
}
