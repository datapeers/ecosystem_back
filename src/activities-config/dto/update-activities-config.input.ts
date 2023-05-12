import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateActivitiesConfigInput } from './create-activities-config.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';
@InputType()
export class UpdateActivitiesConfigInput extends PartialType(
  CreateActivitiesConfigInput,
) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  limit?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  totalLimit?: number;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  availability?: Record<string, any>;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;
}
