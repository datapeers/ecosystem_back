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

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Phase' })
  phase: string;

  @Field(() => [activities])
  @Prop({ default: [] })
  activities: activities[];

  @Field(() => [Assign])
  @Prop({ default: [] })
  startups: Assign[];

  @Field(() => [Assign])
  @Prop({ default: [] })
  experts: Assign[];

  @Field(() => [Assign])
  @Prop({ default: [] })
  teamCoaches: Assign[];

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
export class activities implements IActivities {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId })
  id: string;

  @Field(() => Int)
  limit: number;
}

@Schema()
@ObjectType()
export class Assign implements IAssign {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId })
  id: string;

  @Field(() => Int)
  limit: number;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId })
  activityID: string;
}

export interface IActivities {
  id: string;
  limit: number;
}

export interface IAssign {
  id: string;
  limit: number;
  activityID: string;
}

export const ActivitiesConfigSchema =
  SchemaFactory.createForClass(ActivitiesConfig);
