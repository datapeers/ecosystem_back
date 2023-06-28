import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
import { SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class Site {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => String, {
    description: 'Link to a small image to be used as thumbnail.',
    nullable: true,
  })
  @Prop({ default: '' })
  thumbnail: string;

  @Field(() => String, {
    nullable: true,
  })
  @Prop({ default: '' })
  description: string;

  @Field(() => GraphQLJSONObject)
  @Prop({ type: SchemaTypes.Mixed, required: true })
  coords: any;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date, { description: 'Creation date of the entity.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Update date of the entity.' })
  updatedAt: Date;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
