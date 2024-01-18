import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsDefined,
  IsInt,
  NotEquals,
  Min,
  Max,
} from 'class-validator';
/**
 * @ignore
 */
@InputType()
export class FieldSort {
  @IsString()
  @IsDefined()
  @Field()
  field: string;

  @IsDefined()
  @IsInt()
  @NotEquals(0)
  @Min(-1)
  @Max(1)
  @Field()
  order: number;
}
