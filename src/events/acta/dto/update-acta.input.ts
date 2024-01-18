import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
import { CreateActaInput } from './create-acta.input';
/**
 * graphql input scheme
 */
@InputType()
export class UpdateActaInput extends PartialType(CreateActaInput) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  objective?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  solution?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  date?: Date;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  topics_covered?: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  conclusions?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  extra_options?: Record<string, any>;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  closed?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;
}
