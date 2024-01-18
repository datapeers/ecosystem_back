import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql inputs
 */
@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  uid: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  fullName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  email: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  profileImageUrl?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  relationsAssign?: Record<string, any>;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  permissions: string[];
}
