import { Field, ArgsType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ArgsType()
export class SubmitFormSubscriptionArgs {
  @Field(() => String)
  id: string;

  @Field(() => GraphQLJSON)
  data: JSON;
}
