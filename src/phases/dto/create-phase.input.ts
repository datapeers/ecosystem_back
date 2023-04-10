import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePhaseInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
