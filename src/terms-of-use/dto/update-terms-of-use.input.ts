import { CreateTermsOfUseInput } from './create-terms-of-use.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql inputs
 */
@InputType()
export class UpdateTermsOfUseInput {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  content?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  extra_options: Record<string, any>;
}
