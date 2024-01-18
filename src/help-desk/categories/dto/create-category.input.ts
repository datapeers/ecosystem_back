import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';
/**
 * @ignore
 */
@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  @IsString()
  @MinLength(2)
  name: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  color: string;
}
