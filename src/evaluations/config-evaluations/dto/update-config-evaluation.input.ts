import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateConfigEvaluationInput } from './create-config-evaluation.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
/**
 * graphql input scheme
 */
@InputType()
export class UpdateConfigEvaluationInput extends PartialType(
  CreateConfigEvaluationInput,
) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  startAt: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  endAt: Date;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;
}
