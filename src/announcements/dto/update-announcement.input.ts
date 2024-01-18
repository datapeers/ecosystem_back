import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { CreateAnnouncementInput } from './create-announcement.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

/**
 * graphql input scheme
 */
@InputType()
export class UpdateAnnouncementInput extends PartialType(CreateAnnouncementInput) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  landing?: string;
  
  @Field(() => String, { nullable: true })
  @IsString()
  redirectLink?: string;
  
  @Field(() => String, { nullable: true })
  @IsString()
  exitText?: string;

  published?: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  thumbnail?: string;

  @Field(() => Date, { nullable: true })
  @IsDate()
  startAt?: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  endAt?: Date;
}
