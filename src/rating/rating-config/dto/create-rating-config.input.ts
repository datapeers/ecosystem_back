import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRatingConfigInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
