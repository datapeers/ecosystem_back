import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FormCollections } from '../enums/form-collections';
import { FormTag } from 'src/forms/form-tag/entities/form-tag.entity';
/**
 * forms config
 */
@Schema({ timestamps: true })
@ObjectType()
export class Form {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ default: '' })
  name: string;

  @Field(() => String)
  @Prop({ default: '' })
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

  @Field(() => [FormTag])
  @Prop({ default: [] })
  tags: string[];

  @Field(() => String, {
    description: 'Unique Id of the user who created the entity',
  })
  @Prop({ required: true })
  createdBy: string;

  @Field(() => String, {
    description: 'If set, Unique Id of the user who last updated the entity.',
    nullable: true,
  })
  @Prop()
  updatedBy: string;

  @Field(() => String, {
    description: 'If set, Unique Id of the user that deleted the entity.',
    nullable: true,
  })
  @Prop()
  deletedBy: string;

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;

  @Field(() => Date, {
    description: 'If set, The date the entity was deleted.',
    nullable: true,
  })
  @Prop()
  deletedAt: Date;
}
/**
 * @ignore
 */
@Schema()
@ObjectType()
export class FormDocument implements IFormDocument {
  @Field(() => String)
  @Prop({ default: '' })
  name: string;

  @Field(() => String)
  @Prop({ default: '' })
  observation: string;

  @Field(() => Boolean)
  @Prop({ default: true })
  optional: boolean;

  @Field(() => String)
  @Prop()
  key: string;
}
/**
 * @ignore
 */
export interface IFormDocument {
  name: string;
  observation: string;
  optional: boolean;
  key: string;
}
/**
 * @ignore
 */
export const FormSchema = SchemaFactory.createForClass(Form);
