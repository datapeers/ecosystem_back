import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
/**
 * Evaluations done
 */
@Schema({ timestamps: true })
@ObjectType()
export class Evaluation {
  @Field(() => ID)
  _id: string;

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

  @Field(() => String)
  @Prop()
  config: string;

  @Field(() => String)
  @Prop({ default: 'evaluado' })
  state: string;

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
export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);
