import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
/**
 * graphql inputs
 */
@InputType()
export class UpdateFormTagInput {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String)
  @IsNotEmpty()
  name: string;
}
