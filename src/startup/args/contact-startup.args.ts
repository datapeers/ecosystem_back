import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
/**
 * graphql args input
 */
@ArgsType()
export class ContactArgs {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  body: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  subject: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  to: string;

  @IsNotEmpty()
  @Field(() => String)
  from: string;

  @IsOptional()
  @Field(() => String)
  startupName?: string;

  @IsOptional()
  @Field(() => String)
  startupID?: string;
}
