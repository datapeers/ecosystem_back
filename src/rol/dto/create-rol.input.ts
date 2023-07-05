import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';

@InputType()
export class CreateRolInput {
  @Field(() => String)
  @IsNotEmpty()
  rol: string;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  permissions: Record<string, any>;
}
