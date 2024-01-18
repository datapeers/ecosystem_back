import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { Resource } from 'src/resources/entities/resource.entity';
import { User } from 'src/users/entities/user.entity';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Startup } from 'src/startup/entities/startup.entity';
import { Content } from 'src/content/entities/content.entity';
import { Phase } from 'src/phases/entities/phase.entity';
/**
 * resources replies by users
 */
@Schema({ timestamps: true })
@ObjectType()
export class ResourcesReply {
  @Field(() => ID)
  _id: string;

  @Field(() => GraphQLJSON, {
    description: 'Set of additional dynamic properties.',
  })
  @Prop({ type: Object })
  item: Record<string, any>;

  @Field(() => Startup)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Startup' })
  startup: string;

  @Field(() => Resource)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Resource' })
  resource: string;

  @Field(() => Content)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Content' })
  sprint: string;

  @Field(() => Phase)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Phase' })
  phase: string;

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

  @Field(() => Boolean)
  @Prop({ default: true })
  modified: boolean;
}
/**
 * @ignore
 */
export const ResourceReplySchema = SchemaFactory.createForClass(ResourcesReply);
