import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Evaluation {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop()
  title: string;

  @Field(() => String, {
    nullable: true,
  })
  @Prop()
  description: string;

  @Field(() => GraphQLJSON, {
    description: 'Set of additional dynamic properties.',
  })
  @Prop({ type: Object })
  item: JSON;

  @Field(() => String)
  @Prop()
  evaluated: string;

  @Field(() => String)
  @Prop()
  reviewer: string;

  @Field(() => String)
  @Prop()
  form: string;

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

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);
