import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { TableColumn } from 'src/shared/models/table-column';
/**
 * columns of tables
 */
@ObjectType()
export class ColumnGroup {
  @Field()
  name: string;

  @Field()
  key: string;

  @Field(() => GraphQLJSON, { description: 'Configurable columns.' })
  columns: TableColumn[];
}
