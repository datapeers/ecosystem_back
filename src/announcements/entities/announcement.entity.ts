import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Form } from 'src/forms/form/entities/form.entity';
import { AnnouncementTypes } from '../enums/announcement-types.enum';
import { AnnouncementTargets } from '../enums/announcement-targets.enum';

/**
 * announcements
 */
@Schema({ timestamps: true })
@ObjectType()
export class Announcement {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { description: 'Announcement name.' })
  @Prop({ default: '' })
  name: string;

  @Field(() => Boolean, {
    description:
      'Boolean flag that defines if the announcement has been published.',
  })
  @Prop({ default: false })
  published: boolean;

  @Field(() => String, { description: 'Announcement description.' })
  @Prop({ default: '' })
  description: string;

  @Field(() => String, {
    description: 'Link to a small image to be used as thumbnail',
    nullable: true,
  })
  @Prop({ default: '' })
  thumbnail: string;

  @Field(() => String, { description: 'Landing page html' })
  @Prop({ default: '' })
  landing: string;

  @Field(() => Form, {
    description: 'Id of the form to render for submissions.',
    nullable: true,
  })
  @Prop()
  form: string;

  @Field(() => String, {
    description: 'Message text to include in the email after a form submit.',
  })
  @Prop({ default: '' })
  emailMessage: string;

  @Field(() => String, {
    description: 'Link for redirect after a form submit.',
  })
  @Prop({ default: '' })
  redirectLink: string;

  @Field(() => String, {
    description: 'Text shown after the announcement has been submitted.',
  })
  @Prop({
    default:
      'Sus respuestas se han registrado con exito, gracias por participar en la convocatoria.',
  })
  exitText: string;

  @Field(() => AnnouncementTypes, { description: 'Announcement type.' })
  @Prop({ type: String, enum: AnnouncementTypes })
  type: AnnouncementTypes;

  @Field(() => AnnouncementTargets, {
    description: 'Announcement target entity.',
  })
  @Prop({
    type: String,
    enum: AnnouncementTargets,
    default: AnnouncementTargets.entrepreneurs,
  })
  target: AnnouncementTargets;

  @Field(() => Date, {
    description: 'Start date for the announcement to be available.',
  })
  @Prop({ type: Date })
  startAt: Date;

  @Field(() => Date, {
    description: 'End date for the announcent to be unavailable.',
  })
  @Prop({ type: Date })
  endAt: Date;

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
export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
