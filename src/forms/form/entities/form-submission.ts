import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
/**
 * graphql args input of form submission
 */
@ObjectType()
export class FormSubmission {
  @Field(() => String)
  _id: string;

  @Field(() => GraphQLJSON)
  submission: JSON;
}
