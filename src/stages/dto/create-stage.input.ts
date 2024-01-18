import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
/**
 * graphql inputs
 */
@InputType()
export class CreateStageInput {
  @Field(() => Int)
  @IsNotEmpty()
  index: number;

  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description: string;

  @Field(() => String)
  @IsNotEmpty()
  label: string;

  @Field(() => String)
  @IsNotEmpty()
  color: string;

  @Field(() => String)
  @IsNotEmpty()
  icon: string;
}
