import { InputType, Int, Field } from '@nestjs/graphql';

/**
 * graphql input scheme
 * @ignore
 */
@InputType()
export class CreateApplicantInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
