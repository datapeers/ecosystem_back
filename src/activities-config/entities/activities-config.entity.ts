import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
/**
 * the configuration of activities are the documents that have the global limit of hours of a batch, its allocation of hours per activity as well as the allocations to experts, startups and teamcoaches.
 */
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
/**
 * assigned activity config
 */
@Schema()
@ObjectType()
export class activities implements IActivities {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId })
  id: string;

  @Field(() => Int)
  limit: number;
}
/**
 * assigned entity config
 */
@Schema()
@ObjectType()
export class Assign implements IAssign {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId })
  entityID: string;

  @Field(() => Int)
  limit: number;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId })
  activityID: string;
}
/**
 * @ignore
 */
export interface IActivities {
  id: string;
  limit: number;
}
/**
 * @ignore
 */
export interface IAssign {
  entityID: string;
  limit: number;
  activityID: string;
}
/**
 * @ignore
 */
export const ActivitiesConfigSchema =
  SchemaFactory.createForClass(ActivitiesConfig);
