import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class PaginatedResult<TDocument> {
  @Field(() => Int)
  totalRecords: number;

  @Field(() => [GraphQLJSON])
  documents: TDocument[];
}