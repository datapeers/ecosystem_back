import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';

@InputType()
export class CreateResourceInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  extra_options: Record<string, any>;

  @Field(() => String)
  @IsNotEmpty()
  phase: string;

  @Field(() => String)
  @IsNotEmpty()
  content: string;
}
