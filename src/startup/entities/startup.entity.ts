import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
/**
 * startup docs
 */
@Schema({ timestamps: true })
@ObjectType()
export class Startup {
  @Field(() => ID)
  _id: string;

  @Field(() => [PhaseRelationship])
  @Prop({ default: [] })
  phases: PhaseRelationship[];

  @Field(() => [EntrepreneurRelationship])
  @Prop({ default: [] })
  entrepreneurs: EntrepreneurRelationship[];

  @Field(() => GraphQLJSON)
  @Prop({ type: Object })
  item: JSON;

  @Field(() => Date, {
    description: 'If set, The date the entity was deleted.',
    nullable: true,
  })
  @Prop()
  deletedAt: Date;

  @Field(() => User, {
    description: 'If set, Details from user who last updated the entity.',
    nullable: true,
  })
  @Prop()
  updatedBy: string;

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;

  @Field(() => Boolean, { nullable: true })
  isProspect: boolean;

  @Field(() => String, { nullable: true })
  @Prop({ default: '' })
  thumbnail: string;
}
/**
 * relationship with entrepreneurs
 */
@Schema()
@ObjectType()
export class EntrepreneurRelationship {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Entrepreneur' })
  _id: string;

  @Field(() => GraphQLJSON)
  @Prop({ type: Object })
  item: JSON;

  @Field(() => String)
  @Prop()
  rol: string;

  @Field(() => String)
  @Prop()
  description: string;

  @Field(() => String)
  @Prop()
  state: string;
}
/**
 * relationship with phases
 */
@Schema()
@ObjectType()
export class PhaseRelationship {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Phase' })
  _id: string;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop()
  state: string;
}
/**
 * @ignore
 */
export const StartupSchema = SchemaFactory.createForClass(Startup);
