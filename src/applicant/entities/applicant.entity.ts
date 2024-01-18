import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { User } from 'src/users/entities/user.entity';
import { ApplicationStates } from '../enums/application-states.enum';
import { FormFileSubmission } from 'src/forms/factories/form-file-submission';

/**
 * is the follow-up of an applicant to the announcement, with the documents and their status.
 */
@ObjectType()
export class ApplicantState {
  @Field(() => String)
  @Prop({ default: '' })
  notes: string;

  @Field(() => [Attachment])
  @Prop({ default: [] })
  documents: Attachment[];

  @Field(() => ApplicationStates)
  @Prop({ required: true, enum: ApplicationStates })
  type: ApplicationStates;
}
/**
 * when someone participates in a call for proposals this type of document is generated
 */
@Schema({ timestamps: true })
@ObjectType()
export class Applicant {
  @Field(() => ID)
  _id: string;

  @Field(() => GraphQLJSON, {
    description: 'Set of additional dynamic properties.',
  })
  @Prop({ type: Object })
  item: JSON;

  @Field(() => GraphQLJSON, { nullable: true })
  documentsFields?: Record<string, string>;

  @Field(() => [FormFileSubmission], {
    description: 'Submitted files from announcement form.',
    nullable: true,
  })
  @Prop({ default: [] })
  documents?: FormFileSubmission[];

  @Field(() => String, {
    description: 'Id of the announcement this document is associated to.',
  })
  @Prop({ required: true })
  announcement: string;

  @Field(() => String, {
    description: 'Unique identifier for non-anonymous submissions.',
    nullable: true,
  })
  @Prop()
  participant: string;

  @Field(() => ApplicantState, { nullable: true })
  state?: ApplicantState;

  @Field(() => [ApplicantState], {
    description: 'Id of the announcement this document is associated to.',
  })
  @Prop({
    required: true,
    default: [{ notes: '', documents: [], type: ApplicationStates.enrolled }],
  })
  states: ApplicantState[];

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

  @Field(() => GraphQLJSON, {
    description: 'Batch assign if participant is selected',
    nullable: true,
  })
  @Prop({ type: Object })
  batch: Record<string, any>;
}
/**
 * @ignore
 */
export const ApplicantSchema = SchemaFactory.createForClass(Applicant);
/**
 * extract token from header
 */
@ObjectType()
export class Attachment implements IAttachment {
  @Field(() => String, { description: 'Name of the attachment file.' })
  @Prop({ default: '' })
  name: string;

  @Field(() => String, { description: 'Url for the attachment file.' })
  @Prop({ default: '' })
  url: string;

  @Field(() => String, { description: 'Unique key used for the file.' })
  @Prop({ default: '' })
  key: string;
}
/**
 * extract token from header
 */
export interface IAttachment {
  name: string;
  url: string;
  key: string;
}
