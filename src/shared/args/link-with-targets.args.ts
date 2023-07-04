import { Field, ArgsType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty } from 'class-validator';

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