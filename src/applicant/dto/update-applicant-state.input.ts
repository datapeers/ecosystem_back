import { InputType, Field } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApplicationStates } from '../enums/application-states.enum';
import { IAttachment } from '../entities/applicant.entity';
import { Type } from 'class-transformer';

/**
 * graphql input scheme
 */
@InputType()
export class UpdateApplicantStateInput {
  @Field(() => String)
  @IsString()
  id: string;

  @Field(() => String)
  @IsString()
  notes: string;

  @Field(() => [AttachmentSubmit])
  @ValidateNested()
  @IsArray()
  @Type(() => AttachmentSubmit)
  documents: AttachmentSubmit[];

  @Field(() => ApplicationStates)
  @IsEnum(ApplicationStates)
  type: ApplicationStates;
}

/**
 * graphql input scheme
 */
@InputType()
class AttachmentSubmit implements IAttachment {
  @Field(() => String, { description: 'Name of the attachment file.' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Url for the attachment file.' })
  @IsString()
  url: string;

  @Field(() => String, { description: 'Unique key used for the file.' })
  @IsString()
  key: string;
}
