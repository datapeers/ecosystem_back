import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql input scheme
 */
@InputType()
export class CreateActaInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsOptional()
  objective?: string;

  @Field(() => String)
  @IsOptional()
  solution?: string;

  @Field(() => Date)
  @IsNotEmpty()
  date: Date;

  @Field(() => String)
  @IsOptional()
  topics_covered?: string;

  @Field(() => String)
  @IsOptional()
  conclusions?: string;

  @Field(() => String)
  @IsNotEmpty()
  phase: string;

  @Field(() => String)
  @IsNotEmpty()
  event: string;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  extra_options: Record<string, any>;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  closed?: boolean;
}
