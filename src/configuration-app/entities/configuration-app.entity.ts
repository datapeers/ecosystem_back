import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * Main configuration of app
 */
@Schema({ timestamps: true })
@ObjectType()
export class ConfigurationApp {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  dashboard: string;

  @Field(() => [GraphQLJSONObject])
  @Prop({ type: [{ type: SchemaTypes.Mixed }] })
  verticals: Record<string, any>[];

  @Field(() => [GraphQLJSONObject])
  @Prop({ type: [{ type: SchemaTypes.Mixed }] })
  services: Record<string, any>[];

  @Field(() => [GraphQLJSONObject])
  @Prop({ type: [{ type: SchemaTypes.Mixed }] })
  benefactors: Record<string, any>[];

  @Field(() => [GraphQLJSONObject])
  @Prop({ type: [{ type: SchemaTypes.Mixed }] })
  contentOfInterest: Record<string, any>[];

  @Field(() => Date, { description: 'Creation date of the entity.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Update date of the entity.' })
  updatedAt: Date;
}
/**
 * @ignore
 */
export const ConfigurationAppSchema =
  SchemaFactory.createForClass(ConfigurationApp);
