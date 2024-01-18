import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
import { SchemaTypes, Types, Document } from 'mongoose';
/**
 * types of events dynamic
 */
@Schema({ timestamps: true })
@ObjectType()
export class TypesEvent {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => GraphQLJSONObject)
  @Prop({ type: SchemaTypes.Mixed })
  extra_options: any;

  @Field(() => Boolean)
  @Prop({ default: false })
  expertFocus: boolean;

  @Field(() => Boolean)
  @Prop({ default: false })
  isSchedulable: boolean;

  @Field(() => String)
  @Prop({ default: '' })
  scheduleUrl: string;

  @Field(() => String)
  @Prop({ default: '' })
  description: string;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
/**
 * @ignore
 */
export const TypesEventSchema = SchemaFactory.createForClass(TypesEvent);
