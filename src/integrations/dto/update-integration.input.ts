import { CreateIntegrationInput } from './create-integration.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
/**
 * graphql input scheme
 */
@InputType()
export class UpdateIntegrationInput extends PartialType(
  CreateIntegrationInput,
) {
  @Field(() => Int)
  id: number;
}
