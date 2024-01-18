import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql args output
 */
@ObjectType()
export class Hours {
  @Field(() => GraphQLJSONObject)
  hours: { [key: string]: any };
}
