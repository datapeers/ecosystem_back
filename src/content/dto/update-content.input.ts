import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateContentInput } from './create-content.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql input scheme
 */
@InputType()
export class UpdateContentInput extends PartialType(CreateContentInput) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  hide?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  content?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  extra_options?: Record<string, any>;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;
}
