import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';

@Schema()
@ObjectType()
export class Table {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { description: "String key used to identify the table by its location." })
  @Prop({ index: true, required: true })
  locator: string;

  @Field(() => String, { description: "Form used by the table." })
  @Prop({ required: true })
  form: string;

  @Field(() => GraphQLJSON, { description: "Configurable columns" })
  columns?: JSON[];
}

export const TableSchema = SchemaFactory.createForClass(Table);