import { ObjectType, Field, Int } from '@nestjs/graphql';
/**
 * @ignore
 */
@ObjectType()
export class RatingConfig {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
