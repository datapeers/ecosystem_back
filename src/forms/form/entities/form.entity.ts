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
  @Prop()
  formJson: string;

  @Field(() => String)
  @Prop({ enum: FormCollections })
  target: FormCollections;

  @Field(() => [String])
  @Prop()
  documents: [{}];

  @Field(() => [String])
  @Prop()
  keys: string[];
  
  @Field(() => String)
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Field(() => [FormTag])
  @Prop()
  tags: string[];
}

export const FormSchema = SchemaFactory.createForClass(Form);