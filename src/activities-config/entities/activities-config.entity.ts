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

  @Field(() => [assigns])
  @Prop({ default: [] })
  startups: assigns[];

  @Field(() => [assigns])
  @Prop({ default: [] })
  experts: assigns[];

  @Field(() => [assigns])
  @Prop({ default: [] })
  teamCoaches: assigns[];

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
export class assigns {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId })
  to: string;

  @Field(() => Int)
  limit: number;
}

@Schema()
@ObjectType()
export class activities {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId })
  idActivity: string;

  @Field(() => Int)
  limit: number;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  options: any;
}

export interface IActivities {
  idActivity: string;
  limit: number;
  options: any;
}

export const ActivitiesConfigSchema =
  SchemaFactory.createForClass(ActivitiesConfig);
