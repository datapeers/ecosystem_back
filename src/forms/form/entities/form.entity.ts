import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FormCollections } from '../enums/form-collections';
import { FormTag } from 'src/forms/form-tag/entities/form-tag.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Form {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ default: "" })
  name: string;

  @Field(() => String)
  @Prop({ default: "" })
  description: string;

  @Field(() => String)
  @Prop({ required: true })
  formJson: string;

  @Field(() => String)
  @Prop({ enum: FormCollections, required: true })
  target: FormCollections;

  @Field(() => [FormDocument])
  @Prop({ default: [] })
  documents: FormDocument[];

  @Field(() => [String])
  @Prop({ default: [] })
  keys: string[];

  @Field(() => String)
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Field(() => [FormTag])
  @Prop({ default: [] })
  tags: string[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@Schema()
@ObjectType()
export class FormDocument implements IFormDocument {
  @Field(() => String)
  @Prop({ default: "" })
  name: string;

  @Field(() => String)
  @Prop({ default: "" })
  observation: string;

  @Field(() => Boolean)
  @Prop({ default: true })
  optional: boolean;

  @Field(() => String)
  @Prop()
  key: string;
}

export interface IFormDocument {
  name: string;
  observation: string;
  optional: boolean;
  key: string;
}

export const FormSchema = SchemaFactory.createForClass(Form);