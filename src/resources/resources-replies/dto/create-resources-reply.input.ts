import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateResourcesReplyInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
