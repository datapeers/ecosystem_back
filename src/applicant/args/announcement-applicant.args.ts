import { Field, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
/**
 * graphql args input
 */
@ArgsType()
export class AnnouncementApplicantArgs {
  @Field(() => String)
  @IsNotEmpty()
  announcement: string;

  @Field(() => String)
  @IsNotEmpty()
  participant: string;
}
