import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';

@InputType()
export class CreateUserLogInput {
  @Field(() => GraphQLJSONObject)
  @IsOptional()
  metadata: Record<string, any>;
}
