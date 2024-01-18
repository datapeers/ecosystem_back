import { CreateStageInput } from './create-stage.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
/**
 * graphql inputs
 */
@InputType()
export class UpdateStageInput extends PartialType(CreateStageInput) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  index?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  label?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  color?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  icon?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;
}
