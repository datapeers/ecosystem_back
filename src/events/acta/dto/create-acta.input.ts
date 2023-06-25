import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';

@InputType()
export class CreateActaInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  objective: string;

  @Field(() => String)
  @IsNotEmpty()
  solution: string;

  @Field(() => Date)
  @IsNotEmpty()
  date: Date;

  @Field(() => String)
  @IsNotEmpty()
  topics_covered: string;

  @Field(() => String)
  @IsNotEmpty()
  conclusions: string;

  @Field(() => String)
  @IsNotEmpty()
  phase: string;

  @Field(() => String)
  @IsNotEmpty()
  event: string;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  extra_options: Record<string, any>;
}
