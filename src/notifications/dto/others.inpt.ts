import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class OthersInput {
  @Field(() => GraphQLJSON) // Puedes utilizar JSON o GraphQLScalarType personalizado
  others: JSON;
}
