import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
import { SchemaTypes } from 'mongoose';

@Schema()
@ObjectType()
export class UserConfig {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  uid: string;

  @Field(() => GraphQLJSONObject)
  @Prop({ type: SchemaTypes.Mixed })
  notifications: any;
}

export const UserConfigSchema = SchemaFactory.createForClass(UserConfig);
