import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEvaluationInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
