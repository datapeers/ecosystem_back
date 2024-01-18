import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { FormFileSubmission } from 'src/forms/factories/form-file-submission';
/**
 * graphql args input of documents in a form submission
 */
@ObjectType()
export class FormSubmissionFiles {
  @Field(() => [GraphQLJSON])
  documents: FormFileSubmission[];
}
