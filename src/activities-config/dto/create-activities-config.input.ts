import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
@InputType()
export class CreateActivitiesConfigInput {
  @Field(() => Int)
  @IsNotEmpty()
  limit: number;

  @Field(() => Int)
  @IsNotEmpty()
  totalLimit: number;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  availability: Record<string, any>;

  @Field(() => String)
  @IsNotEmpty()
  phase: string;
}
