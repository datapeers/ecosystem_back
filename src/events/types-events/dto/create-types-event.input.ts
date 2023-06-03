import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
@InputType()
export class CreateTypesEventInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  extra_options: Record<string, any>;
}
