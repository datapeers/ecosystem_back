import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { TableJoin, TableJoinSchema } from './table-join';
import { ColumnGroup } from './column-group';
import { TableColumn } from 'src/shared/models/table-column';
/**
 * tables configs
 */
@Schema()
@ObjectType()
export class Table {
  @Field(() => ID)
  _id: string;

  @Field(() => String, {
    description: 'String key used to identify the table by its location.',
  })
  @Prop({ index: true, required: true })
  locator: string;

  @Field(() => String, { description: 'Form used by the table.' })
  @Prop({ required: true })
  form: string;

  @Field(() => [GraphQLJSON], {
    description: 'Table joins with related forms.',
    nullable: true,
  })
  @Prop({ default: [], schema: TableJoinSchema })
  joins?: TableJoin[];

  @Field(() => [GraphQLJSON], { description: 'Configurable columns.' })
  columns?: TableColumn[];

  @Field(() => [GraphQLJSON], { description: 'Configurable joined columns.' })
  columnGroups?: ColumnGroup[];
}
/**
 * @ignore
 */
export const TableSchema = SchemaFactory.createForClass(Table);
