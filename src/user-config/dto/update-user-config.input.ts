import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql inputs
 */
@InputType()
export class UpdateUserConfigInput {
  @Field(() => String)
  @IsNotEmpty()
  _id: string;

  @Field(() => String)
  @IsNotEmpty()
  uid: string;

  @Field(() => GraphQLJSONObject)
  @IsNotEmpty()
  notifications: any;
}
