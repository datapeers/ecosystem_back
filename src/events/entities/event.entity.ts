import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
import { SchemaTypes } from 'mongoose';
/**
 * Events docs
 */
@Schema({ timestamps: true })
@ObjectType()
export class Event {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => String)
  @Prop({ required: true })
  type: string;

  @Field(() => String)
  @Prop({ required: true })
  attendanceType: string;

  @Field(() => String)
  @Prop({})
  description: string;

  @Field(() => GraphQLJSONObject)
  @Prop({ type: SchemaTypes.Mixed })
  extra_options: any;

  @Field(() => Date)
  @Prop({ required: true })
  startAt: Date;

  @Field(() => Date)
  @Prop({ required: true })
  endAt: Date;

  @Field(() => Boolean)
  @Prop({ default: false })
  isCanceled: boolean;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Phase' })
  batch: string;

  @Field(() => [ExpertEventLink])
  @Prop({ default: [] })
  experts: ExpertEventLink[];

  @Field(() => [TeamCoachLink])
  @Prop({ default: [] })
  teamCoaches: TeamCoachLink[];

  @Field(() => [ParticipantEventLink])
  @Prop({ default: [] })
  participants: ParticipantEventLink[];
}
/**
 * team coach link
 */
@Schema()
@ObjectType()
export class TeamCoachLink implements IEntityEvent {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  _id: string;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop()
  email: string;
}
/**
 * expert link
 */
@Schema()
@ObjectType()
export class ExpertEventLink implements IEntityEvent {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Expert' })
  _id: string;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop()
  email: string;
}

/**
 * participant link
 */
@Schema()
@ObjectType()
export class ParticipantEventLink implements IEntityEvent {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Entrepreneur' })
  _id: string;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop()
  email: string;

  @Field(() => String, { nullable: true })
  @Prop()
  startupEntrepreneur: string;
}
/**
 * @ignore
 */
export interface IEntityEvent {
  _id: string;
  name: string;
  email: string;
}
/**
 * @ignore
 */
export const EventSchema = SchemaFactory.createForClass(Event);
