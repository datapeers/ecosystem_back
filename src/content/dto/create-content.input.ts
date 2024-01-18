import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql input scheme
 */
@InputType()
export class CreateContentInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String, { defaultValue: '' })
  @IsOptional()
  content: string;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  extra_options: Record<string, any>;

  @Field(() => String)
  @IsNotEmpty()
  phase: string;
}
