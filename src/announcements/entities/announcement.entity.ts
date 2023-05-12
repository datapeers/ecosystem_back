import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Form } from 'src/forms/form/entities/form.entity';
import { AnnouncementTypes } from '../enums/announcement-types.enum';

@Schema({ timestamps: true })
@ObjectType()
export class Announcement {
  @Field(() => ID)
  _id: string;
  
  @Field(() => String, { description: "Announcement name" })
  @Prop({ default: "" })
  name: string;

  @Field(() => Boolean)
  @Prop({ default: false })
  published: boolean;

  @Field(() => String, { description: "Announcement description" })
  @Prop({ default: "" })
  description: string;

  @Field(() => String, { description: "Link to a small image to be used as thumbnail", nullable: true })
  @Prop({ default: '' })
  thumbnail: string;

  @Field(() => String, { description: "Landing page html" })
  @Prop({ default: "" })
  landing: string;

  @Field(() => Form, { description: "Id of the form to render for submissions", nullable: true })
  @Prop()
  form: string;

  @Field(() => String, { description: "Message text to include in the email after a form submit" })
  @Prop({ default: "" })
  emailMessage: string;

  @Field(() => String, { description: "Link for redirect after a form submit" })
  @Prop({ default: "" })
  redirectLink: string;

  @Field(() => AnnouncementTypes, { description: "Announcement type" })
  @Prop({ type: String, enum: AnnouncementTypes })
  type: AnnouncementTypes;

  @Field(() => Date, { description: "Start date for the announcement to be available." })
  @Prop({ type: Date })
  startAt: Date;

  @Field(() => Date, { description: "End date for the announcent to be unavailable" })
  @Prop({ type: Date })
  endAt: Date;

  @Field(() => String)
  @Prop({ required: true })
  createdBy: string;

  @Field(() => String, { nullable: true })
  @Prop()
  updatedBy: string;

  @Field(() => String, { nullable: true })
  @Prop()
  deletedBy: string;

  @Field(() => Date, { description: "Creation date of the entity"})
  createdAt: Date;

  @Field(() => Date, { description: "Date of the entity"})
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Prop()
  deletedAt: Date;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);