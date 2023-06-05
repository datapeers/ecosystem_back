import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class SubmitAnnouncementDocInput {
  @Field(() => String, { description: "Announcement id." })
  @IsString()
  announcement: string;

  @Field(() => String, { description: "Announcement participant id." })
  @IsString()
  participant: string;

  @Field(() => GraphQLJSON, { description: "Id of the form to render for submissions" })
  @IsNotEmpty()
  submission: JSON;
}
