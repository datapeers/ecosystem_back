import { CreateIntegrationInput } from './create-integration.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateIntegrationInput extends PartialType(CreateIntegrationInput) {
  @Field(() => Int)
  id: number;
}
