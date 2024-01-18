import { InputType, Int, Field } from '@nestjs/graphql';

/**
 * graphql input scheme
 * @ignore
 */
@InputType()
export class CreateEvaluationInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
