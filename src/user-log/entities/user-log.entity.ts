import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';

@Schema({ timestamps: true })
@ObjectType()
export class UserLog {
  @Field(() => ID)
  _id: string;

  @Field(() => GraphQLJSON, {
    description: 'Set of additional dynamic properties.',
  })
  @Prop({ type: Object })
  metadata: JSON;

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;
}

export const UserLogSchema = SchemaFactory.createForClass(UserLog);
