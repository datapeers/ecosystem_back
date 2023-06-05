import { Field, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class AnnouncementApplicantArgs {
  @Field(() => String)
  @IsNotEmpty()
  announcement: string;

  @Field(() => String)
  @IsNotEmpty()
  participant: string;
}
