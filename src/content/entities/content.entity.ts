import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Phase } from 'src/phases/entities/phase.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Content {
  @Field(() => ID)
  _id: string;

  // @Prop([{ type: SchemaTypes.ObjectId, ref: 'resources' }])
  // recursos: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'content' }] })
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

  @Prop()
  content: string;

  @Prop({ default: false })
  hide: boolean;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ type: { type: Types.ObjectId, ref: 'phases' } })
  phase: Phase;

  // @Prop({ type: Types. })
  // item: any;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
