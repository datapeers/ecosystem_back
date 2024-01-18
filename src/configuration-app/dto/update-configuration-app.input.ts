import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';

/**
 * graphql scheme
 */
@InputType()
export class UpdateConfigurationAppInput {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  dashboard?: string;

  @Field(() => [GraphQLJSONObject], { nullable: true })
  @IsOptional()
  verticals: Record<string, any>[];

  @Field(() => [GraphQLJSONObject], { nullable: true })
  @IsOptional()
  services: Record<string, any>[];

  @Field(() => [GraphQLJSONObject], { nullable: true })
  @IsOptional()
  benefactors: Record<string, any>[];

  @Field(() => [GraphQLJSONObject], { nullable: true })
  @IsOptional()
  contentOfInterest: Record<string, any>[];
}
