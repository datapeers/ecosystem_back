import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';

@Schema({ timestamps: true })
@ObjectType()
export class ActivitiesConfig {
  @Field(() => ID)
  _id: string;

  @Field(() => Int)
  @Prop({ type: 'number', default: 0 })
  limit: number;

  @Field(() => Int)
  @Prop({ type: 'number', default: 0 })
  totalLimit: number;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Phase' })
  phase: string;

  @Field(() => [GraphQLJSONObject])
  @Prop({ type: SchemaTypes.Mixed, default: [] })
  availability: any[];

  @Field(() => [activities])
  @Prop({ default: [] })
  activities: activities[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Boolean)
  @Prop({ type: 'boolean', default: false })
  isDeleted: boolean;
}

@Schema()
@ObjectType()
export class activities {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId })
  idActivity: string;

  @Field(() => Int)
  limit: number;

  @Field(() => GraphQLJSONObject)
  @Prop({ type: SchemaTypes.Mixed })
  options: any;
}

export const ActivitiesConfigSchema =
  SchemaFactory.createForClass(ActivitiesConfig);
