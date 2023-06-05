import { Field, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@ObjectType()
export class FormSubmission {
  @Field(() => String)
  _id: string;

  @Field(() => GraphQLJSON)
  submission: JSON;
}