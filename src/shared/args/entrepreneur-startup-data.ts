import { Field, ArgsType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty } from 'class-validator';
/**
 * graphql args input
 */
@ArgsType()
export class EntrepreneurStartupArgs {
  @Field(() => String)
  @IsNotEmpty()
  startup: string;

  @Field(() => String)
  @IsNotEmpty()
  _id: string;

  @Field(() => String)
  @IsNotEmpty()
  rol: string;

  @Field(() => String)
  @IsNotEmpty()
  description: string;
}
