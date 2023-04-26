import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class Content {
  @Field(() => ID)
  _id: string;

  // @Prop([{ type: SchemaTypes.ObjectId, ref: 'resources' }])
  // recursos: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'content' }] })
  @Field(() => [String])
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

  @Prop({ type: SchemaTypes.Mixed })
  extra_options: Record<string, any>;

  @Prop({ type: 'boolean', default: false })
  @Field(() => Boolean)
  hide: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Phase' })
  @Field(() => String)
  phase: string;

  @Field(() => Date)
  @Prop({ type: Date })
  createdAt: Date;

  @Field(() => Date)
  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: 'boolean', default: false })
  @Field(() => Boolean)
  isDeleted: boolean;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
