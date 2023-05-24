import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { SchemaTypes } from 'mongoose';

@Schema()
@ObjectType()
export class TableConfig {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => String, { description: "Id of the parent table." })
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  table: string;

  @Field(() => [GraphQLJSON])
  @Prop({ required: true, default: [] })
  columns: JSON[];

  @Field(() => GraphQLJSON, { nullable: true })
  @Prop({ type: Object })
  loadEvent: JSON;

  @Field(() => Date, { description: "If set, The date the entity was deleted.", nullable: true })
  @Prop()
  deletedAt: Date;
}

export const TableConfigSchema = SchemaFactory.createForClass(TableConfig);