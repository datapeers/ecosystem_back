import { InputType, Field } from '@nestjs/graphql';
import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { FormCollections } from 'src/forms/form/enums/form-collections';
/**
 * graphql input
 */
@InputType()
export class CreateFormSubscriptionInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  doc?: string;

  @Field(() => String)
  @IsNotEmpty()
  form: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  data?: JSON;

  @Field(() => String, { nullable: true })
  @IsOptional()
  reason?: string;

  @IsEmpty()
  target?: FormCollections;
}
