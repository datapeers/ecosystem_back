import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRatingInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
