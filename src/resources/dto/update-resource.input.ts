import { IsNotEmpty, IsOptional } from 'class-validator';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';
import { CreateResourceInput } from './create-resource.input';
/**
 * graphql input scheme
 */
@InputType()
export class UpdateResourceInput extends PartialType(CreateResourceInput) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  extra_options: Record<string, any>;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  hide?: boolean;
}
