import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsDefined,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { LogicOperator } from './logic-operator.enum';
import { MatchMode } from './match-mode.enum';
import GraphQLJSON from 'graphql-type-json';
import { Type } from 'class-transformer';
/**
 * @ignore
 */
@InputType()
export class FieldFilter {
  @IsDefined()
  @IsEnum(LogicOperator)
  @Field(() => LogicOperator)
  operator: LogicOperator;

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FilterOperation)
  @Field(() => [FilterOperation])
  operations: FilterOperation[];
}
/**
 * @ignore
 */
@InputType()
class FilterOperation {
  @IsString()
  @IsDefined()
  @Field()
  field: string;

  @IsDefined()
  @Field(() => GraphQLJSON)
  value: any;

  @IsEnum(MatchMode)
  @IsDefined()
  @Field(() => MatchMode)
  matchMode: MatchMode;
}
