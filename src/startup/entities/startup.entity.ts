import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { User } from 'src/users/entities/user.entity';

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
  startups: EntrepreneurRelationship[];

  @Field(() => GraphQLJSON)
  @Prop({ type: Object })
  item: JSON;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => User, { nullable: true })
  @Prop({ default: "" })
  updatedBy: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@Schema()
@ObjectType()
export class EntrepreneurRelationship {
  @Field(() => String)
  @Prop()
  _id: string;
  
  @Field(() => String)
  @Prop()
  name: string;
}

@Schema()
@ObjectType()
export class PhaseRelationship {
  @Field(() => String)
  @Prop()
  _id: string;
  
  @Field(() => String)
  @Prop()
  name: string;
}

export const StartupSchema = SchemaFactory.createForClass(Startup);