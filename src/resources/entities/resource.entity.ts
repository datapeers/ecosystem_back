import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';

@Schema({ timestamps: true })
@ObjectType()
export class Resource {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => GraphQLJSONObject)
  @Prop({ type: SchemaTypes.Mixed })
  extra_options: any;

  @Field(() => Boolean)
  @Prop({ type: 'boolean', default: false })
  hide: boolean;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Content' })
  content: string;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Phase' })
  phase: string;

  @Field(() => Date)
  @Prop({ type: Date })
  createdAt: Date;

  @Field(() => Date)
  @Prop({ type: Date })
  updatedAt: Date;

  @Field(() => Boolean)
  @Prop({ type: 'boolean', default: false })
  isDeleted: boolean;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
