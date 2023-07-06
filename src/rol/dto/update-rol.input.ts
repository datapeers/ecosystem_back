import { CreateRolInput } from './create-rol.input';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';

@InputType()
export class UpdateRolInput extends PartialType(CreateRolInput) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  permissions?: Record<string, any>;
}
