import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
/**
 * graphql inputs
 */
@InputType()
export class CreateFormTagInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;
}
