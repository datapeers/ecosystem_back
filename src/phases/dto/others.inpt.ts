import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class SearchBatchInput {
  @Field(() => String)
  @IsOptional()
  searchValue?: string;

  @Field(() => [String])
  @IsOptional()
  batchIds?: string[];
}