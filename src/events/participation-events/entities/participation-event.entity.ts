import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
import { SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class ParticipationEvent {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Entrepreneur' })
  participant: string;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Startup' })
  startup: string;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Event' })
  event: string;

  @Field(() => GraphQLJSONObject)
  @Prop({ type: SchemaTypes.Mixed })
  metadata: any;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const ParticipationEventSchema =
  SchemaFactory.createForClass(ParticipationEvent);
