import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { Resource } from 'src/resources/entities/resource.entity';
import { User } from 'src/users/entities/user.entity';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Startup } from 'src/startup/entities/startup.entity';
import { Content } from 'src/content/entities/content.entity';

@Schema({ timestamps: true })
@ObjectType()
export class ResourcesReply {
  @Field(() => ID)
  _id: string;

  @Field(() => GraphQLJSON, {
    description: 'Set of additional dynamic properties.',
  })
  @Prop({ type: Object })
  item: JSON;

  @Prop({ type: { type: Types.ObjectId, ref: 'Startup' } })
  @Field(() => Startup)
  startup: string;

  @Prop({ type: { type: Types.ObjectId, ref: 'Resource' } })
  @Field(() => Resource)
  resource: string;

  @Prop({ type: { type: Types.ObjectId, ref: 'Content' } })
  @Field(() => Content)
  sprint: string;

  @Field(() => String)
  @Prop({ default: '' })
  type: string;

  @Field(() => String)
  @Prop({ default: 'En revisión' })
  state: string;

  @Field(() => String)
  @Prop({ default: '' })
  observations: string;

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;
}

export const ResourceReplySchema = SchemaFactory.createForClass(ResourcesReply);
