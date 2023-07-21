import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
@InputType()
export class CreateActivitiesConfigInput {
  @Field(() => Int)
  @IsNotEmpty()
  limit: number;

  @Field(() => String)
  @IsNotEmpty()
  phase: string;
}
