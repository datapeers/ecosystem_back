import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
/**
 * graphql input scheme
 */
@InputType()
export class CreateConfigEvaluationInput {
  @Field(() => String)
  @IsNotEmpty()
  title: string;

  @Field(() => String)
  @IsOptional()
  description: string;

  @Field(() => String)
  @IsNotEmpty()
  reviewer: string;

  @Field(() => String)
  @IsNotEmpty()
  evaluated: string;

  @Field(() => String)
  @IsNotEmpty()
  form: string;

  @Field(() => String)
  @IsNotEmpty()
  phase: string;

  @Field(() => Date)
  @IsNotEmpty()
  startAt: Date;

  @Field(() => Date)
  @IsNotEmpty()
  endAt: Date;
}
