import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
import { SchemaTypes } from 'mongoose';
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
  isDeleted: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Phase' })
  phase: string;
}

// @Schema()
// @ObjectType()
// export class ParticipantRelationship {
//   @Field(() => String)
//   @Prop()
//   _id: string;

//   @Field(() => String)
//   @Prop()
//   name: string;

//   @Field(() => GraphQLJSON)
//   @Prop({ type: Object, default: {} })
//   extra: JSON;
// }

export const EventSchema = SchemaFactory.createForClass(Event);