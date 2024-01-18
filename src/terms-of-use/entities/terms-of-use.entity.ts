import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * terms of use display for experts
 */
@Schema({ timestamps: true })
@ObjectType()
export class TermsOfUse {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true, unique: true })
  name: string;

  @Field(() => String)
  @Prop({ required: true, default: '' })
  content: string;

  @Field(() => GraphQLJSONObject)
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  extra_options: any;

  @Field(() => Date)
  @Prop({ type: Date })
  createdAt: Date;

  @Field(() => Date)
  @Prop({ type: Date })
  updatedAt: Date;
}
/**
 * @ignore
 */
export const TermsOfUseSchema = SchemaFactory.createForClass(TermsOfUse);
