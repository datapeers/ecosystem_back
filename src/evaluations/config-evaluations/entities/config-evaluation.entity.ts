import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
/**
 * Config of evaluations in app, date, etc
 */
@Schema({ timestamps: true })
@ObjectType()
export class ConfigEvaluation {
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

  @Field(() => String)
  @Prop()
  evaluated: string;

  @Field(() => String)
  @Prop()
  reviewer: string;

  @Field(() => String)
  @Prop()
  form: string;

  @Field(() => String)
  @Prop()
  phase: string;

  @Field(() => Date)
  @Prop({ required: true })
  startAt: Date;

  @Field(() => Date)
  @Prop({ required: true })
  endAt: Date;

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
/**
 * @ignore
 */
export const ConfigEvaluationSchema =
  SchemaFactory.createForClass(ConfigEvaluation);
