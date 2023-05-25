import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateApplicantInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
