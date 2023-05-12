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
  limit: number;

  @Field(() => Int)
  totalLimit: number;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Phase' })
  phase: string;

  @Field(() => GraphQLJSONObject)
  @Prop({ type: SchemaTypes.Mixed })
  availability: any;

  @Field(() => [activities])
  @Prop({ default: [] })
  activities: activities[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
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
