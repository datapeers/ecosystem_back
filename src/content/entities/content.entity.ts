import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
import { Resource } from 'src/resources/entities/resource.entity';
/**
 * Sprints and content of a batch or phase
 */
@Schema({ timestamps: true })
@ObjectType()
export class Content {
  @Field(() => ID)
  _id: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Resource' }] })
  @Field(() => [Resource])
  resources: Resource[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Content' }] })
  @Field(() => [Content])
  childs: Content[];

  // @Prop([
  //   {
  //     participantId: { type: SchemaTypes.ObjectId },
  //     attendedBy: { type: SchemaTypes.ObjectId, ref: 'Empresario' },
  //     date: { type: Date },
  //   },
  // ])
  // attendance: {
  //   participantId: string;
  //   attendedBy: string;
  //   date: Date;
  // }[];

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => String)
  @Prop({ default: '' })
  content: string;

  @Field(() => GraphQLJSONObject)
  @Prop({ type: SchemaTypes.Mixed })
  extra_options: any;

  @Field(() => Boolean)
  @Prop({ type: 'boolean', default: false })
  hide: boolean;

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
/**
 * @ignore
 */
export const ContentSchema = SchemaFactory.createForClass(Content);
