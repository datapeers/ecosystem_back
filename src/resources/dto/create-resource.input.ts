import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
import { ResourceType } from '../enums/resources-types';
/**
 * graphql input scheme
 */
@InputType()
export class CreateResourceInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  extra_options: Record<string, any>;

  @Field(() => String)
  @IsNotEmpty()
  phase: string;

  @Field(() => String)
  @IsNotEmpty()
  content: string;

  @Field(() => ResourceType)
  @IsNotEmpty()
  type: ResourceType;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  hide?: boolean;
}
