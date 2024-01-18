import { Template, TemplatePersonalization } from './template';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TemplateData } from './data';
import { Type } from 'class-transformer';
import { EmailTemplates } from '../enums/email-templates';
/**
 * @ignore
 */
export class InvitationTemplate extends Template {
  from?: string;

  @IsEnum(EmailTemplates)
  template: EmailTemplates.invitation = EmailTemplates.invitation;

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => InvitationPersonalization)
  personalizations: InvitationPersonalization[];
  templateId?: string;
}
/**
 * @ignore
 */
class InvitationTemplateData extends TemplateData {
  @IsNotEmpty()
  @IsString()
  redirectUri: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
/**
 * @ignore
 */
export class InvitationPersonalization extends TemplatePersonalization {
  @ValidateNested()
  @IsNotEmpty()
  @Type()
  dynamicTemplateData: InvitationTemplateData;
}
