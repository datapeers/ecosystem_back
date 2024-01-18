import { Field, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
/**
 * graphql args input
 */
@ArgsType()
export class SubmitFormSubscriptionArgs {
  @Field(() => String)
  @IsNotEmpty()
  id: string;

  @Field(() => GraphQLJSON)
  @IsNotEmpty()
  data: JSON;
}
