import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
import { SchemaTypes } from 'mongoose';
/**
 * Acta for events
 */
@Schema({ timestamps: true })
@ObjectType()
export class Acta {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => Date)
  @Prop({})
  date: Date;

  @Field(() => String)
  @Prop({})
  objective: string;

  @Field(() => String)
  @Prop({})
  solution: string;

  @Field(() => String)
  @Prop({})
  topics_covered: string;

  @Field(() => String)
  @Prop({})
  conclusions: string;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Phase' })
  phase: string;

  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Event' })
  event: string;

  @Field(() => GraphQLJSONObject)
  @Prop({ type: SchemaTypes.Mixed })
  extra_options: any;

  @Field(() => Boolean)
  @Prop({ default: false })
  closed: boolean;

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
export const ActaSchema = SchemaFactory.createForClass(Acta);
