import { InputType, Field } from '@nestjs/graphql';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { AnnouncementTypes } from '../enums/announcement-types.enum';

@InputType()
export class CreateAnnouncementInput {
  @Field(() => String, { description: "Announcement name" })
  @IsString()
  name: string;

  @Field(() => String, { description: "Announcement description" })
  @IsString()
  description: string;

  @Field(() => String, { description: "Id of the form to render for submissions", nullable: true })
  @IsString()
  form: string;

  @Field(() => AnnouncementTypes, { description: "Announcement type" })
  @IsEnum(AnnouncementTypes)
  type: AnnouncementTypes;

  @Field(() => Date, { description: "Start date for the announcement to be available." })
  @IsDate()
  startAt: Date;

  @Field(() => Date, { description: "End date for the announcent to be unavailable" })
  @IsDate()
  endAt: Date;
}
