import { IsNotEmpty, IsOptional } from 'class-validator';
import { InputType, Field, ID } from '@nestjs/graphql';
/**
 * graphql args input
 */
@InputType()
export class UpdateExpertInput {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  accountId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  calendlyLink?: string;
}
