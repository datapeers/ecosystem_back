import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { TableJoin } from '../entities/table-join';
import { Type } from 'class-transformer';
/**
 * graphql inputs
 */
@InputType()
export class AddTableJoinInput {
  @Field(() => String, { description: 'Table id.' })
  @IsNotEmpty()
  id: string;

  @Field(() => TableJoin, { description: 'Metadata related to new join.' })
  @ValidateNested()
  @Type(() => TableJoin)
  @IsNotEmpty()
  join: TableJoin;
}
