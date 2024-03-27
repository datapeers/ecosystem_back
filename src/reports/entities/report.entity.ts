import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
import { SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class Report {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => String)
  @Prop({ required: true })
  url: string;

  @Field(() => GraphQLJSONObject)
  @Prop({ type: SchemaTypes.Mixed })
  query: any;
}

/**
 * @ignore
 */
export const ReportSchema = SchemaFactory.createForClass(Report);
