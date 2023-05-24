import { IsNotEmpty, IsOptional } from 'class-validator';
import { InputType, Field, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class UpdateTableConfigInput {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @Field(() => [GraphQLJSON], { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  columns?: JSON[];

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  loadEvent?: JSON;
}
