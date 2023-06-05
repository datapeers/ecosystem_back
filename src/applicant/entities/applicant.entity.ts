import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { User } from 'src/users/entities/user.entity';
import { ApplicationStates } from '../enums/application-states.enum';
import { FormFileSubmission } from 'src/forms/factories/form-file-submission';

@Schema({ timestamps: true })
@ObjectType()
export class Applicant {
  @Field(() => ID)
  _id: string;

  @Field(() => GraphQLJSON, { description: "Set of additional dynamic properties." })
  @Prop({ type: Object })
  item: JSON;

  @Field(() => [FormFileSubmission])
  @Prop({ default: [] })
  documents: FormFileSubmission[];

  @Field(() => String, { description: "Id of the announcement this document is associated to." })
  @Prop({ required: true })
  announcement: string;

  @Field(() => String, { description: "Unique identifier for non-anonymous submissions.", nullable: true })
  @Prop()
  participant: string;

  @Field(() => [ApplicantState], { description: "Id of the announcement this document is associated to." })
  @Prop({ required: true })
  states: ApplicantState[];

  @Field(() => Date, { description: "If set, The date the entity was deleted.", nullable: true })
  @Prop()
  deletedAt: Date;

  @Field(() => User, { description: "If set, Details from user who last updated the entity.", nullable: true })
  @Prop()
  updatedBy: string;

  @Field(() => Date, { description: "Date of entity creation."})
  createdAt: Date;

  @Field(() => Date, { description: "Date of last entity update."})
  updatedAt: Date;
}

export const ApplicantSchema = SchemaFactory.createForClass(Applicant);

@ObjectType()
export class ApplicantState {
  @Field(() => String)
  @Prop({ default: "" })
  notes: string;

  @Field(() => [Attachment])
  @Prop({ default: [] })
  documents: [];

  @Field(() => ApplicationStates)
  @Prop({ required: true, enum: ApplicationStates })
  type: ApplicationStates;
}

@ObjectType()
export class Attachment implements IAttachment {
  @Field(() => String, { description: "Name of the attachment file." })
  @Prop({ default: "" })
  name: string;

  @Field(() => String, { description: "Additional details for the attachment." })
  @Prop({ default: "" })
  observation: string;

  @Field(() => String)
  @Prop()
  key: string;
}

export interface IAttachment {
  name: string;
  observation: string;
  key: string;
}