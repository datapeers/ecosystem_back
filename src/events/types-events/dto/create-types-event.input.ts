import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTypesEventInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;
}
