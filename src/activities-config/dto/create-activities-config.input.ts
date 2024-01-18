import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * graphql input scheme
 * @param {int} phase  batchId of activity config
 * @param {string} limit  global hours limit
 */
@InputType()
export class CreateActivitiesConfigInput {
  @Field(() => Int)
  @IsNotEmpty()
  limit: number;

  @Field(() => String)
  @IsNotEmpty()
  phase: string;
}
