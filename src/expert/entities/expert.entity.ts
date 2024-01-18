import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
/**
 * Expert docs
 */
@Schema({ timestamps: true })
@ObjectType()
export class Expert {
  @Field(() => ID)
  _id: string;

  @Field(() => User, { nullable: true })
  @Prop({ default: '' })
  accountId: string;

  @Field(() => String, { nullable: true })
  @Prop({ default: '' })
  calendlyLink: string;

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

  @Field(() => [PhaseExpertRelationship])
  @Prop({ default: [] })
  phases: PhaseExpertRelationship[];

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;

  @Field(() => Boolean)
  isProspect: boolean;
}
/**
 * relationship with phase
 */
@Schema()
@ObjectType()
export class PhaseExpertRelationship {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Phase' })
  _id: string;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => [StartupLink])
  @Prop({ default: [] })
  startUps: StartupLink[];
}
/**
 * relationship with startup
 */
@Schema()
@ObjectType()
export class StartupLink {
  @Field(() => String)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Startup' })
  _id: string;

  @Field(() => String)
  @Prop()
  name: string;
}
/**
 * @ignore
 */
export const ExpertSchema = SchemaFactory.createForClass(Expert);
