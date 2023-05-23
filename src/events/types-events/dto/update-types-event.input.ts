import { CreateTypesEventInput } from './create-types-event.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdateTypesEventInput extends PartialType(CreateTypesEventInput) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;
}
