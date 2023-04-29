import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { Form } from 'src/forms/form/entities/form.entity';
import { FormCollections } from 'src/forms/form/enums/form-collections';

@Schema({ timestamps: true })
@ObjectType()
export class FormSubscription {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { nullable: true })
  @Prop({ default: "" })
  doc: string;

  @Field(() => GraphQLJSON, { nullable: true })
  submission: JSON;

  @Field(() => Form)
  @Prop({ required: true })
  form: string;

  @Field(() => Boolean)
  @Prop({ default: true })
  opened: boolean;

  @Field(() => GraphQLJSON, { nullable: true })
  @Prop({ type: Object })
  data?: JSON;

  @Field(() => String, { nullable: true })
  @Prop({ default: "" })
  reason?: string;

  @Field(() => FormCollections)
  @Prop({ enum: FormCollections })
  target: FormCollections;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const FormSubscriptionSchema = SchemaFactory.createForClass(FormSubscription);