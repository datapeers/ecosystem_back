import { Field, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
/**
 * graphql args input
 */
@ArgsType()
export class CloseFormSubscriptionArgs {
  @Field(() => String)
  @IsNotEmpty()
  id: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  doc?: string;
}
