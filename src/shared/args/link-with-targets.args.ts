import { Field, ArgsType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty } from 'class-validator';
/**
 * graphql args input
 */
@ArgsType()
export class LinkWithTargetsArgs {
  @Field(() => [String])
  @IsNotEmpty()
  @IsArray()
  ids: string[];

  @Field(() => [String])
  @IsNotEmpty()
  @IsArray()
  targetIds: string[];
}
