import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FormCollections } from '../enums/form-collections';
import GraphQLJSON from 'graphql-type-json';
/**
 * graphql input
 */
@InputType()
export class CreateFormInput {
  @Field(() => String, {
    description:
      'Name used to identify the form, this value is not shown with the form fields when rendered.',
  })
  @IsNotEmpty()
  name: string;

  @Field(() => String, {
    description:
      'Form description, this value is not shown with the form fields when rendered.',
  })
  @IsOptional()
  description: string;

  @Field(() => String, {
    description:
      'Serialized form json used to dynamically build the form fields.',
  })
  @IsNotEmpty()
  formJson: string;

  @Field(() => String, {
    description:
      'Target table/collection for this form, determines where the submissions will be stored in the database.',
  })
  @IsNotEmpty()
  target: FormCollections;

  @Field(() => [GraphQLJSON], { description: 'Document input fields' })
  @IsOptional()
  documents: JSON[];

  @Field(() => [String], {
    description:
      'List of form field keys used to identify the form submissions as unique.',
  })
  @IsOptional()
  keys: string[];

  @Field(() => [String], { description: 'List of tags assigned to the form' })
  @IsOptional()
  tags: string[];
}
