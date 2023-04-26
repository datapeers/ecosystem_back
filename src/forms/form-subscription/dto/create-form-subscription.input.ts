import { InputType, Field } from '@nestjs/graphql';
import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { FormCollections } from 'src/forms/form/enums/form-collections';

@InputType()
export class CreateFormSubscriptionInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  doc?: string;

  @Field(() => String)
  @IsNotEmpty()
  form: string;

  @Field(() => GraphQLJSON, { nullable: true })
  data?: JSON;
  @IsOptional()

  @Field(() => String, { nullable: true })
  @IsOptional()
  reason?: string;

  @IsEmpty()
  target?: FormCollections;
}
