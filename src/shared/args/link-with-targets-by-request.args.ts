import { Field, ArgsType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { PageRequest } from 'src/shared/models/page-request';
/**
 * graphql args input
 */
@ArgsType()
export class LinkWithTargetsByRequestArgs {
  @Field(() => PageRequest)
  @ValidateNested()
  @Type(() => PageRequest)
  @IsNotEmpty()
  request: PageRequest;

  @Field(() => [String])
  @IsNotEmpty()
  @IsArray()
  targetIds: string[];
}
