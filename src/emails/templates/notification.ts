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
export class NotificationTemplate extends Template {
  from?: string;

  @IsEnum(EmailTemplates)
  template: EmailTemplates.notification = EmailTemplates.notification;

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => NotificationPersonalization)
  personalizations: NotificationPersonalization[];
  templateId?: string;
}
/**
 * @ignore
 */
class NotificationTemplateData extends TemplateData {
  @IsString()
  @IsNotEmpty()
  notification: string;
}
/**
 * @ignore
 */
export class NotificationPersonalization extends TemplatePersonalization {
  @ValidateNested()
  @IsNotEmpty()
  @Type()
  dynamicTemplateData: NotificationTemplateData;
}
