import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import GraphQLJSON from 'graphql-type-json';
import { PhaseRelationship } from 'src/startup/entities/startup.entity';
/**
 * Entrepreneur docs
 */
@Schema({ timestamps: true })
@ObjectType()
export class Entrepreneur {
  @Field(() => ID)
  _id: string;

  @Field(() => [StartupRelationship])
  @Prop({ default: [] })
  startups: StartupRelationship[];

  @Field(() => [BusinessRelationship])
  @Prop({ default: [] })
  businesses: BusinessRelationship[];

  @Field(() => User, { nullable: true })
  @Prop({ default: '' })
  accountId: string;

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
}
/**
 * @ignore
 */
export const EntrepreneurSchema = SchemaFactory.createForClass(Entrepreneur);
/**
 * Relationship between entrepreneur and startup
 */
@Schema()
@ObjectType()
export class StartupRelationship {
  @Field(() => String)
  @Prop()
  _id: string;

  @Field(() => GraphQLJSON)
  @Prop({ type: Object })
  item: JSON;

  @Field(() => [PhaseRelationship], { defaultValue: [] })
  @Prop({ default: [] })
  phases: PhaseRelationship[];

  @Field(() => String)
  @Prop()
  state: string;
}
/**
 * Relationship between entrepreneur and business
 */
@Schema()
@ObjectType()
export class BusinessRelationship {
  @Field(() => String)
  @Prop()
  _id: string;

  @Field(() => GraphQLJSON)
  @Prop({ type: Object })
  item: JSON;
}
