import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmailTemplates } from '../enums/email-templates';
/**
 * @ignore
 */
export abstract class Template {
  @IsString()
  @IsEmail()
  @IsOptional()
  from?: string;

  template: EmailTemplates;
  personalizations: TemplatePersonalization[];
  templateId?: string;
}

/**
 * @ignore
 */
export abstract class TemplatePersonalization {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsArray()
  @Type(() => Recipient)
  to: Recipient[];
}

/**
 * @ignore
 */
class Recipient {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
