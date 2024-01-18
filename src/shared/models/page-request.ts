import { Field, InputType } from '@nestjs/graphql';
import {
  IsDefined,
  IsInt,
  IsOptional,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';
import { FieldSort } from './field-filter';
import { FieldFilter } from './field-order';
import { Type } from 'class-transformer';
/**
 * @ignore
 */
@InputType()
export class PageRequest {
  @IsDefined()
  @IsInt()
  @Min(0)
  @Field()
  skip: number;

  @IsDefined()
  @IsInt()
  @IsPositive()
  @Field()
  limit: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => FieldFilter)
  @Field(() => FieldFilter, { nullable: true })
  globalFilter: FieldFilter;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FieldSort)
  @Field(() => [FieldSort])
  sort: FieldSort[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FieldFilter)
  @Field(() => [FieldFilter])
  filter: FieldFilter[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FieldSort)
  @Field(() => [FieldSort])
  foreignSort: FieldSort[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FieldFilter)
  @Field(() => [FieldFilter])
  foreignFilter: FieldFilter[];
}
