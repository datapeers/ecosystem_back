import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
import { ResourceType } from '../enums/resources-types';
/**
 * resources like homeworks, downloadable and more
 */
@Schema({ timestamps: true })
@ObjectType()
export class Resource {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Prop({ type: SchemaTypes.Mixed, default: {} })
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

  @Prop({
    type: String,
    enum: ResourceType,
  })
  @Field(() => String)
  type: ResourceType;
}
/**
 * @ignore
 */
export const ResourceSchema = SchemaFactory.createForClass(Resource);
