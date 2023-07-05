import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class Rol {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  rol: string;

  @Field(() => GraphQLJSON)
  @Prop({ type: Object })
  permissions: JSON;

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;
}

export const RolSchema = SchemaFactory.createForClass(Rol);
